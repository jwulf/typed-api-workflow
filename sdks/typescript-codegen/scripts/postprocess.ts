/** Post-processing: derive Zod schemas & semantic branded types, generate function wrappers. */
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';
import crypto from 'crypto';

const ROOT = process.cwd();
const SPEC = path.resolve(ROOT, '../../rest-api.domain.yaml');
const GEN_MODELS_DIR = path.join(ROOT, 'src/gen/models');
// Relocated: semantic artifacts now generated under src/gen/semantic for clear separation
const SEMANTIC_DIR = path.join(ROOT, 'src/gen/semantic');
fs.mkdirSync(SEMANTIC_DIR, { recursive: true });

interface OA3 {
  components?: { schemas?: Record<string, any> };
}

if (!fs.existsSync(SPEC)) {
  console.warn('[postprocess] Spec not found, skipping semantic generation');
  process.exit(0);
}
const specContent = fs.readFileSync(SPEC, 'utf8');
const spec: OA3 = parse(specContent);
const specHash = crypto.createHash('sha256').update(specContent).digest('hex');
const schemas = spec.components?.schemas || {};
// Build operationId -> detail map for rich JSDoc
interface OperationDetail { summary?: string; description?: string; tags?: string[]; method?: string; path?: string; requestRef?: string }
const operationDetails = new Map<string, OperationDetail>();
try {
  const parsed: any = parse(specContent);
  for (const [p, item] of Object.entries<any>(parsed.paths || {})) {
    for (const verb of Object.keys(item)) {
      const op: any = (item as any)[verb];
      if (op && op.operationId) {
        // Derive request body schema ref (application/json preferred)
        let requestRef: string | undefined;
        const rb = op.requestBody;
        const content = rb && rb.content && typeof rb.content === 'object' ? rb.content : undefined;
        if (content) {
          const jsonMedia = Object.keys(content).find(mt => mt.includes('json')) || Object.keys(content)[0];
            const mediaObj = jsonMedia ? content[jsonMedia] : undefined;
            const schema = mediaObj && mediaObj.schema;
            if (schema && schema.$ref) {
              requestRef = schema.$ref.split('/').pop();
            }
        }
        operationDetails.set(op.operationId, {
          summary: op.summary || undefined,
          description: op.description || undefined,
          tags: Array.isArray(op.tags) ? op.tags : undefined,
          method: verb.toUpperCase(),
          path: p,
          requestRef
        });
      }
    }
  }
} catch (e) { console.warn('[postprocess] Failed parsing operation details', e); }

// Helpers
const brandCandidate = (name: string, schema: any) => schema?.['x-semantic-type'] || /(Key|Id|Cursor)$/.test(name);

function zodForSchema(name: string, schema: any, imports: Set<string>): string {
  if (!schema) return 'z.any()';
  if (schema.enum) {
    return `z.enum([${schema.enum.map((v: any) => JSON.stringify(v)).join(', ')}])${brandCandidate(name, schema) ? `.brand<'${name}'>()` : ''}`;
  }
  if (schema.discriminator && Array.isArray(schema.oneOf)) {
    const disc = schema.discriminator.propertyName;
    const refs = schema.oneOf.map((o: any) => o.$ref && o.$ref.split('/').pop()).filter(Boolean);
  refs.forEach((r: string) => imports.add(r));
  return `z.discriminatedUnion(${JSON.stringify(disc)}, [${refs.map((r: string) => `${r}Schema`).join(', ')}])`;
  }
  if (schema.oneOf) {
    const variants = schema.oneOf.map((sub: any, i: number) => {
      if (sub.$ref) { const nm = sub.$ref.split('/').pop(); imports.add(nm); return `${nm}Schema`; }
      return zodForSchema(name + 'OneOf' + i, sub, imports);
    });
    return `z.union([${variants.join(', ')}])`;
  }
  if (schema.anyOf) {
    const variants = schema.anyOf.map((sub: any, i: number) => {
      if (sub.$ref) { const nm = sub.$ref.split('/').pop(); imports.add(nm); return `${nm}Schema`; }
      return zodForSchema(name + 'AnyOf' + i, sub, imports);
    });
    return `z.union([${variants.join(', ')}])`;
  }
  if (schema.allOf) {
    const parts = schema.allOf.map((seg: any, i: number) => {
      if (seg.$ref) { const nm = seg.$ref.split('/').pop(); imports.add(nm); return `${nm}Schema`; }
      return zodForSchema(name + 'AllOf' + i, seg, imports);
    });
  const inter = parts.slice(1).reduce((acc: string, cur: string) => `z.intersection(${acc}, ${cur})`, parts[0]);
    return inter;
  }
  switch (schema.type) {
    case 'string': {
      let base = 'z.string()';
      if (schema.format === 'date-time') base = 'z.string().datetime({ offset: true })';
      if (brandCandidate(name, schema)) base += `.brand<'${name}'>()`;
      return base;
    }
    case 'integer':
    case 'number': {
      let base = 'z.number()';
      if (brandCandidate(name, schema)) base += `.brand<'${name}'>()`;
      return base;
    }
    case 'boolean': return 'z.boolean()';
    case 'array': return `z.array(${zodForSchema(name + 'Item', schema.items || {}, imports)})`;
    case 'object': {
      const props = schema.properties || {};
      const entries = Object.entries(props).map(([pname, pschema]: [string, any]) => {
        let expr: string;
        if (pschema.$ref) { const ref = pschema.$ref.split('/').pop(); imports.add(ref); expr = `${ref}Schema`; }
        else expr = zodForSchema(name + '_' + pname, pschema, imports);
        if (!(schema.required || []).includes(pname)) expr += '.optional()';
        return `  ${JSON.stringify(pname)}: ${expr}`;
      });
      let obj = `z.object({\n${entries.join(',\n')}\n})`;
      if (brandCandidate(name, schema)) obj += `.brand<'${name}'>()`;
      return obj;
    }
  }
  return 'z.any()';
}

