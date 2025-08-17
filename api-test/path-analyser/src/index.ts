import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
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

  for (const op of Object.values(graph.operations)) {
    // Generate scenarios for every endpoint, even if it has no semantic requirements.
  const collection = generateScenariosForEndpoint(graph, op.operationId, { maxScenarios: 20 });
    // Augment scenarios with response shape
    const resp = responseByOp[op.operationId];
    if (resp) {
      for (const s of collection.scenarios) {
        s.responseShapeSemantics = resp.producedSemantics || undefined;
  s.responseShapeFields = resp.fields.map(f => ({ name: f.name, type: f.type, semantic: (f as any).semantic, required: f.required }));
  s.requestPlan = buildRequestPlan(s, resp, graph, canonical, requestIndex.byOperation);
      }
    }
    const fileName = normalizeEndpointFileName(op.method, op.path);
    await writeFile(path.join(outputDir, fileName), JSON.stringify(collection, null, 2), 'utf8');
    // Feature coverage scenarios (enhanced with integration chain + rudimentary body synthesis)
  const featureCollection = generateFeatureCoverageForEndpoint(graph, op.operationId, { requestVariants: requestIndex.byOperation[op.operationId] });
    // Choose a representative integration scenario to supply dependency chain (shortest non-unsatisfied with >1 ops; fallback scenario-1)
    const integrationCandidates = collection.scenarios.filter(sc => sc.id !== 'unsatisfied');
    const chainSource = integrationCandidates
      .filter(sc => sc.operations.length > 1)
      .sort((a,b) => a.operations.length - b.operations.length)[0] || integrationCandidates[0];
    if (resp) {
      for (const s of featureCollection.scenarios) {
        // Graft chain if available and feature scenario currently only has endpoint op
        if (chainSource && s.operations.length === 1 && chainSource.operations.length > 1) {
          s.operations = chainSource.operations.map(o => ({ ...o }));
        }
        s.responseShapeSemantics = resp.producedSemantics || undefined;
  s.responseShapeFields = resp.fields.map(f => ({ name: f.name, type: f.type, semantic: (f as any).semantic, required: f.required }));
  s.requestPlan = buildRequestPlan(s, resp, graph, canonical, requestIndex.byOperation);
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
              if (hits.length !== 1) {
                throw new Error(`oneOf validation failed for ${op.operationId} group '${g.groupId}': expected exactly 1 variant's required keys present, found ${hits.length}`);
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
      const names: string[] = [...(chosen?.required || []), ...(chosen?.optional || [])];
      allowedFields = new Set(names);
    }
  }
  // Build template
  if (chosenCt === 'application/json') {
    const template: any = {};
    const missing: string[] = [];
    if (requestGroups.length) {
      // oneOf-aware synthesis
      if (pairFields && pairFields.length === 2) {
        for (const name of pairFields) {
          const varName = camelCase((bindingMap[name] || name || 'value')) + 'Var';
          scenario.bindings ||= {};
          if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
          template[name] = `${'${'}${varName}}`;
          if (!bindingMap[name]) missing.push(name);
        }
      } else if (forceUnionAll && unionFieldsForGroup) {
        for (const name of unionFieldsForGroup) {
          const varName = camelCase((bindingMap[name] || name || 'value')) + 'Var';
          scenario.bindings ||= {};
          if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
          template[name] = `${'${'}${varName}}`;
          if (!bindingMap[name]) missing.push(name);
        }
      } else if (chosenVariantRequired && chosenVariantRequired.length) {
        for (const name of chosenVariantRequired) {
          if (allowedFields && !allowedFields.has(name)) continue;
          const varName = camelCase((bindingMap[name] || name || 'value')) + 'Var';
          scenario.bindings ||= {};
          if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
          template[name] = `${'${'}${varName}}`;
          if (!bindingMap[name]) missing.push(name);
        }
      }
    } else {
      // Non-oneOf: use canonical required flags
      for (const f of requiredFields) {
        if (allowedFields && !allowedFields.has(f.path.split('.').pop()!)) continue;
        const varName = camelCase((bindingMap[f.path] || f.path.split('.').pop() || 'value')) + 'Var';
        scenario.bindings ||= {};
        if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
        template[f.path.split('.').pop()!] = `${'${'}${varName}}`;
        if (!bindingMap[f.path]) missing.push(f.path);
      }
    }
    // Fill a few optional fields if present and we have bindings
    for (const f of nodes.filter(n => !n.required && !n.path.includes('[]'))) {
      if (allowedFields && !allowedFields.has(f.path.split('.').pop()!)) continue;
      const varBase = camelCase((bindingMap[f.path] || f.path.split('.').pop() || 'value')) + 'Var';
      if (scenario.bindings?.[varBase] && !template[f.path.split('.').pop()!]) {
        template[f.path.split('.').pop()!] = `\
${'${'}${varBase}}`;
      }
    }
    // Fallback: ensure all domain request.* bindings are present even if canonical nodes are missing (e.g., oneOf variants)
    for (const [fieldPath, param] of Object.entries(bindingMap)) {
      const leaf = fieldPath.split('.').pop()!;
      if (allowedFields && !allowedFields.has(leaf) && !forceUnionAll) continue;
      const varName = camelCase(param) + 'Var';
      scenario.bindings ||= {};
      if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
      if (template[leaf] === undefined) template[leaf] = `\
${'${'}${varName}}`;
    }
    return { kind: 'json' as const, template };
  }
  if (chosenCt === 'multipart/form-data') {
    // Represent multipart template as { fields: Record<string,string>, files: Record<string,string> }
    // Detect array of binaries: look for paths matching resources[] with type string/binary
    const template: any = { fields: {}, files: {} };
    const fileFields = nodes.filter(n => /\bstring\b/i.test(n.type) && /resources\[\]/.test(n.path));
    if (fileFields.length) {
      // Provide a placeholder fixture and variable for caller to override
      template.files['resources'] = '@@FILE:bpmn/simple.bpmn';
    }
    const tenant = nodes.find(n => n.path === 'tenantId');
    if (tenant) {
      const varName = 'tenantIdVar';
      scenario.bindings ||= {};
      if (!scenario.bindings[varName]) scenario.bindings[varName] = '__PENDING__';
      template.fields['tenantId'] = `\
${'${'}${varName}}`;
    }
    return { kind: 'multipart' as const, template };
  }
  return undefined;
}
