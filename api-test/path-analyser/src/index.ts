import { mkdir, writeFile, readFile as readFileAsync } from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadGraph, loadOpenApiSemanticHints } from './graphLoader.js';
import { generateScenariosForEndpoint } from './scenarioGenerator.js';
import { generateFeatureCoverageForEndpoint } from './featureCoverageGenerator.js';
import { writeExtractionOutputs } from './extractSchemas.js';
import { buildCanonicalShapes } from './canonicalSchemas.js';
import { ResponseShapeSummary } from './types.js';
import { normalizeEndpointFileName } from './utils.js';
import { GenerationSummary, GenerationSummaryEntry } from './types.js';

async function main() {
  // Robust base directory detection: if the current working directory already IS the
  // path-analyser package (ends with 'api-test/path-analyser'), use it directly;
  // otherwise (e.g. invoked from repo root) append the relative path.
  const cwd = process.cwd();
  const suffix = path.join('api-test', 'path-analyser');
  const baseDir = cwd.endsWith(suffix) ? cwd : path.resolve(cwd, suffix);
  const outputDir = path.resolve(baseDir, 'dist/output');
  const featureDir = path.resolve(baseDir, 'dist/feature-output');
  await mkdir(outputDir, { recursive: true });
  await mkdir(featureDir, { recursive: true });

  const graph = await loadGraph(baseDir);
  // Build canonical deep schema shapes (requests + responses)
  const canonical = await buildCanonicalShapes(path.resolve(baseDir, '../../'));
  // Validate domain valueBindings against canonical response paths (fail-hard soon; warn now)
  const validationErrors: string[] = [];
  const opReqs = graph.domain?.operationRequirements || {};
  for (const [opId, req] of Object.entries<any>(opReqs)) {
    if (!req.valueBindings) continue;
    const shape = canonical[opId];
    const respSet = new Set((shape?.response || []).map(n => n.path));
    for (const key of Object.keys(req.valueBindings)) {
      if (!key.startsWith('response.')) continue;
      const raw = key.slice('response.'.length).replace(/\[\]/g,'[]');
      if (!respSet.has(raw)) {
        validationErrors.push(`${opId}: '${raw}' not in canonical response shape`);
      }
    }
  }
  if (validationErrors.length) {
    const msg = 'Canonical path validation failed with ' + validationErrors.length + ' issue(s)\n' + validationErrors.map(e=>'  - '+e).join('\n');
    throw new Error(msg);
  }
  // Extract response shapes & request variants (oneOf groups)
  const semanticTypes = Object.keys(graph.bySemanticProducer || {});
  const { requestIndex, responses } = await writeExtractionOutputs(baseDir, semanticTypes) as any;
  const responseByOp: Record<string, ResponseShapeSummary> = {};
  for (const r of responses) responseByOp[r.operationId] = r;

  // Enrich requirements from OpenAPI hints
  const hints = await loadOpenApiSemanticHints(baseDir);
  for (const [opId, op] of Object.entries(graph.operations)) {
    const hint = hints[opId];
    if (hint) {
      const reqReq = new Set(op.requires.required);
      hint.required.forEach(s => reqReq.add(s));
      op.requires.required = [...reqReq];
      const optReq = new Set(op.requires.optional);
      hint.optional.forEach(s => optReq.add(s));
      op.requires.optional = [...optReq];
    }
  }

  const summaryEntries: GenerationSummaryEntry[] = [];
  let processed = 0;
  // Aggregate deployment artifacts referenced by scenarios for manifest output
  const artifactsManifest = new Map<string, { kind: string; path: string; description?: string }>();

  for (const op of Object.values(graph.operations)) {
    // Generate scenarios for every endpoint, even if it has no semantic requirements.
  const collection = generateScenariosForEndpoint(graph, op.operationId, { maxScenarios: 20 });
    // Augment scenarios with response shape
    const resp = responseByOp[op.operationId];
  if (resp) {
      for (const s of collection.scenarios) {
        s.responseShapeSemantics = resp.producedSemantics || undefined;
    s.responseShapeFields = resp.fields.map(f => ({ name: f.name, type: f.type, semantic: (f as any).semantic, required: f.required }));
        if ((resp as any).nestedSlices) s.responseNestedSlices = resp.nestedSlices as any;
    if ((resp as any).nestedItems) (s as any).responseArrayItemFields = (resp as any).nestedItems;
    s.requestPlan = buildRequestPlan(s, resp, graph, canonical, requestIndex.byOperation);
      }
    }
    const fileName = normalizeEndpointFileName(op.method, op.path);
    await writeFile(path.join(outputDir, fileName), JSON.stringify(collection, null, 2), 'utf8');
    // Feature coverage scenarios (enhanced with integration chain + rudimentary body synthesis)
  const featureCollection = generateFeatureCoverageForEndpoint(graph, op.operationId, { requestVariants: requestIndex.byOperation[op.operationId] });
    // Expand schema-missing-required into combinations (cap at 35) before planning
    {
      const baseScenarios = featureCollection.scenarios;
      const expanded: any[] = [];
      const requiredFields = getRequiredRequestLeafFields(op.operationId, canonical);
      const hasSchemaMissing = baseScenarios.some(s => typeof (s as any).variantKey === 'string' && (s as any).variantKey.includes('schemaMissingRequired'));
      const hasSchemaWrongType = baseScenarios.some(s => typeof (s as any).variantKey === 'string' && (s as any).variantKey.includes('schemaWrongType'));
      if (requiredFields.length && hasSchemaMissing) {
        const originals = baseScenarios.filter(s => typeof (s as any).variantKey === 'string' && (s as any).variantKey.includes('schemaMissingRequired'));
        const others = baseScenarios.filter(s => !(typeof (s as any).variantKey === 'string' && (s as any).variantKey.includes('schemaMissingRequired')));
        expanded.push(...others);
        // generate subsets of fields to include (missing others): sizes 0..n-1, cap 15
        const fields = [...requiredFields].sort();
  const cap = 35;
        let budget = cap;
        for (let k = 0; k <= Math.max(0, fields.length - 1) && budget > 0; k++) {
          const combos = k === 0 ? [[]] : k === fields.length ? [] : kCombinations(fields, k);
          for (const combo of combos) {
            if (budget <= 0) break;
            for (const orig of originals) {
              const clone = { ...orig, id: `${orig.id}-mr-${k}-${expanded.length+1}` } as any;
              clone.schemaMissingInclude = combo;
              // Pre-compute suppress list (required fields not in include)
              const requiredClusterOverrides: Record<string,string[]> = {
                activateJobs: ['type','timeout','maxJobsToActivate']
              };
              const cluster = fields.length ? fields : (requiredClusterOverrides[op.operationId] || fields);
              clone.schemaMissingSuppress = cluster.filter(f => !combo.includes(f));
              // CONTRACT: schemaMissingInclude lists the required fields we intentionally KEEP.
              // schemaMissingSuppress lists required fields (including endpoint-specific cluster augmentations)
              // we intentionally DROP. Synthesis will skip or remove suppressed fields in one final pass so
              // emitter stays generic.
              clone.name = `${orig.name} [include=${combo.join(',') || '∅'}]`;
              clone.description = `${orig.description || ''} Include only: ${combo.join(',') || '∅'}.`;
              expanded.push(clone);
              budget--;
              if (budget <= 0) break;
            }
          }
        }
        featureCollection.scenarios = expanded as any;
      }
      // Expand wrong-type negatives similarly, but operate on a small subset of fields to keep within cap
      if (requiredFields.length && hasSchemaWrongType) {
        const base = featureCollection.scenarios;
        const originals = base.filter(s => typeof (s as any).variantKey === 'string' && (s as any).variantKey.includes('schemaWrongType')) as any[];
        const others = base.filter(s => !(typeof (s as any).variantKey === 'string' && (s as any).variantKey.includes('schemaWrongType')));
        const result: any[] = [];
        result.push(...others);
        const fields = [...requiredFields].sort();
        const capWT = 35;
        let budget = Math.max(1, Math.min(capWT, 10)); // limit wrong-type combos to at most 10 per endpoint
        // Create single-field wrong-type and small pairs first
        const combos1: string[][] = fields.map(f => [f]);
        for (const c of combos1) {
          if (budget <= 0) break;
          for (const orig of originals) {
            const clone = { ...orig, id: `${orig.id}-wt-1-${result.length+1}` } as any;
            clone.schemaWrongTypeInclude = c;
            clone.name = `${orig.name} [wrongType=${c.join('+')}]`;
            clone.description = `${orig.description || ''} Wrong type fields: ${c.join(',')}.`;
            result.push(clone);
            budget--;
            if (budget <= 0) break;
          }
        }
        // Optionally add a couple of 2-field combos if budget remains
        if (budget > 0) {
          const combos2 = kCombinations(fields, 2);
          for (const c of combos2) {
            if (budget <= 0) break;
            for (const orig of originals) {
              const clone = { ...orig, id: `${orig.id}-wt-2-${result.length+1}` } as any;
              clone.schemaWrongTypeInclude = c;
              clone.name = `${orig.name} [wrongType=${c.join('+')}]`;
              clone.description = `${orig.description || ''} Wrong type fields: ${c.join(',')}.`;
              result.push(clone);
              budget--;
              if (budget <= 0) break;
            }
          }
        }
        featureCollection.scenarios = result as any;
      }
    }
    // Final guardrail: enforce max scenarios per endpoint after expansions (cap 35)
    if (featureCollection.scenarios.length > 35) {
      featureCollection.scenarios = featureCollection.scenarios.slice(0, 35);
    }
    // Choose a representative integration scenario to supply dependency chain (shortest non-unsatisfied with >1 ops; fallback scenario-1)
    const integrationCandidates = collection.scenarios.filter(sc => sc.id !== 'unsatisfied');
    const chainSource = integrationCandidates
      .filter(sc => sc.operations.length > 1)
      .sort((a,b) => a.operations.length - b.operations.length)[0] || integrationCandidates[0];
  if (resp) {
      for (const s of featureCollection.scenarios) {
        // Graft chain if available and feature scenario currently only has endpoint op
    // Special-case: for search-like empty-negative, skip grafting to produce an empty result without prerequisites
  const isSearchLikeOp = (op.method.toUpperCase() === 'POST' && /\/search$/.test(op.path)) || /search/i.test(op.operationId) || op.operationId === 'activateJobs';
  const isEmptyNeg = (s as any).expectedResult && (s as any).expectedResult.kind === 'empty';
  const isOneOfPair = Array.isArray((s as any).requestVariants) && (s as any).requestVariants.some((rv: any) => typeof rv.variant === 'string' && rv.variant.startsWith('pair:'));
  const isUnionAll = Array.isArray((s as any).exclusivityViolations) && (s as any).exclusivityViolations.some((t: string) => t.includes('oneOf:') && t.endsWith('union-all'));
  const skipGraft = (isSearchLikeOp && isEmptyNeg) || isUnionAll || isOneOfPair;
  if (!skipGraft && chainSource && s.operations.length === 1 && chainSource.operations.length > 1) {
          s.operations = chainSource.operations.map(o => ({ ...o }));
        }
  s.responseShapeSemantics = resp.producedSemantics || undefined;
  s.responseShapeFields = resp.fields.map(f => ({ name: f.name, type: f.type, semantic: (f as any).semantic, required: f.required }));
  if ((resp as any).nestedSlices) s.responseNestedSlices = resp.nestedSlices as any;
  if ((resp as any).nestedItems) (s as any).responseArrayItemFields = (resp as any).nestedItems;
  s.requestPlan = buildRequestPlan(s, resp, graph, canonical, requestIndex.byOperation);
  // Carry forward suppress metadata (already on scenario) no action needed here except sanity (noop)
        // Consolidation fix: ensure schemaMissingRequired variants truly omit excluded required fields
        try {
          const isMissingReq = typeof (s as any).variantKey === 'string' && (s as any).variantKey.includes('schemaMissingRequired');
          const includeArr: string[] | undefined = Array.isArray((s as any).schemaMissingInclude) ? (s as any).schemaMissingInclude : undefined;
          if (isMissingReq && includeArr) {
            const finalStep = s.requestPlan?.[s.requestPlan.length - 1];
            if (finalStep?.bodyTemplate && finalStep.bodyKind === 'json') {
              const reqFields = getRequiredRequestLeafFields(op.operationId, canonical);
              for (const rf of reqFields) {
                if (!includeArr.includes(rf) && Object.prototype.hasOwnProperty.call(finalStep.bodyTemplate, rf)) {
                  delete finalStep.bodyTemplate[rf];
                }
              }
            }
          }
        } catch {}
        // Validation: for JSON requests with oneOf groups, non-negative scenarios must set exactly one variant's required keys
        try {
          const final = s.requestPlan?.[s.requestPlan.length - 1];
          const groups = requestIndex.byOperation[op.operationId] || [];
          const isError = s.expectedResult && (s.expectedResult as any).kind === 'error';
          const unionViolation = Array.isArray((s as any).exclusivityViolations) && (s as any).exclusivityViolations.some((t: string) => t.includes('oneOf:') && t.endsWith('union-all'));
          if (final?.bodyKind === 'json' && final?.bodyTemplate && groups.length && !isError && !unionViolation) {
            const presentKeys = new Set(Object.keys(final.bodyTemplate));
            for (const g of groups) {
              // Count variants whose required keys are fully present in the body
              const hits = g.variants.filter((v: any) => v.required.every((k: string) => presentKeys.has(k)));
              // Deduplicate by required set (some variants only differ by discriminator value but share the same required keys)
              const uniqByReq = new Map<string, any>();
              for (const v of hits) {
                const key = [...v.required].sort().join('|');
                if (!uniqByReq.has(key)) uniqByReq.set(key, v);
              }
              const uniqCount = uniqByReq.size;
              if (uniqCount !== 1) {
                throw new Error(`oneOf validation failed for ${op.operationId} group '${g.groupId}': expected exactly 1 variant's required keys present, found ${uniqCount}`);
              }
            }
          }
        } catch (e) {
          throw e;
        }
      }
    }
    // Validate request bodies for final step when method requires a body
    for (const sc of featureCollection.scenarios) {
      const final = sc.requestPlan?.[sc.requestPlan.length - 1];
      if (!final) continue;
      if (['POST','PUT','PATCH'].includes(final.method)) {
        if (!final.bodyKind) {
          throw new Error(`Missing request body synthesis for ${op.operationId} (${final.method})`);
        }
      }
    }
    // Collect artifact references from feature scenarios (multipart files)
    try {
      const domainRules = (graph.domain as any)?.operationArtifactRules || {};
      for (const sc of featureCollection.scenarios) {
        const steps = (sc as any).requestPlan || [];
        for (const st of steps) {
          if (st?.bodyKind === 'multipart' && st?.multipartTemplate?.files) {
            for (const [k,v] of Object.entries<any>(st.multipartTemplate.files)) {
              const s = typeof v === 'string' ? v : '';
              if (!s.startsWith('@@FILE:')) continue;
              const rel = s.slice('@@FILE:'.length);
              // Determine artifact kind: prefer scenario artifact rule mapping
              let kind: string | undefined;
              const rulesForOp = domainRules?.[st.operationId]?.rules || [];
              if (Array.isArray((sc as any).artifactsApplied) && (sc as any).artifactsApplied.length) {
                const rid = (sc as any).artifactsApplied[0];
                const r = rulesForOp.find((r: any) => r.id === rid);
                kind = r?.artifactKind;
              }
              // Fallback by extension mapping
              if (!kind) {
                const ext = path.extname(rel).toLowerCase();
                const kinds = (graph.domain as any)?.artifactFileKinds?.[ext] || [];
                kind = kinds[0];
              }
              const desc = getArtifactsRegistry().find(e => e.kind === kind && e.path === rel)?.description;
              const key = `${kind || 'unknown'}::${rel}`;
              if (!artifactsManifest.has(key)) artifactsManifest.set(key, { kind: kind || 'unknown', path: rel, description: desc });
            }
          }
        }
      }
    } catch {}

    await writeFile(path.join(featureDir, fileName), JSON.stringify(featureCollection, null, 2), 'utf8');
    summaryEntries.push({
      operationId: op.operationId,
      method: op.method,
      path: op.path,
      scenarioCount: collection.scenarios.length,
      unsatisfied: !!collection.unsatisfied,
      missingSemanticTypes: collection.scenarios.find(s => s.id === 'unsatisfied')?.missingSemanticTypes
    });
    processed++;
  }

  const summary: GenerationSummary = {
    generatedAt: new Date().toISOString(),
    nodeVersion: process.version,
    endpoints: summaryEntries
  };
  await writeFile(path.join(outputDir, 'index.json'), JSON.stringify(summary, null, 2), 'utf8');
  // Write artifact manifest for programmatic builds
  if (artifactsManifest.size) {
    const artifacts = Array.from(artifactsManifest.values()).sort((a,b) => (a.kind+a.path).localeCompare(b.kind+b.path));
    await writeFile(path.join(outputDir, 'deployment-artifacts.manifest.json'), JSON.stringify({ artifacts }, null, 2), 'utf8');
  }

  console.log(`Generated scenario files for ${processed} endpoints.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

function buildRequestPlan(scenario: any, resp: any, graph: any, canonical: Record<string, any>, requestGroupsIndex: Record<string, any[]>) {
  const steps: any[] = [];
  // Each operation becomes a step; final step uses response shape for extraction
  const lastOpId = scenario.operations[scenario.operations.length - 1].operationId;
  for (const opRef of scenario.operations) {
    const isFinal = opRef.operationId === lastOpId;
    const step: any = {
      operationId: opRef.operationId,
      method: opRef.method,
      pathTemplate: opRef.path,
      expect: { status: determineExpectedStatus(scenario, resp, isFinal) }
    };
    // Domain valueBindings driven response extraction (non-final steps included)
    const opDom = graph.domain?.operationRequirements?.[opRef.operationId];
    if (opDom?.valueBindings) {
      const extracts: any[] = [];
      for (const [k,v] of Object.entries(opDom.valueBindings)) {
        if (!k.startsWith('response.')) continue; // only handle response mappings here
  const fieldPathRaw = k.slice('response.'.length); // canonical path with [] markers
  const norm = fieldPathRaw.replace(/\[\]/g, '[0]'); // first element access for arrays
        // Determine target variable name based on parameter portion after last '.' in mapping (state.parameter)
        const mapping = v as string;
        const paramPart = mapping.split('.').pop()!;
        let bind = camelCase(paramPart) + 'Var';
        if (k.endsWith('$key')) { // explicit key semantic mapping
          bind = camelCase(paramPart.replace(/Id$/,'Key')) + 'Var';
        }
        // Ensure binding variable exists in scenario.bindings placeholder if not set
        scenario.bindings ||= {};
        if (!scenario.bindings[bind]) scenario.bindings[bind] = `__PENDING__`;
        extracts.push({ fieldPath: norm, bind, note: 'domainBinding' });
      }
  if (extracts.length) step.extract = extracts;
    }
    // Canonical request body synthesis for POST/PUT/PATCH using requestByMediaType
    if (['POST','PUT','PATCH'].includes(opRef.method)) {
      const plan = buildRequestBodyFromCanonical(opRef.operationId, scenario, graph, canonical, requestGroupsIndex, isFinal);
      if (plan?.kind === 'json') {
        step.bodyTemplate = plan.template;
        step.bodyKind = 'json';
      } else if (plan?.kind === 'multipart') {
        step.multipartTemplate = plan.template;
        step.bodyKind = 'multipart';
        if ((plan as any).expectedSlices && Array.isArray((plan as any).expectedSlices)) {
          step.expectedDeploymentSlices = (plan as any).expectedSlices;
        }
      }
    }
    if (isFinal && resp?.fields?.length) {
      // Basic extraction: semantic-labeled fields
      const extract: any[] = [];
      for (const f of resp.fields) {
        if ((f as any).semantic) {
          const bind = camelCase((f as any).semantic) + 'Var';
          extract.push({ fieldPath: f.name, bind, semantic: (f as any).semantic });
        }
      }
      if (extract.length) step.extract = (step.extract||[]).concat(extract);
    }
    steps.push(step);
    // If this is the final step and scenario has duplicateTest, append a duplicate invocation
    if (isFinal && scenario.duplicateTest) {
      const dup: any = { ...step, expect: { status: scenario.duplicateTest.secondStatus || (scenario.duplicateTest.mode === 'conflict' ? 409 : 200) } };
      // Mark duplicate step for emitter logic
      dup.notes = (dup.notes ? dup.notes + '; ' : '') + 'duplicate-invocation';
      steps.push(dup);
    }
  }
  return steps;
}

function determineExpectedStatus(scenario: any, resp: any, isFinal: boolean): number {
  if (isFinal && scenario.expectedResult && scenario.expectedResult.kind === 'error' && scenario.expectedResult.code) {
    const n = Number(scenario.expectedResult.code);
    if (!Number.isNaN(n)) return n;
  }
  return resp?.successStatus || (isFinal ? 200 : 200);
}

function synthesizeBodyTemplate(scenario: any, opRef: any) {
  // Heuristic: for search endpoints, include binding-derived fields
  const bindings = scenario.bindings || {};
  if (!bindings || Object.keys(bindings).length === 0) return undefined;
  const result: any = {};
  const isSearch = /\/search$/.test(opRef.path) || /search/i.test(opRef.operationId);
  // Map binding var names like processDefinitionKeyVar -> processDefinitionKey
  for (const [k, v] of Object.entries(bindings)) {
    if (!k.endsWith('Var')) continue;
    const base = k.slice(0, -3); // remove 'Var'
    // Only include if variant actually uses this optional semantic OR it's required semantic for endpoint
    const used = (scenario.filtersUsed && scenario.filtersUsed.includes(capitalizeFirst(base.replace(/Var$/,'')))) || false;
    if (isSearch && used) {
      result[base] = `\${${k}}`; // placeholder replaced later in emitter
    }
  }
  return result;
}

function capitalizeFirst(s: string){ return s ? s[0].toUpperCase()+s.slice(1) : s; }

function camelCase(name: string) { return name.charAt(0).toLowerCase() + name.slice(1); }

type CanonicalShape = { requestByMediaType?: Record<string, { path: string; type: string; required: boolean }[]> };

function buildRequestBodyFromCanonical(opId: string, scenario: any, graph: any, canonical: Record<string, CanonicalShape>, requestGroupsIndex: Record<string, any[]>, isEndpoint: boolean) {
  const shape = canonical[opId];
  if (!shape || !shape.requestByMediaType) return undefined;
  // Prefer multipart when available (e.g., createDeployment), else application/json
  const ctOrder = ['multipart/form-data', 'application/json'];
  let chosenCt: string | undefined;
  for (const ct of ctOrder) if (shape.requestByMediaType[ct]) { chosenCt = ct; break; }
  if (!chosenCt) return undefined;
  const nodes = shape.requestByMediaType[chosenCt]!;
  const requiredFields = nodes.filter(n => n.required && !n.path.includes('[]'));
  // Bindings map from domain valueBindings (request.* -> state.parameter)
  const opDom = graph.domain?.operationRequirements?.[opId];
  const bindingMap: Record<string,string> = {};
  if (opDom?.valueBindings) {
    for (const [k,v] of Object.entries<string>(opDom.valueBindings)) {
      if (k.startsWith('request.')) {
        const raw = k.slice('request.'.length);
        bindingMap[raw] = v.split('.').pop()!; // take parameter name
      }
    }
  }
  // If JSON and oneOf groups exist, figure out which fields are allowed
  const requestGroups = requestGroupsIndex?.[opId] || [];
  // Load request defaults (operation-level overrides global)
  const defaults = getRequestDefaultsForOperation(opId);
  let allowedFields: Set<string> | undefined;
  let forceUnionAll = false;
  let chosenVariantRequired: string[] | undefined;
  let unionFieldsForGroup: string[] | undefined;
  let pairFields: string[] | undefined;
  if (chosenCt === 'application/json' && requestGroups.length) {
    // Determine selected variant for endpoint scenarios
    const selected = isEndpoint ? (scenario.requestVariants?.[0]) : undefined;
    const groupId = selected?.groupId || requestGroups[0]?.groupId;
    const group = requestGroups.find((g: any) => g.groupId === groupId) || requestGroups[0];
    unionFieldsForGroup = group?.unionFields || [];
    // Detect pairwise negative (requestVariantName: 'pair:a+b')
    if (isEndpoint && selected?.variant && typeof selected.variant === 'string' && selected.variant.startsWith('pair:')) {
      const pair = selected.variant.slice('pair:'.length);
      const parts = pair.split('+').filter(Boolean);
      if (parts.length === 2) {
        pairFields = parts;
        allowedFields = new Set(parts);
      }
    } else if (isEndpoint && scenario.exclusivityViolations?.includes(`oneOf:${groupId}:union-all`)) {
      // Negative: include union of all fields to provoke 400
      forceUnionAll = true;
      allowedFields = new Set(group.unionFields);
    } else {
      // Choose a concrete variant: prefer one that contains a '*Key' field if possible
      const variants: any[] = group?.variants || [];
      let chosen = selected ? variants.find(v => v.variantName === selected.variant) : undefined;
      if (!chosen) chosen = variants.find(v => v.required.some((f: string) => /Key$/.test(f))) || variants[0];
      // For non-endpoint dependent steps, prefer Key similarly
      if (!isEndpoint) {
        chosen = variants.find(v => v.required.some((f: string) => /Key$/.test(f))) || chosen;
      }
      chosenVariantRequired = [...(chosen?.required || [])];
      // Allow chosen required, plus chosen optional that are NOT required by any other variant
      const otherRequired = new Set<string>(variants.filter(v => v !== chosen).flatMap(v => v.required || []));
      const safeOptional = (chosen?.optional || []).filter((n: string) => !otherRequired.has(n));
      const names: string[] = [...(chosen?.required || []), ...safeOptional];
      allowedFields = new Set(names);
    }
  }
  // Build template
  if (chosenCt === 'application/json') {
  const template: any = {};
    const missing: string[] = [];
  // Detect missing-required negative either by original variantKey marker or by presence of expansion metadata
  const isSchema400Neg = (scenario?.variantKey && typeof scenario.variantKey === 'string' && scenario.variantKey.includes('schemaMissingRequired')) || Array.isArray((scenario as any).schemaMissingInclude);
    const isSchemaWrongType = scenario?.variantKey && typeof scenario.variantKey === 'string' && scenario.variantKey.includes('schemaWrongType');
    const includeSet: Set<string> | undefined = isSchema400Neg && Array.isArray((scenario as any).schemaMissingInclude)
      ? new Set((scenario as any).schemaMissingInclude as string[]) : undefined;
    const omitSet: Set<string> | undefined = isSchema400Neg && Array.isArray((scenario as any).schemaMissingSuppress)
      ? new Set((scenario as any).schemaMissingSuppress as string[]) : undefined;
    const wrongTypeSet: Set<string> | undefined = isSchemaWrongType && Array.isArray((scenario as any).schemaWrongTypeInclude)
      ? new Set((scenario as any).schemaWrongTypeInclude as string[]) : undefined;
    if (requestGroups.length) {
      // oneOf-aware synthesis
      if (pairFields && pairFields.length === 2) {
        for (const name of pairFields) {
          const viaProvider = resolveProvider(opId, name, scenario);
          if (viaProvider !== undefined) {
            template[name] = viaProvider;
            continue;
          }
          const varName = camelCase((bindingMap[name] || name || 'value')) + 'Var';
          scenario.bindings ||= {};
          if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
          // If wrong-type negative applies for this field, inject a mismatched type
          if (wrongTypeSet && wrongTypeSet.has(name)) {
            template[name] = 12345; // force number where a string is expected
          } else {
            template[name] = `${'${'}${varName}}`;
          }
          if (!bindingMap[name]) missing.push(name);
        }
      } else if (forceUnionAll && unionFieldsForGroup) {
        for (const name of unionFieldsForGroup) {
          const viaProvider = resolveProvider(opId, name, scenario);
          if (viaProvider !== undefined) {
            template[name] = viaProvider;
            continue;
          }
          const varName = camelCase((bindingMap[name] || name || 'value')) + 'Var';
          scenario.bindings ||= {};
          if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
          if (wrongTypeSet && wrongTypeSet.has(name)) {
            template[name] = 12345;
          } else {
            template[name] = `${'${'}${varName}}`;
          }
          if (!bindingMap[name]) missing.push(name);
        }
      } else if (chosenVariantRequired && chosenVariantRequired.length) {
        for (const name of chosenVariantRequired) {
          if (omitSet && omitSet.has(name)) continue;
          if (includeSet && !includeSet.has(name)) continue; // omit required not selected for include
          if (allowedFields && !allowedFields.has(name)) continue;
          // Special-case: map domain jobType -> request.type if not explicitly bound
          const mappedName = (name === 'type' && !bindingMap[name] && bindingMap['jobType']) ? 'jobType' : name;
          const viaProvider = resolveProvider(opId, name, scenario);
          if (viaProvider !== undefined) {
            template[name] = viaProvider;
            continue;
          }
          const varName = camelCase((bindingMap[mappedName] || name || 'value')) + 'Var';
          const hasBinding = !!bindingMap[mappedName];
          if (hasBinding) {
            scenario.bindings ||= {};
            if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
            if (wrongTypeSet && wrongTypeSet.has(name)) {
              template[name] = 12345;
            } else {
              template[name] = `${'${'}${varName}}`;
            }
          } else if (defaults && Object.prototype.hasOwnProperty.call(defaults, name)) {
            if (wrongTypeSet && wrongTypeSet.has(name)) {
              template[name] = 12345;
            } else {
              template[name] = (defaults as any)[name];
            }
          } else {
            scenario.bindings ||= {};
            if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
            if (wrongTypeSet && wrongTypeSet.has(name)) {
              template[name] = 12345;
            } else {
              template[name] = `${'${'}${varName}}`;
            }
            if (!bindingMap[mappedName]) missing.push(name);
          }
        }
      }
    } else {
      // Non-oneOf: use canonical required flags
      for (const f of requiredFields) {
        const leaf = f.path.split('.').pop()!;
        if (omitSet && omitSet.has(leaf)) continue;
        if (includeSet && !includeSet.has(leaf)) continue; // omit required not selected for include
        if (allowedFields && !allowedFields.has(leaf)) continue;
        const viaProvider = resolveProvider(opId, leaf, scenario);
        if (viaProvider !== undefined) {
          template[leaf] = viaProvider;
          continue;
        }
        // Special-case: support mapping jobType -> type
        const hasJobType = !!bindingMap['jobType'];
        const mapJobTypeToType = (leaf === 'type' && !bindingMap[f.path] && hasJobType);
        const mappedParamName = mapJobTypeToType ? 'jobType' : (bindingMap[f.path] || leaf || 'value');
        const varName = camelCase(mappedParamName) + 'Var';
        const hasBinding = mapJobTypeToType ? true : !!bindingMap[f.path];
        if (hasBinding) {
          scenario.bindings ||= {};
          if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
          if (wrongTypeSet && wrongTypeSet.has(leaf)) {
            template[leaf] = 12345;
          } else {
            template[leaf] = `${'${'}${varName}}`;
          }
        } else if (defaults && Object.prototype.hasOwnProperty.call(defaults, leaf)) {
          if (wrongTypeSet && wrongTypeSet.has(leaf)) {
            template[leaf] = 12345;
          } else {
            template[leaf] = (defaults as any)[leaf];
          }
        } else {
          scenario.bindings ||= {};
          if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
          if (wrongTypeSet && wrongTypeSet.has(leaf)) {
            template[leaf] = 12345;
          } else {
            template[leaf] = `${'${'}${varName}}`;
          }
          if (!bindingMap[f.path]) missing.push(f.path);
        }
      }
      // For search-like empty-negative scenarios, allow provider-injected optional filters to drive an empty result
      const isSearchLikeOp = (opId === 'activateJobs') || /search/i.test(opId);
      const isEmptyNeg = scenario?.expectedResult && scenario.expectedResult.kind === 'empty';
      if (isSearchLikeOp && isEmptyNeg) {
        for (const f of nodes.filter(n => !n.required && !n.path.includes('[]'))) {
          const leaf = f.path.split('.').pop()!;
          if (allowedFields && !allowedFields.has(leaf)) continue;
          if (template[leaf] !== undefined) continue;
          const viaProvider = resolveProvider(opId, leaf, scenario);
          if (viaProvider !== undefined) {
            template[leaf] = viaProvider;
          }
        }
      }
    }
    // Fill a few optional fields if present and we have bindings
  for (const f of nodes.filter(n => !n.required && !n.path.includes('[]'))) {
      const leaf = f.path.split('.').pop()!;
      if (allowedFields && !allowedFields.has(leaf)) continue;
      const varBase = camelCase((bindingMap[f.path] || leaf || 'value')) + 'Var';
      if (!template[leaf]) {
        if (scenario.bindings?.[varBase]) {
          template[leaf] = `${'${'}${varBase}}`;
        } else if (defaults && Object.prototype.hasOwnProperty.call(defaults, leaf)) {
          template[leaf] = (defaults as any)[leaf];
        }
      }
    }
  // Fallback: ensure all domain request.* bindings are present even if canonical nodes are missing (e.g., oneOf variants).
    const leafSet = new Set(nodes.filter(n => !n.path.includes('[]')).map(n => n.path.split('.').pop()!));
    for (const [fieldPath, param] of Object.entries(bindingMap)) {
      const leaf = fieldPath.split('.').pop()!;
      if (!leafSet.has(leaf)) continue; // don't inject fields not in schema
      if (allowedFields && !allowedFields.has(leaf) && !forceUnionAll) continue;
      // For schemaMissingRequired negatives, do not re-add omitted required fields
      if (isSchema400Neg && includeSet && !includeSet.has(leaf) && requiredFields.some(rf => rf.path.endsWith('.'+leaf) || rf.path.split('.').pop() === leaf)) continue;
      const varName = camelCase(param) + 'Var';
      scenario.bindings ||= {};
      if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
      if (template[leaf] === undefined) {
        if (wrongTypeSet && wrongTypeSet.has(leaf)) {
          template[leaf] = 12345;
        } else {
          template[leaf] = `${'${'}${varName}}`;
        }
      }
    }
    // Post-process: if jobType binding exists but schema expects 'type', prefer mapping into 'type'
  if (bindingMap['jobType']) {
      const jtVar = 'jobTypeVar';
      if (template['type'] === undefined) {
        // If this is a schema-missing-required negative and 'type' was intentionally omitted, do NOT map it in.
    if (!(isSchema400Neg && (omitSet?.has('type') || (includeSet && !includeSet.has('type'))))) {
          template['type'] = `${'${'}${jtVar}}`;
        }
      }
      // ensure we don't carry a non-schema jobType field
      if (!leafSet.has('jobType')) delete (template as any)['jobType'];
    }
    // Final single-pass omission enforcement (contract):
    // - schemaMissingInclude = fields we intentionally keep
    // - schemaMissingSuppress = fields we intentionally drop (precomputed)
    // We compute union of: requiredFields (canonical), chosenVariantRequired (oneOf), plus endpoint cluster hint for activateJobs.
    if (isSchema400Neg && (includeSet || omitSet)) {
      const unionRequired = new Set<string>();
      for (const f of requiredFields) { const leaf = f.path.split('.').pop(); if (leaf) unionRequired.add(leaf); }
      for (const n of (chosenVariantRequired || [])) unionRequired.add(n);
      if (opId === 'activateJobs') ['type','timeout','maxJobsToActivate'].forEach(n => unionRequired.add(n));
      for (const n of unionRequired) {
        const shouldKeep = includeSet ? includeSet.has(n) : false;
        const explicitlyDrop = omitSet ? omitSet.has(n) : false;
        if ((!shouldKeep || explicitlyDrop) && Object.prototype.hasOwnProperty.call(template, n)) delete template[n];
      }
    }
    // Scenario-specific overrides
    // For activateJobs negative-empty scenarios, use config-driven non-existent job type and short requestTimeout
    if (opId === 'activateJobs' && scenario?.expectedResult && scenario.expectedResult.kind === 'empty') {
      const opDefaults = getRequestDefaultsForOperation(opId) || {};
      const neg = (opDefaults as any).negativeEmpty || {};
      const nonExistentType = typeof neg.type === 'string' ? neg.type : '__NON_EXISTENT_JOB_TYPE__';
      const shortTimeout = Number.isFinite(neg.requestTimeout) ? neg.requestTimeout : 250;
      template['type'] = nonExistentType;
      template['requestTimeout'] = shortTimeout as number;
      // Seed binding for completeness, though template uses a literal
      scenario.bindings ||= {};
      if (!scenario.bindings['jobTypeVar'] || scenario.bindings['jobTypeVar'] === '__PENDING__') {
        scenario.bindings['jobTypeVar'] = nonExistentType;
      }
    }
  // Removed prior absolute guard (folded into unified omission pass above).
    return { kind: 'json' as const, template };
  }
  if (chosenCt === 'multipart/form-data') {
    // Represent multipart template as { fields: Record<string,string>, files: Record<string,string> }
    // Detect array of binaries: look for paths matching resources[] with type string/binary
    const template: any = { fields: {}, files: {} };
    const fileFields = nodes.filter(n => /\bstring\b/i.test(n.type) && /resources\[\]/.test(n.path));
    if (fileFields.length) {
      // Choose fixture based on artifact rule selection if present
  const ruleId = (scenario.artifactsApplied && scenario.artifactsApplied[0]) || undefined;
      const domainRules = (graph.domain as any)?.operationArtifactRules?.[opId]?.rules || [];
      const rule = ruleId ? domainRules.find((r: any) => r.id === ruleId) : undefined;
      let kind = rule?.artifactKind as string | undefined;
      if (!kind) {
        // Default to BPMN process for deployments when unspecified
        if (opId === 'createDeployment') kind = 'bpmnProcess';
      }
      // Map artifact kind -> default fixture path
      const defaultFixtures: Record<string,string> = {
        bpmnProcess: '@@FILE:bpmn/simple.bpmn',
        form: '@@FILE:forms/simple.form',
        dmnDecision: '@@FILE:dmn/decision.dmn',
        dmnDrd: '@@FILE:dmn/drd.dmn'
      };
  // Prefer registry-defined artifact if available for this kind
  // If downstream requires ModelHasServiceTaskType/JobType, prefer an entry carrying a jobType parameter
  const preferJobType = true; // simple heuristic: jobs-related ops exist; could inspect scenario.operations
  const regHit = chooseFixtureFromRegistry(kind, preferJobType);
  let fileRef = (regHit && regHit.ref) || defaultFixtures[kind || ''] || '@@FILE:bpmn/simple.bpmn';
      // If registry provides a jobType parameter, bind it for later request body use
      if (regHit?.params && typeof regHit.params.jobType === 'string') {
        const varName = 'jobTypeVar';
        scenario.bindings ||= {};
        if (!scenario.bindings[varName]) scenario.bindings[varName] = regHit.params.jobType;
      }
      template.files['resources'] = fileRef;
    }
    const tenant = nodes.find(n => n.path === 'tenantId');
    if (tenant) {
      const varName = 'tenantIdVar';
      scenario.bindings ||= {};
      if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
      template.fields['tenantId'] = `\
