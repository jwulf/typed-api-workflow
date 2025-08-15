import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { loadGraph, loadOpenApiSemanticHints } from './graphLoader.js';
import { generateScenariosForEndpoint } from './scenarioGenerator.js';
import { generateFeatureCoverageForEndpoint } from './featureCoverageGenerator.js';
import { writeExtractionOutputs } from './extractSchemas.js';
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
        s.requestPlan = buildRequestPlan(s, resp);
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
        s.requestPlan = buildRequestPlan(s, resp);
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

function buildRequestPlan(scenario: any, resp: any) {
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
    if (isFinal) {
      // Attempt basic body synthesis for search / POST endpoints using scenario bindings (semantic guesses)
      if (opRef.method === 'POST') {
        const body = synthesizeBodyTemplate(scenario, opRef);
        if (body && Object.keys(body).length) step.bodyTemplate = body;
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
      if (extract.length) step.extract = extract;
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