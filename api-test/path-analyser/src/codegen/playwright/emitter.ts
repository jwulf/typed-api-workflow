import { promises as fs } from 'fs';
import path from 'path';
import { EndpointScenarioCollection, EndpointScenario, RequestStep } from '../../types.js';

interface EmitOptions {
  outDir: string;
  suiteName?: string;
  mode?: 'feature' | 'integration';
}

export async function emitPlaywrightSuite(collection: EndpointScenarioCollection, opts: EmitOptions) {
  await fs.mkdir(opts.outDir, { recursive: true });
  const file = path.join(opts.outDir, `${collection.endpoint.operationId}.${opts.mode||'feature'}.spec.ts`);
  const code = buildSuiteSource(collection, opts);
  await fs.writeFile(file, code, 'utf8');
  return file;
}

function buildSuiteSource(collection: EndpointScenarioCollection, opts: EmitOptions): string {
  const lines: string[] = [];
  const suiteName = opts.suiteName || collection.endpoint.operationId;
  // Import only test & expect; request fixture is provided per-test via parameters
  lines.push("import { test, expect } from '@playwright/test';");
  lines.push("import { buildBaseUrl, authHeaders } from '../support/env';");
  lines.push('');
  lines.push(`test.describe('${suiteName}', () => {`);
  for (const scenario of collection.scenarios) {
    lines.push(renderScenarioTest(scenario));
  }
  lines.push('});');
  return lines.join('\n');
}

function renderScenarioTest(s: EndpointScenario): string {
  const title = `${s.id} - ${escapeQuotes(s.name||'scenario')}`;
  const body: string[] = [];
  body.push(`test('${title}', async ({ request }) => {`);
  body.push(`  const baseUrl = buildBaseUrl();`);
  body.push(`  const ctx: Record<string, any> = {};`);
  if ((s as any).bindings && Object.keys((s as any).bindings).length) {
    body.push('  // Seed scenario bindings');
    for (const [k,v] of Object.entries((s as any).bindings)) {
      body.push(`  ctx['${k}'] = ${JSON.stringify(v)};`);
    }
  }
  if (!s.requestPlan) {
    body.push('  // No request plan available');
    body.push('});');
    return body.join('\n');
  }
  s.requestPlan.forEach((step: RequestStep, idx: number) => {
    const varName = `resp${idx+1}`;
    const urlExpr = buildUrlExpression(step.pathTemplate);
    const method = step.method.toLowerCase();
    // Basic body handling placeholder
    body.push(`  // Step ${idx+1}: ${step.operationId}`);
    body.push(`  {`);
    body.push(`    const url = baseUrl + ${urlExpr};`);
    const bodyVar = `body${idx+1}`;
    if (step.bodyTemplate) {
      const json = JSON.stringify(step.bodyTemplate, null, 4)
        .replace(/"\\?\$\{([^}]+)\}"/g, (_,v)=>'ctx["'+v+'"]');
      body.push(`    const ${bodyVar} = ${json};`);
    }
    const opts: string[] = [];
    opts.push('headers: await authHeaders()');
    if (step.bodyTemplate) opts.push(`data: ${bodyVar}`);
    body.push(`    const ${varName} = await request.${method}(url, { ${opts.join(', ')} });`);
    body.push(`    expect(${varName}.status()).toBe(${step.expect.status});`);
    // Extraction
    if (step.extract && step.extract.length) {
      body.push(`    const json = await ${varName}.json();`);
      for (const ex of step.extract) {
        body.push(`    ctx['${ex.bind}'] = json${toPathAccessor(ex.fieldPath)};`);
      }
    }
    body.push('  }');
  });
  body.push('});');
  return body.join('\n');
}

function buildUrlExpression(pathTemplate: string): string {
  // Replace {param} with string interpolation referencing ctx binding paramVar if exists
  return '`' + pathTemplate.replace(/\{([^}]+)\}/g, (_, p) => '${ctx.' + camelCase(p) + 'Var || ' + "'" + '${' + p + '}' + "'" + '}') + '`';
}

function toPathAccessor(fieldPath: string): string {
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldPath)) return '.' + fieldPath;
  return `['${fieldPath.replace(/'/g, "\\'")}']`;
}

function escapeQuotes(s: string): string { return s.replace(/'/g, "\'"); }
function camelCase(s: string){ return s.charAt(0).toLowerCase()+s.slice(1); }