// Clean previous
const zodModelsFile = path.join(SEMANTIC_DIR, 'zodModels.ts');
if (fs.existsSync(zodModelsFile)) fs.unlinkSync(zodModelsFile);

// Enhance ref handling to use z.lazy to avoid forward reference TDZ issues
const originalZodForSchema = zodForSchema;
function wrapRef(name: string) { return `z.lazy(() => ${name}Schema)`; }

const header = `import { z } from 'zod';\nimport * as SK from './camundaKeys.js';\n\n/** Generated Zod model schemas (lazy refs) */\n`;
let body = '';
const indexExports: string[] = [];
const entries = Object.entries(schemas);
const plain = entries.filter(([_, s]) => !(s as any)?.discriminator);
const discriminated = entries.filter(([_, s]) => (s as any)?.discriminator);
const ordered = [...plain, ...discriminated];
for (const [name, schema] of ordered) {
  const imports = new Set<string>();
  let expr = originalZodForSchema(name, schema, imports);
  // Replace direct FooSchema references inside expressions with lazy wrappers except self, skip for discriminated union to retain strong typing only if variants appear earlier
  if (!schema.discriminator) {
    [...imports].forEach(ref => {
      if (ref === name) return;
      const re = new RegExp(`(?<!z\\.lazy\\(\\(\\) => )\\b${ref}Schema\\b`, 'g');
      expr = expr.replace(re, wrapRef(ref));
    });
  }
  if (brandCandidate(name, schema)) {
    if (name === 'CamundaKey') {
      // Abstract base: no concrete helper namespace, keep simple brand only
      // Remove trailing brand transform insertion logic; expr already contains brand via zodForSchema
    } else {
      expr = `${expr}.transform(v => SK.${name}.create(String(v))) as unknown as z.ZodType<SK.${name}>`;
    }
  }
  body += `// Schema: ${name}\nexport const ${name}Schema = ${expr};\nexport type ${name} = z.infer<typeof ${name}Schema>;\n\n`;
  indexExports.push(`export { ${name}Schema } from './zodModels.js';`);
  indexExports.push(`export type { ${name} } from './zodModels.js';`);
}
fs.writeFileSync(zodModelsFile, '/** @generated */\n' + header + body, 'utf8');
fs.writeFileSync(path.join(SEMANTIC_DIR, 'index.ts'), '/** @generated */\n' + indexExports.join('\n'), 'utf8');
console.log(`[postprocess] Generated Zod schemas for ${Object.keys(schemas).length} components (lazy).`);

// --- Model fixups: sanitize invalid enum identifiers like 'camunda.document.type' ---
const MODEL_DIR = GEN_MODELS_DIR;
const enumPattern = /export enum '([A-Za-z0-9_.-]+)'/g;
const refPattern = /\.('([A-Za-z0-9_.-]+)')/g; // Namespace reference

