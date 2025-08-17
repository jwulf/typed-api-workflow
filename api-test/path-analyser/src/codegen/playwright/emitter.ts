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
  // Collect extraction target variable names across all steps
  const extractionVars = new Set<string>();
  if (s.requestPlan) {
    for (const step of s.requestPlan) {
      if (step.extract) {
        for (const ex of step.extract) extractionVars.add(ex.bind);
      }
    }
  }
  if ((s as any).bindings && Object.keys((s as any).bindings).length) {
    body.push('  // Seed scenario bindings');
    for (const [k,v] of Object.entries((s as any).bindings)) {
      if (v === '__PENDING__') continue; // placeholder for extraction
      if (extractionVars.has(k)) continue; // real value will be extracted later
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
  const isFinal = idx === (s.requestPlan!.length - 1);
  const hasShape = Array.isArray((s as any).responseShapeFields) && (s as any).responseShapeFields.length > 0;
    // Basic body handling placeholder
    body.push(`  // Step ${idx+1}: ${step.operationId}`);
    body.push(`  {`);
    body.push(`    const url = baseUrl + ${urlExpr};`);
    const bodyVar = `body${idx+1}`;
    if (step.bodyKind === 'json' && step.bodyTemplate) {
      const json = JSON.stringify(step.bodyTemplate, null, 4)
        .replace(/"\\?\$\{([^}]+)\}"/g, (_,v)=>'ctx["'+v+'"]');
      body.push(`    const ${bodyVar} = ${json};`);
    } else if (step.bodyKind === 'multipart' && step.multipartTemplate) {
      // multipart template format: { fields: Record<string,string>, files: Record<string,string> }
      const tpl = JSON.stringify(step.multipartTemplate, null, 4)
        .replace(/"\\?\$\{([^}]+)\}"/g, (_,v)=>'ctx["'+v+'"]');
      body.push(`    const ${bodyVar} = ${tpl};`);
    }
    const opts: string[] = [];
    opts.push('headers: await authHeaders()');
    if (step.bodyKind === 'json' && step.bodyTemplate) opts.push(`data: ${bodyVar}`);
    if (step.bodyKind === 'multipart' && step.multipartTemplate) {
      // Convert template to multipart form-data for Playwright: use multipart option
      // Interpret files entries: value '@@FILE:relativePath' means read file at runtime via fs
  body.push(`    const formData: Array<{ name: string; value: any; fileName?: string }> = [];`);
      body.push(`    for (const [k,v] of Object.entries(${bodyVar}.fields||{})) formData.push({ name: k, value: String(v) });`);
      body.push(`    for (const [k,v] of Object.entries(${bodyVar}.files||{})) {
        if (typeof v === 'string' && v.startsWith('@@FILE:')) {
          const p = v.slice('@@FILE:'.length);
          formData.push({ name: k, value: await (await import('fs')).promises.readFile(p), fileName: p.split('/').pop() });
        } else {
          formData.push({ name: k, value: v });
        }
      }`);
      opts.push('multipart: formData');
    }
    body.push(`    const ${varName} = await request.${method}(url, { ${opts.join(', ')} });`);
    body.push(`    expect(${varName}.status()).toBe(${step.expect.status});`);
  // If this is the final step and scenario expects a success body, assert presence and types
  const isErrorScenario = (s as any).expectedResult && (s as any).expectedResult.kind === 'error';
  if (isFinal && hasShape && !isErrorScenario) {
      // Always parse once here so assertions can use it
      body.push(`    const json = await ${varName}.json();`);
      for (const f of (s as any).responseShapeFields as Array<{ name: string; type: string; required?: boolean }>) {
        const acc = 'json' + toPathAccessor(f.name);
        const t = (f as any).type || 'unknown';
        if (f.required) {
          body.push(`    expect(${acc}).not.toBeUndefined();`);
          body.push(`    expect(${acc}).not.toBeNull();`);
          body.push(...emitTypeAssertLines(acc, t));
        } else {
          body.push(`    if (${acc} !== undefined && ${acc} !== null) {`);
          body.push(...emitTypeAssertLines(acc, t, '      '));
          body.push(`    }`);
        }
      }
      // Deployment response shape assertions based on uploaded resource types (multipart only)
      if (step.bodyKind === 'multipart' && step.multipartTemplate && step.multipartTemplate.files) {
        // Prefer explicit domain-driven slices if present on the step
        const expectedSlices = new Set<string>(Array.isArray((step as any).expectedDeploymentSlices) ? (step as any).expectedDeploymentSlices : []);
        // Fallback to filename heuristic when domain-driven mapping not provided
        if (expectedSlices.size === 0) {
          try {
            for (const [fname, fval] of Object.entries<any>(step.multipartTemplate.files)) {
              if (typeof fval === 'string' && fval.startsWith('@@FILE:')) {
                const pth = fval.slice('@@FILE:'.length);
                const ext = path.extname(pth).toLowerCase();
                if (ext === '.bpmn' || ext === '.bpmn20.xml' || pth.includes('/bpmn/')) expectedSlices.add('processDefinition');
                if (ext === '.dmn' || ext === '.dmn11.xml' || pth.includes('/dmn/')) { expectedSlices.add('decisionDefinition'); expectedSlices.add('decisionRequirements'); }
                if (ext === '.form' || ext === '.json' || pth.includes('/forms/')) expectedSlices.add('form');
              }
            }
          } catch {}
        }
        if (expectedSlices.size > 0) {
          body.push(`    // Assert deployment items contain expected slices based on uploaded resources`);
          body.push(`    expect(Array.isArray(json.deployments)).toBeTruthy();`);
          if (expectedSlices.has('processDefinition')) body.push(`    expect(json.deployments?.[0]?.processDefinition).toBeTruthy();`);
          if (expectedSlices.has('decisionDefinition')) body.push(`    expect(json.deployments?.[0]?.decisionDefinition).toBeTruthy();`);
          if (expectedSlices.has('decisionRequirements')) body.push(`    expect(json.deployments?.[0]?.decisionRequirements).toBeTruthy();`);
          if (expectedSlices.has('form')) body.push(`    expect(json.deployments?.[0]?.form).toBeTruthy();`);
        }
      }
    }
    // Extraction
    if (step.extract && step.extract.length) {
      // Avoid duplicate parsing if already parsed for final-step assertions above
      if (!(isFinal && hasShape && !isErrorScenario)) {
        body.push(`    const json = await ${varName}.json();`);
      }
      let exIdx = 0;
      for (const ex of step.extract) {
        const optAcc = toOptionalAccessor(ex.fieldPath);
        const vname = `val_${idx+1}_${++exIdx}`;
        body.push(`    const ${vname} = json${optAcc};`);
        body.push(`    if (${vname} !== undefined) { ctx['${ex.bind}'] = ${vname}; }`);
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
  // Support paths like processes[0].bpmnProcessId or nested.simple
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldPath)) return '.' + fieldPath;
  // Split on dots, preserve bracket indices
  const parts = fieldPath.split('.');
  return parts.map(p => {
    const m = p.match(/^([a-zA-Z_][a-zA-Z0-9_]*)(\[[0-9]+\])?$/);
    if (m) {
      const base = '.' + m[1];
      const idx = m[2] || '';
      return base + idx;
    }
    return `['${p.replace(/'/g, "\\'")}']`;
  }).join('');
}

function escapeQuotes(s: string): string { return s.replace(/'/g, "\'"); }
function camelCase(s: string){ return s.charAt(0).toLowerCase()+s.slice(1); }

// Build an accessor using optional chaining for nested/array paths, e.g. a.b[0].c -> ?.a?.b?.[0]?.c
function toOptionalAccessor(fieldPath: string): string {
  // Similar to toPathAccessor but with optional chaining and safe array index segments
  const parts = fieldPath.split('.');
  return parts.map((p, i) => {
    const m = p.match(/^([a-zA-Z_][a-zA-Z0-9_]*)(\[[0-9]+\])?$/);
    if (m) {
      const base = `${i === 0 ? '?.' : '?.'}${m[1]}`; // always prefix with ?.
      const idx = m[2] ? `?.${m[2]}` : '';
      return base + idx;
    }
    // fallback for unusual keys
    return `?.['${p.replace(/'/g, "\\'")}']`;
  }).join('');
}

// Emit lines asserting the runtime type of a value according to a simple type name
function emitTypeAssertLines(accExpr: string, typeName: string, indent = '    '): string[] {
  switch (typeName) {
    case 'string': return [`${indent}expect(typeof ${accExpr}).toBe('string');`];
    case 'integer': return [
      `${indent}expect(typeof ${accExpr}).toBe('number');`,
      `${indent}expect(Number.isInteger(${accExpr})).toBeTruthy();`
    ];
    case 'number': return [`${indent}expect(typeof ${accExpr}).toBe('number');`];
    case 'boolean': return [`${indent}expect(typeof ${accExpr}).toBe('boolean');`];
    case 'array': return [`${indent}expect(Array.isArray(${accExpr})).toBeTruthy();`];
    case 'object': return [
      `${indent}expect(typeof ${accExpr}).toBe('object');`,
      `${indent}expect(Array.isArray(${accExpr})).toBeFalsy();`
    ];
    default: return [`${indent}/* unknown type: ${typeName} */`];
  }
}
