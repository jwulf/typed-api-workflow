/** Post-processing: derive Zod schemas & semantic branded types, then delegate wrapper generation to wrapOperations.ts. */
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
// (Removed legacy inline extraction of operation details; wrapper JSDoc now handled in wrapOperations.ts)

// Helpers
// Only brand primitive key/id/cursor style schemas (strings or simple enums) – avoid branding complex objects ending with Id
const brandCandidate = (name: string, schema: any) => {
  if (schema?.['x-semantic-type']) return true;
  if (!/(Key|Id|Cursor)$/.test(name)) return false;
  if (schema?.enum) return true;
  // brand only primitive string/number/integer types (not objects/arrays)
  return ['string', 'number', 'integer'].includes(schema?.type);
};

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
      if (sub.$ref) { const nm = sub.$ref.split('/').pop(); imports.add(nm); return `${nm}Schema.describe('Variant ${i + 1}: ${nm}')`; }
      const inline = zodForSchema(name + 'OneOf' + i, sub, imports);
      return `${inline}.describe('Variant ${i + 1}: inline ${name}OneOf${i}')`;
    });
    return `z.union([${variants.join(', ')}])`;
  }
  if (schema.anyOf) {
    const variants = schema.anyOf.map((sub: any, i: number) => {
      if (sub.$ref) { const nm = sub.$ref.split('/').pop(); imports.add(nm); return `${nm}Schema.describe('Variant ${i + 1}: ${nm}')`; }
      const inline = zodForSchema(name + 'AnyOf' + i, sub, imports);
      return `${inline}.describe('Variant ${i + 1}: inline ${name}AnyOf${i}')`;
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
      const requiredSet = new Set<string>((schema.required || []).map((r: any) => String(r)));
      const entries = Object.entries(props).map(([pname, pschema]: [string, any]) => {
        let expr: string;
        if (pschema.$ref) { const ref = pschema.$ref.split('/').pop(); imports.add(ref); expr = `${ref}Schema`; }
        else expr = zodForSchema(name + '_' + pname, pschema, imports);
        if (!requiredSet.has(pname)) expr += '.optional()';
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
  expr = `${expr}.transform(v => SK.${name}.assumeExists(String(v))) as unknown as z.ZodType<SK.${name}>`;
    }
  }
  body += `// Schema: ${name}\nexport const ${name}Schema = ${expr};\nexport type ${name} = z.infer<typeof ${name}Schema>;\n\n`;
  indexExports.push(`export { ${name}Schema } from './zodModels.js';`);
  indexExports.push(`export type { ${name} } from './zodModels.js';`);
}
fs.writeFileSync(zodModelsFile, '/** @generated */\n' + header + body, 'utf8');
// Fallback: ensure every component schema has at least a placeholder; detect any missing (e.g. complex objects with Id suffix)
try {
  const missing: string[] = [];
  for (const name of Object.keys(schemas)) {
    if (!new RegExp(`\\bexport const ${name}Schema =`).test(body)) missing.push(name);
  }
  if (missing.length) {
    let append = '';
    for (const name of missing) {
      const imports = new Set<string>();
      let expr = originalZodForSchema(name, (schemas as any)[name], imports);
      // Prevent accidental branding on fallback
      expr = expr.replace(/\.transform\([^)]*\) as unknown as z\.ZodType<SK\.[^>]+>/g, '');
      append += `// Schema (fallback): ${name}\nexport const ${name}Schema = ${expr};\nexport type ${name} = z.infer<typeof ${name}Schema>;\n\n`;
      if (!indexExports.includes(`export { ${name}Schema } from './zodModels.js';`)) {
        indexExports.push(`export { ${name}Schema } from './zodModels.js';`);
        indexExports.push(`export type { ${name} } from './zodModels.js';`);
      }
    }
    fs.appendFileSync(zodModelsFile, append, 'utf8');
    console.warn(`[postprocess] Added fallback semantic schemas for missing components: ${missing.join(', ')}`);
  }
} catch (e) {
  console.warn('[postprocess] Fallback inclusion failed', e);
}
fs.writeFileSync(path.join(SEMANTIC_DIR, 'index.ts'), '/** @generated */\n' + indexExports.join('\n'), 'utf8');
console.log(`[postprocess] Generated Zod schemas for ${Object.keys(schemas).length} components (lazy).`);

// --- Model fixups: sanitize invalid enum identifiers like 'camunda.document.type' ---
const MODEL_DIR = GEN_MODELS_DIR;
const enumPattern = /export enum '([A-Za-z0-9_.-]+)'/g;

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

// --- Deduplicate operations across services now that single-tag-per-operation invariant holds ---
try {
  // Build canonical opId -> service name mapping from spec tags
  function tagToService(tag: string) {
    return tag.split(/[^A-Za-z0-9]+/).filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join('') + 'Service';
  }
  interface OpMeta { service: string }
  const opToCanonical: Record<string, OpMeta> = {};
  for (const [p, item] of Object.entries((spec as any).paths || {})) {
    for (const [verb, op] of Object.entries<any>(item || {})) {
      if (!op || !op.operationId) continue;
      const tags: string[] = Array.isArray(op.tags) ? op.tags : [];
      if (tags.length !== 1) continue; // enforced by spectral rule
      opToCanonical[op.operationId] = { service: tagToService(tags[0]) };
    }
  }
  const SERVICES_DIR = path.join(ROOT, 'src/gen/services');
  if (fs.existsSync(SERVICES_DIR)) {
    for (const f of fs.readdirSync(SERVICES_DIR)) {
      if (!f.endsWith('.ts')) continue;
      const svcName = f.replace(/\.ts$/, '');
      let content = fs.readFileSync(path.join(SERVICES_DIR, f), 'utf8');
      let mutated = false;
      // Find any OperationId annotations in this file
      const opIdMatches = Array.from(content.matchAll(/OperationId: (\w+)/g)).map(m => m[1]);
      for (const opId of opIdMatches) {
        const canonical = opToCanonical[opId];
        if (!canonical) continue; // unknown op (maybe legacy) leave it
        if (canonical.service === svcName) continue; // correct placement
        // Remove this method block from current service
        const implIdx = content.indexOf(`public static ${opId}`);
        if (implIdx === -1) continue;
        // Walk forward to find end of method by brace depth
        const startSearch = implIdx;
        let braceStart = content.indexOf('{', implIdx);
        if (braceStart === -1) continue;
        let depth = 0; let i = braceStart; const len = content.length;
        for (; i < len; i++) {
          const ch = content[i];
            if (ch === '{') depth++;
            else if (ch === '}') { depth--; if (depth === 0) { i++; break; } }
        }
        const methodEnd = i;
        // Backtrack to preceding JSDoc start
        const jsdocIdx = content.lastIndexOf('/**', implIdx);
        const removalStart = jsdocIdx !== -1 ? jsdocIdx : startSearch;
        const before = content.slice(0, removalStart);
        const after = content.slice(methodEnd);
        content = before + after;
        mutated = true;
        console.log(`[postprocess] Removed duplicate operation ${opId} from ${svcName} (canonical: ${canonical.service}).`);
      }
      if (mutated) fs.writeFileSync(path.join(SERVICES_DIR, f), content, 'utf8');
    }
  }
} catch (e) {
  console.warn('[postprocess] Failed during duplicate operation pruning', e);
}

// --- Auto-generate public index.ts exports (services + semantic + runtime + wrappers) ---
try {
  const INDEX_FILE = path.join(ROOT, 'src', 'gen', 'public-index.ts');
  fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });
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
    `export { OpenAPI } from './core/OpenAPI';\n` +
    `export type { OpenAPIConfig } from './core/OpenAPI';\n` +
    `export { ApiError } from './core/ApiError';\n` +
    `export { CancelablePromise, CancelError } from './core/CancelablePromise';\n\n` +
    `// NOTE: Direct service class exports removed in favour of fully wrapped API functions.\n` +
    `// If needed for advanced/custom use cases, they can be re-exported explicitly by consumers.\n\n` +
    `// Semantic schemas & runtime\n` +
    `export * from './semantic';\n` +
    `export * from '../runtime/config';\n` +
    `export * from '../runtime/validation';\n` +
    `// Auto generated wrappers (validated responses)\n` +
    `export * from './wrappers/autoWrappers.js';\n` +
    `// Flat convenience exports (flat, operation-centric)\n` +
    `export * from './wrappers/flatExports.js';\n`;
  fs.writeFileSync(INDEX_FILE, indexContent, 'utf8');
  console.log('[postprocess] Generated gen/public-index.ts exports.');
} catch (e) {
  console.warn('[postprocess] Failed generating index.ts', e);
}

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
  lines.push(`  // assumeExists: lift a raw string (already issued / observed from the cluster) into a branded key; validates basic shape only.`);
  lines.push(`  export function assumeExists(value: string): ${name} { return __validateKey(value, __C_${name}) as ${name}; }`);
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

// Invoke modular spec-driven wrapper generation (TypeScript version)
await import('./wrapOperations');