function toPascal(raw: string) {
  return raw
    .split(/[._-]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

for (const file of fs.readdirSync(MODEL_DIR)) {
  if (!file.endsWith('.ts')) continue;
  const full = path.join(MODEL_DIR, file);
  let content = fs.readFileSync(full, 'utf8');
  let changed = false;
  // Fix empty type alias: export type Name = ;
  content = content.replace(/export type (\w+) =\s*;\s*/g, (_m, name) => {
    changed = true; return `export type ${name} = string;\n`; });
  // Replace enum declarations
  content = content.replace(enumPattern, (_m, name) => {
    changed = true;
    return `export enum ${toPascal(name)}`;
  });
  // Replace namespace references DocumentReference.'camunda.document.type'
  content = content.replace(/DocumentReference\.'([A-Za-z0-9_.-]+)'/g, (_m, name) => {
    changed = true;
    return `DocumentReference.${toPascal(name)}`;
  });
  // Replace property type references within namespace body
  content = content.replace(/'([A-Za-z0-9_.-]+)'\s*=/g, (_m, name) => {
    // keep assignment for enum member lines unaffected
    return `${toPascal(name)} =`;
  });
  if (changed) fs.writeFileSync(full, content, 'utf8');
}
console.log('[postprocess] Sanitized model enum identifiers.');

// --- Apply namespace semantic key type aliases in generated model files ---
// Replaces simple aliases with the corresponding namespace nominal type from semanticKeys.ts.
const BRAND_NAME_REGEX = /(Key|Id|Cursor)$/;
for (const file of fs.readdirSync(MODEL_DIR)) {
  if (!file.endsWith('.ts')) continue;
  const full = path.join(MODEL_DIR, file);
  let content = fs.readFileSync(full, 'utf8');
  const nameMatch = file.match(/^(.*)\.ts$/);
  if (!nameMatch) continue;
  const typeName = nameMatch[1];
  if (!BRAND_NAME_REGEX.test(typeName)) continue;
  if (typeName === 'CamundaKey') continue; // keep abstract base alias simple
  // Only brand if it's a simple alias (no object literal starts with { on following line)
  // Pattern: export type X = something; (and 'something' does not start with '{')
  const simpleAliasRegex = new RegExp(`export type ${typeName} = ([^;{]+);`);
  if (simpleAliasRegex.test(content)) {
    content = content.replace(simpleAliasRegex, (_m, rhs) => {
      if (!/string|Key|Id|Cursor/.test(rhs)) return _m;
  return `import type { ${typeName} as __NS_${typeName} } from '../semantic/camundaKeys';\nexport type ${typeName} = __NS_${typeName};`;
    });
    fs.writeFileSync(full, content, 'utf8');
  }
}
console.log('[postprocess] Rewritten model aliases to namespace semantic key types.');

// Ensure abstract base CamundaKey model remains a simple branded string alias (no helper import)
try {
  const camundaKeyModel = path.join(MODEL_DIR, 'CamundaKey.ts');
  if (fs.existsSync(camundaKeyModel)) {
    let ck = fs.readFileSync(camundaKeyModel, 'utf8');
    // Replace any import-to-namespace rewrite if present
    ck = ck.replace(/import type { CamundaKey[^;]+;\nexport type CamundaKey = __NS_CamundaKey;?/s, "// Abstract base key brand: simple string brand retained\nexport type CamundaKey = string & { readonly __type?: 'CamundaKey' };\n");
    // Or if it's just the original alias referencing helper interface
    ck = ck.replace(/import type { CamundaKey as __NS_CamundaKey } from '..\/semantic\/camundaKeys';\nexport type CamundaKey = __NS_CamundaKey;/, "// Abstract base key brand: simple string brand retained\nexport type CamundaKey = string & { readonly __type?: 'CamundaKey' };\n");
    fs.writeFileSync(camundaKeyModel, ck, 'utf8');
  }
} catch (e) {
  console.warn('[postprocess] Failed to normalize CamundaKey base model', e);
}

// (lifters removed; namespaces in semanticKeys provide creation API)

// --- Auto-generate service wrappers with response validation ---
try {
  const SERVICES_DIR = path.join(ROOT, 'src/gen/services');
  const serviceFiles = fs.readdirSync(SERVICES_DIR).filter(f => f.endsWith('.ts'));
  const wrapperLines: string[] = [];
  // NOTE: autoWrappers now emitted into src/gen/wrappers so relative imports change
  const imports: string[] = [
    "import { responseValidationEnabled, currentValidationMode, requestValidationMode } from '../../runtime/config';",
    "import * as Sem from '../semantic';"
  ]; 
  const serviceImports: string[] = [];
  wrapperLines.push(`function maybeValidateRequest(sideMode: string, schema: any, val: any) {\n  if (!schema) return;\n  if (sideMode === 'none') return;\n  try { schema.parse && schema.parse(val); } catch (e: any) { if (sideMode === 'warn') { console.warn('[camunda-sdk] request validation warning', e?.errors||e?.message||e); } else throw e; }\n}`);
  wrapperLines.push(`function wrapCallWithReq(args: any, callFactory: (a:any)=>any, reqSchema: any, resSchema: any) {\n  // Request-side validation\n  if (reqSchema) { const mode = requestValidationMode(); if (mode !== 'none') maybeValidateRequest(mode, reqSchema, args?.requestBody); }\n  const p = callFactory(args);\n  if (!resSchema) return p;\n  if (!responseValidationEnabled()) return p;\n  return p.then((d: any) => { if (currentValidationMode() === 'none') return d; return resSchema.parse ? resSchema.parse(d) : d; });\n}`);
  const servicesObj: string[] = [];
  // Build set of available schemas
  const zodModelsSource = fs.readFileSync(zodModelsFile, 'utf8');
  const availableSchemas = new Set<string>();
  const schemaNameRegex = /export const (\w+)Schema/g;
  let sm: RegExpExecArray | null;
  while ((sm = schemaNameRegex.exec(zodModelsSource))) availableSchemas.add(sm[1]);
  const flatLines: string[] = [];
  const seenMethodNames = new Set<string>();
  const duplicateMethodNames = new Set<string>();
  // First pass to detect duplicates
  for (const file of serviceFiles) {
    const content = fs.readFileSync(path.join(SERVICES_DIR, file), 'utf8');
    const methodRegex = /public static (\w+)\s*\(/g;
    let mm: RegExpExecArray | null;
    while ((mm = methodRegex.exec(content))) {
      const name = mm[1];
      if (seenMethodNames.has(name)) duplicateMethodNames.add(name); else seenMethodNames.add(name);
    }
  }
  for (const file of serviceFiles) {
    const full = path.join(SERVICES_DIR, file);
    const content = fs.readFileSync(full, 'utf8');
    const serviceName = file.replace(/\.ts$/, '');
  serviceImports.push(`import { ${serviceName} } from '../services/${serviceName}';`);
    const methodRegex = /public static (\w+)\s*\(([^)]*)\):\s*CancelablePromise<([^>]+)>/g;
    const methodEntries: string[] = [];
    let m: RegExpExecArray | null;
  while ((m = methodRegex.exec(content))) {
      const method = m[1];
      const paramsSeg = m[2].trim();
      const retRaw = m[3].trim();
      // Skip primitives / void
      if (/^(void|string|number|boolean)$/.test(retRaw)) continue;
      // Extract simple type token (strip generics, unions, intersections)
      const simple = retRaw.split(/[<|&\s]/)[0].replace(/[()]/g, '');
      if (!simple || /[{}]/.test(simple)) continue;
      const schemaName = `${simple}Schema`;
      const hasSchema = availableSchemas.has(simple);
      const callExpr = paramsSeg.length ? `${serviceName}.${method}(args)` : `${serviceName}.${method}()`;
      const signature = paramsSeg.length ? `(args: Parameters<typeof ${serviceName}.${method}>[0])` : `()`;
      const schemaRef = hasSchema ? `Sem.${schemaName}` : 'undefined';
      const detail = operationDetails.get(method);
      // Spec-driven request schema (preferred over regex extraction)
      let requestSchemaRef = 'undefined';
      if (detail?.requestRef && availableSchemas.has(detail.requestRef)) {
        requestSchemaRef = `Sem.${detail.requestRef}Schema`;
      }
      let jsdocLines: string[] = [];
      if (detail?.summary) jsdocLines.push(detail.summary.replace(/\r/g, ''));
      if (detail?.description) {
        const desc = String(detail.description).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        jsdocLines.push(...desc);
      }
      const meta: string[] = [];
      if (detail?.tags?.length) meta.push(`Tags: ${detail.tags.join(', ')}`);
      if (detail?.method && detail?.path) meta.push(`HTTP: ${detail.method} ${detail.path}`);
      meta.push(`OperationId: ${method}`);
      if (schemaRef !== 'undefined') meta.push(`Response: ${schemaName}`);
      jsdocLines.push(...meta);
      const jsdoc = jsdocLines.length ? '/**\n' + jsdocLines.map(l => ` * ${l.replace(/\*/g, '')}`).join('\n') + '\n */\n' : '';
  methodEntries.push(`${jsdoc}${method}: ${signature} => wrapCallWithReq(args, (_a:any)=>${callExpr}, ${requestSchemaRef}, ${schemaRef})`);
      // Flat export alias (Option C): method name if unique, else ServiceName_method
      const flatName = duplicateMethodNames.has(method) ? `${serviceName}_${method}` : method;
      if (!flatLines.some(l => l.includes(`export const ${flatName}`))) {
  flatLines.push(`${jsdoc}export const ${flatName} = ServicesWrapped.${serviceName}.${method};`);
      }
    }
    if (methodEntries.length) {
      servicesObj.push(`${serviceName}: {\n  ${methodEntries.join(',\n  ')}\n}`);
    }
  }
  const autoWrapperDir = path.join(ROOT, 'src/gen/wrappers');
  const autoWrapperFile = path.join(autoWrapperDir, 'autoWrappers.ts');
  const header = `/** @generated Auto service response-validation wrappers (spec sha256: ${specHash}).\n * DO NOT EDIT MANUALLY. Changes will be overwritten.\n */`;
  const fileContent = [
    header,
    ...imports,
    ...serviceImports,
    '',
    ...wrapperLines,
    '',
    `export const ServicesWrapped = {\n${servicesObj.join(',\n')}\n};`
  ].join('\n');
  fs.mkdirSync(autoWrapperDir, { recursive: true });
  fs.writeFileSync(autoWrapperFile, fileContent, 'utf8');
  // Emit flat exports file
  const flatFile = path.join(autoWrapperDir, 'flatExports.ts');
  const flatHeader = `/** @generated Flat wrapper exports (no validation unless enabled). */`;
  fs.writeFileSync(flatFile, [flatHeader, "import { ServicesWrapped } from './autoWrappers';", '', ...flatLines].join('\n'), 'utf8');
  // Remove legacy non-gen location if present to avoid confusion
  const legacyWrapperFile = path.join(ROOT, 'src/wrappers/autoWrappers.ts');
  if (fs.existsSync(legacyWrapperFile)) {
    try { fs.unlinkSync(legacyWrapperFile); console.log('[postprocess] Removed legacy src/wrappers/autoWrappers.ts'); } catch {}
  }
  console.log(`[postprocess] Generated auto service wrappers for ${servicesObj.length} services (in gen/wrappers).`);
  // Ensure export in index will be added.
} catch (e) {
  console.warn('[postprocess] Failed to generate auto service wrappers', e);
}

// --- Auto-generate public index.ts exports (services + semantic + runtime + wrappers) ---
try {
  const INDEX_FILE = path.join(ROOT, 'src', 'index.ts');
  const SERVICES_DIR = path.join(ROOT, 'src/gen/services');
  const serviceExports: string[] = [];
  if (fs.existsSync(SERVICES_DIR)) {
    for (const f of fs.readdirSync(SERVICES_DIR)) {
      if (!f.endsWith('.ts')) continue;
      const svc = f.replace(/\.ts$/, '');
      serviceExports.push(`export { ${svc} } from './gen/services/${svc}';`);
    }
  }
  serviceExports.sort();
  const indexContent = `/** @generated Public entrypoint (spec sha256: ${specHash}) */\n` +
    `// Core client primitives\n` +
    `export { OpenAPI } from './gen/core/OpenAPI';\n` +
    `export type { OpenAPIConfig } from './gen/core/OpenAPI';\n` +
    `export { ApiError } from './gen/core/ApiError';\n` +
    `export { CancelablePromise, CancelError } from './gen/core/CancelablePromise';\n\n` +
    `// Services\n` + serviceExports.join('\n') + '\n\n' +
    `// Semantic schemas & runtime\n` +
    `export * from './gen/semantic';\n` +
    `export * from './runtime/config';\n` +
    `export * from './runtime/validation';\n` +
    `// Auto generated wrappers (validated responses)\n` +
    `export * from './gen/wrappers/autoWrappers.js';\n` +
    `// Flat convenience exports (Option C)\n` +
    `export * from './gen/wrappers/flatExports.js';\n`;
  fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');
  console.log('[postprocess] Generated public index.ts exports.');
} catch (e) {
  console.warn('[postprocess] Failed generating index.ts', e);
}

// (Removed) request.ts patch for boxed branded keys: no longer required with primitive string branding.

// --- Insert overloads using vendor extension x-polymorphic-schema (oneOf variants) ---
try {
  interface Poly { name: string; variants: string[] }
  const polys: Poly[] = [];
  for (const [n, s] of Object.entries(schemas)) {
    if ((s as any)['x-polymorphic-schema'] && Array.isArray((s as any).oneOf)) {
      const variants = (s as any).oneOf.map((v: any) => v.$ref && v.$ref.split('/').pop()).filter(Boolean);
      if (variants.length > 1) polys.push({ name: n, variants });
    }
  }
  if (polys.length) console.log('[postprocess] Polymorphic schemas:', polys.map(p => `${p.name}(${p.variants.length})`).join(', '));
  if (polys.length) {
    const SERVICES_DIR = path.join(ROOT, 'src/gen/services');
    for (const sf of fs.readdirSync(SERVICES_DIR)) {
      if (!sf.endsWith('.ts')) continue;
      const full = path.join(SERVICES_DIR, sf);
      let content = fs.readFileSync(full, 'utf8');
      for (const poly of polys) {
        const re = new RegExp(`public static (\\w+)\\s*\\(\\{\\s*\\n\\s*requestBody,\\s*\\n\\s*\\}\\s*:\\s*\\{\\s*\\n\\s*requestBody: ${poly.name},`);
        const m = content.match(re);
        if (!m) continue;
        if (new RegExp(`@overload-inserted.*${poly.name}`).test(content)) continue;
        const methodName = m[1];
        const sigIndex = content.indexOf(m[0]);
        if (sigIndex === -1) continue;
        const retTypeMatch = content.slice(sigIndex, sigIndex + 600).match(/CancelablePromise<([^>]+)>/);
        if (!retTypeMatch) continue;
        const retType = retTypeMatch[1];
        // Ensure imports for variants
        for (const variant of poly.variants) {
          if (!content.includes(`import type { ${variant} }`)) {
            // Insert after first import block
            const classIdx = content.indexOf('export class');
            const importAreaEnd = content.lastIndexOf('\n', classIdx);
            content = content.slice(0, importAreaEnd) + `import type { ${variant} } from '../models/${variant}';\n` + content.slice(importAreaEnd);
          }
        }
        const overloads = poly.variants.map(v => `    public static ${methodName}(params: { requestBody: ${v} }): CancelablePromise<${retType}>;`).join('\n');
        content = content.slice(0, sigIndex) + `// @overload-inserted for ${methodName} (${poly.name})\n${overloads}\n` + content.slice(sigIndex);
        console.log(`[postprocess] Inserted overloads for ${methodName} in ${sf}`);
      }
      fs.writeFileSync(full, content, 'utf8');
    }
  }
} catch (e) {
  console.warn('[postprocess] Failed inserting overloads (polymorphic)', e);
}

// --- Insert pagination overloads for request types containing or extending SearchQueryRequest (with polymorphic page) ---
try {
  const PAGE_POLY_NAME = 'SearchQueryPageRequest';
  const pagePoly = (schemas as any)[PAGE_POLY_NAME];
  if (pagePoly && pagePoly['x-polymorphic-schema'] && Array.isArray(pagePoly.oneOf)) {
    const pageVariants: string[] = pagePoly.oneOf.map((v: any) => v.$ref && v.$ref.split('/').pop()).filter(Boolean);
    // Build map of model -> hasPage flag (either directly declares page?: SearchQueryPageRequest OR intersects with base SearchQueryRequest)
    const hasPage: Record<string, boolean> = {};
    const modelFiles = fs.readdirSync(GEN_MODELS_DIR).filter(f => f.endsWith('.ts'));
    for (const mf of modelFiles) {
      const name = mf.replace(/\.ts$/, '');
      const src = fs.readFileSync(path.join(GEN_MODELS_DIR, mf), 'utf8');
      if (/page\?:\s*SearchQueryPageRequest;/.test(src) || /SearchQueryRequest &/.test(src) || name === 'SearchQueryRequest') {
        hasPage[name] = true;
      }
    }
    const searchTypes = Object.keys(hasPage);
    if (searchTypes.length) {
      const SERVICES_DIR = path.join(ROOT, 'src/gen/services');
      for (const sf of fs.readdirSync(SERVICES_DIR)) {
        if (!sf.endsWith('.ts')) continue;
        const full = path.join(SERVICES_DIR, sf);
        let content = fs.readFileSync(full, 'utf8');
        let mutated = false;
        // Parse methods (grab signature up to return type)
        const methodRegex = /public static (\w+)\s*\(([^)]*)\):\s*CancelablePromise<([^>]+)>/g;
        let mm: RegExpExecArray | null;
        while ((mm = methodRegex.exec(content))) {
          const methodName = mm[1];
          const retType = mm[3];
          // Slice a window after the match start to inspect the parameter type annotation
          const sliceStart = mm.index || 0;
          const sigSlice = content.slice(sliceStart, sliceStart + 600); // enough to cover type annotation
          const paramTypeMatch = sigSlice.match(/}:\s*{\s*requestBody\??:\s*([A-Za-z0-9_]+)/);
          const reqType = paramTypeMatch ? paramTypeMatch[1] : undefined;
          if (reqType && !hasPage[reqType]) {
            // If this type is an alias that intersects with a type having page, attempt to open its model and check for & SearchQueryRequest
            const modelFile = path.join(GEN_MODELS_DIR, reqType + '.ts');
            if (fs.existsSync(modelFile)) {
              const src = fs.readFileSync(modelFile, 'utf8');
              if (/SearchQueryRequest &/.test(src)) hasPage[reqType] = true;
            }
          }
          if (reqType && hasPage[reqType]) {
            if (new RegExp(`@overload-inserted pagination ${methodName}`).test(content)) continue;
            // Determine if requestBody optional
            const optional = /requestBody\?:/.test(sigSlice);
            const rbField = optional ? 'requestBody?' : 'requestBody';
            const overloads = pageVariants.map(v => `    public static ${methodName}(params: { ${rbField}: (Omit<${reqType}, 'page'> & { page?: ${v} }) }): CancelablePromise<${retType}>;`).join('\n');
            // Ensure imports for variants
            for (const variant of pageVariants) {
              if (!content.includes(`import type { ${variant} }`)) {
                const classIdx = content.indexOf('export class');
                const importAreaEnd = content.lastIndexOf('\n', classIdx);
                content = content.slice(0, importAreaEnd) + `import type { ${variant} } from '../models/${variant}';\n` + content.slice(importAreaEnd);
                mutated = true;
              }
            }
            const sigStart = content.indexOf(mm[0]);
            content = content.slice(0, sigStart) + `// @overload-inserted pagination ${methodName} (${reqType}.page)\n${overloads}\n` + content.slice(sigStart);
            mutated = true;
            console.log(`[postprocess] Inserted pagination overloads for ${methodName} in ${sf}`);
          }
          if (!reqType) continue;
        }
        if (mutated) fs.writeFileSync(full, content, 'utf8');
      }
    }
  }
} catch (e) {
  console.warn('[postprocess] Failed inserting pagination overloads', e);
}

// --- Generate semantic key namespace helpers using primitive branded strings ---
try {
  // Generate camunda key helper file (previously semanticKeys.ts)
  const legacySemanticFile = path.join(SEMANTIC_DIR, 'semanticKeys.ts');
  if (fs.existsSync(legacySemanticFile)) {
    try { fs.unlinkSync(legacySemanticFile); } catch { /* ignore */ }
  }
  const keyHelperFile = path.join(SEMANTIC_DIR, 'camundaKeys.ts');
  const modelFiles = fs.readdirSync(MODEL_DIR).filter(f => f.endsWith('.ts'));
  const brandNames: string[] = [];
  for (const f of modelFiles) {
    const base = f.replace(/\.ts$/, '');
    if (BRAND_NAME_REGEX.test(base)) brandNames.push(base);
  }
  const lines: string[] = [];
  lines.push(`/** Auto-generated semantic key helpers (primitive branded) */`);
  // Generic nominal type (primitive brand – erased at runtime)
  lines.push(`export type CamundaKey<T extends string> = string & { readonly __brand: T };`);
  lines.push(`interface __KeyConstraints { name: string; min?: number; max?: number; pattern?: RegExp }`);
  lines.push(`function __validateKey(value: string, c: __KeyConstraints): string {`);
  lines.push(`  if (!value) throw new Error('Invalid ' + c.name + ': empty');`);
  lines.push(`  if (c.min !== undefined && value.length < c.min) throw new Error('Invalid ' + c.name + ': length < ' + c.min);`);
  lines.push(`  if (c.max !== undefined && value.length > c.max) throw new Error('Invalid ' + c.name + ': length > ' + c.max);`);
  lines.push(`  if (c.pattern && !c.pattern.test(value)) throw new Error('Invalid ' + c.name + ': does not match ' + c.pattern);`);
  lines.push(`  return value;`);
  lines.push(`}`);
  lines.push(`function __isValidKey(value: string, c: __KeyConstraints): boolean {`);
  lines.push(`  if (!value) return false;`);
  lines.push(`  if (c.min !== undefined && value.length < c.min) return false;`);
  lines.push(`  if (c.max !== undefined && value.length > c.max) return false;`);
  lines.push(`  if (c.pattern && !c.pattern.test(value)) return false;`);
  lines.push(`  return true;`);
  lines.push(`}`);
  for (const name of brandNames.sort()) {
    // Skip emitting a concrete helper for the abstract base schema 'CamundaKey';
    // users should work with specific key types only.
    if (name === 'CamundaKey') continue;
    const schema = (schemas as any)[name];
    // Collect constraints possibly inherited via allOf chain
    let pattern: string | undefined;
    let minLength: number | undefined;
    let maxLength: number | undefined;
    function harvest(s: any) {
      if (!s) return;
      if (typeof s.pattern === 'string' && !pattern) pattern = s.pattern;
      if (typeof s.minLength === 'number' && minLength === undefined) minLength = s.minLength;
      if (typeof s.maxLength === 'number' && maxLength === undefined) maxLength = s.maxLength;
    }
    if (schema) {
      if (schema.allOf) schema.allOf.forEach((seg: any) => { if (seg.$ref) { const refName = seg.$ref.split('/').pop(); harvest((schemas as any)[refName]); } else harvest(seg); });
      harvest(schema);
    }
  const constraintParts: string[] = [`name: '${name}'`];
  if (minLength !== undefined) constraintParts.push(`min: ${minLength}`);
  if (maxLength !== undefined) constraintParts.push(`max: ${maxLength}`);
  if (pattern) constraintParts.push(`pattern: new RegExp(${JSON.stringify(pattern)})`);
  lines.push(`export type ${name} = CamundaKey<'${name}'>;`);
  lines.push(`const __C_${name}: __KeyConstraints = { ${constraintParts.join(', ')} };`);
  lines.push(`export namespace ${name} {`);
  lines.push(`  export function create(value: string): ${name} { return __validateKey(value, __C_${name}) as ${name}; }`);
  lines.push(`  export function getValue(key: ${name}): string { return key; }`);
  lines.push(`  export function equals(a: ${name}, b: ${name}): boolean { return a === b; }`);
  lines.push(`  export function isValid(value: string): boolean { return __isValidKey(value, __C_${name}); }`);
  lines.push(`}`);
  }
  fs.writeFileSync(keyHelperFile, '/** @generated */\n' + lines.join('\n'), 'utf8');
  // rewrite semantic index: export all semanticKeys, only schema constants (avoid duplicate type re-exports)
  const semanticIndex = path.join(SEMANTIC_DIR, 'index.ts');
  const zodSrcForIndex = fs.readFileSync(zodModelsFile, 'utf8');
  const schemaConstMatches = Array.from(zodSrcForIndex.matchAll(/export const (\w+)Schema /g)).map(m => m[1] + 'Schema');
  const schemaExportLines = schemaConstMatches.map(n => `export { ${n} } from './zodModels.js';`).join('\n');
  let semanticIndexContent = '/** @generated */\n';
  semanticIndexContent += `export * from './camundaKeys.js';\n`;
  semanticIndexContent += schemaExportLines + '\n';
  fs.writeFileSync(semanticIndex, semanticIndexContent, 'utf8');
  console.log(`[postprocess] Generated primitive semantic key helpers for ${brandNames.length} keys.`);
} catch (e) {
  console.warn('[postprocess] Failed to generate semantic key helpers', e);
}

// Add @generated headers across src/gen tree
try {
  const GEN_ROOT = path.join(ROOT, 'src/gen');
  const header = '/** @generated */';
  const stack = [GEN_ROOT];
  while (stack.length) {
    const dir = stack.pop()!;
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) { stack.push(full); continue; }
      if (!full.endsWith('.ts')) continue;
      const content = fs.readFileSync(full, 'utf8');
      if (content.startsWith(header)) continue;
      fs.writeFileSync(full, header + '\n' + content, 'utf8');
    }
  }
  console.log('[postprocess] Applied @generated headers.');
} catch (e) {
  console.warn('[postprocess] Failed to apply @generated headers', e);
}

// Invoke modular spec-driven wrapper generation (overrides earlier wrapper if present)
await import('./wrapOperations.js');