${'${'}${varName}}`;
    }
    // Derive expected deployment slices using domain sidecar mapping (explicit). Fallback to heuristic later in emitter.
    const expectedSlicesSet = new Set<string>();
  try {
      const fileKinds: Record<string, string[]> | undefined = (graph.domain as any)?.artifactFileKinds;
      const kindsSpec: Record<string, any> | undefined = (graph.domain as any)?.artifactKinds;
      for (const [name, val] of Object.entries<any>(template.files)) {
        const s = typeof val === 'string' ? val : '';
        const pth = s.startsWith('@@FILE:') ? s.slice('@@FILE:'.length) : s;
        if (!pth) continue;
        const ext = path.extname(pth).toLowerCase();
        const kinds = (fileKinds && fileKinds[ext]) || [];
        for (const k of kinds) {
          const spec = kindsSpec?.[k];
          const slices: string[] = spec?.deploymentSlices || [];
          slices.forEach(x => expectedSlicesSet.add(x));
        }
      }
    } catch {}
    const expectedSlices = Array.from(expectedSlicesSet);
    return { kind: 'multipart' as const, template, expectedSlices };
  }
  return undefined;
}

// -------- Artifact Registry support ---------
type ArtifactRegistryEntry = { kind: string; path: string; description?: string; parameters?: Record<string, any> };
let artifactsRegistryCache: ArtifactRegistryEntry[] | undefined;
function getArtifactsRegistry(): ArtifactRegistryEntry[] {
  if (artifactsRegistryCache) return artifactsRegistryCache;
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    // Invoked from api-test/path-analyser
    path.resolve(process.cwd(), 'fixtures', 'deployment-artifacts.json'),
    // Invoked from repo root
    path.resolve(process.cwd(), 'api-test', 'path-analyser', 'fixtures', 'deployment-artifacts.json'),
    // Relative to compiled module (dist/src)
    path.resolve(moduleDir, '../fixtures/deployment-artifacts.json'),
    path.resolve(moduleDir, '../../fixtures/deployment-artifacts.json')
  ];
  for (const p of candidates) {
    try {
  const data = fsSync.readFileSync(p, 'utf8');
    const json = JSON.parse(data);
    const arr = Array.isArray(json?.artifacts) ? json.artifacts : Array.isArray(json) ? json : [];
    artifactsRegistryCache = arr.map((e: any) => ({ kind: e.kind, path: e.path, description: e.description, parameters: e.parameters }));
    return artifactsRegistryCache || [];
    } catch {}
  }
  artifactsRegistryCache = [];
  return artifactsRegistryCache;
}

// -------- Request Defaults support ---------
type RequestDefaults = { operations?: Record<string, Record<string, any>>; global?: Record<string, any> };
let requestDefaultsCache: RequestDefaults | null = null;
function loadRequestDefaults(): RequestDefaults {
  if (requestDefaultsCache) return requestDefaultsCache;
  const candidates = [
    path.resolve(process.cwd(), 'request-defaults.json'),
    path.resolve(process.cwd(), 'api-test', 'path-analyser', 'request-defaults.json')
  ];
  for (const p of candidates) {
    try {
      const data = fsSync.readFileSync(p, 'utf8');
      const json = JSON.parse(data);
      requestDefaultsCache = json as RequestDefaults;
      return requestDefaultsCache;
    } catch {}
  }
  requestDefaultsCache = { operations: {}, global: {} };
  return requestDefaultsCache;
}
function getRequestDefaultsForOperation(opId: string): Record<string, any> | undefined {
  const all = loadRequestDefaults();
  const op = (all.operations && all.operations[opId]) || {};
  const glob = all.global || {};
  return { ...glob, ...op };
}

// -------- Helpers for schema-missing-required expansion ---------
function getRequiredRequestLeafFields(opId: string, canonical: Record<string, CanonicalShape>): string[] {
  const shape = canonical[opId];
  if (!shape || !shape.requestByMediaType) return [];
  const nodes = shape.requestByMediaType['application/json'] || [];
  const fields = nodes
    .filter(n => n.required && !n.path.includes('[]'))
    .map(n => n.path.split('.').pop()!)
    .filter(Boolean);
  return Array.from(new Set(fields));
}

function kCombinations<T>(arr: T[], k: number): T[][] {
  const res: T[][] = [];
  const n = arr.length;
  if (k <= 0 || k > n) return res;
  const idx = Array.from({ length: k }, (_, i) => i);
  const take = () => res.push(idx.map(i => arr[i]));
  while (true) {
    take();
    let i: number;
    for (i = k - 1; i >= 0; i--) {
      if (idx[i] !== i + n - k) break;
    }
    if (i < 0) break;
    idx[i]++;
    for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1;
  }
  return res;
}

// -------- Filter Providers (search filters, oneOf negatives) ---------
type ProviderSpec = { from: 'ctx'|'const'|'enumFirst'|'base64'|'now', var?: string, value?: any };
type ProviderConfig = { globals?: Record<string, ProviderSpec>, operations?: Record<string, Record<string, ProviderSpec>> };
let providerConfigCache: ProviderConfig | null = null;
function loadProviderConfig(): ProviderConfig {
  if (providerConfigCache) return providerConfigCache;
  const candidates = [
    path.resolve(process.cwd(), 'filter-providers.json'),
    path.resolve(process.cwd(), 'api-test', 'path-analyser', 'filter-providers.json')
  ];
  for (const p of candidates) {
    try {
      const data = fsSync.readFileSync(p, 'utf8');
      providerConfigCache = JSON.parse(data) as ProviderConfig;
      return providerConfigCache;
    } catch {}
  }
  providerConfigCache = { globals: {}, operations: {} };
  return providerConfigCache;
}
function resolveProvider(opId: string, field: string, scenario: any): any {
  const cfg = loadProviderConfig();
  const opMap = (cfg.operations && cfg.operations[opId]) || {};
  const spec = opMap[field] || (cfg.globals && cfg.globals[field]);
  if (!spec) return undefined;
  switch (spec.from) {
    case 'ctx': {
      const vname = spec.var || (field + 'Var');
      return scenario.bindings && scenario.bindings[vname] !== undefined ? `\${${vname}}` : undefined;
    }
    case 'const': return spec.value;
    case 'base64': return typeof spec.value === 'string' ? spec.value : 'AA==';
    case 'now': return new Date().toISOString();
    case 'enumFirst': return undefined;
  }
}

function chooseFixtureFromRegistry(kind?: string, preferJobType = false): { ref: string; params?: Record<string, any> } | undefined {
  if (!kind) return undefined;
  const reg = getArtifactsRegistry();
  let hit = reg.find(e => e.kind === kind && preferJobType && e.parameters && typeof e.parameters.jobType === 'string');
  if (!hit) hit = reg.find(e => e.kind === kind);
  if (hit && hit.path) return { ref: `@@FILE:${hit.path}`, params: hit.parameters };
  return undefined;
}
