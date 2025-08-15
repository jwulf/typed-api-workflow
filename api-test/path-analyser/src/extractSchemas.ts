import { promises as fs } from 'fs';
import path from 'path';
import YAML from 'yaml';
import { ResponseShapeSummary, RequestOneOfGroupSummary, RequestOneOfVariant, ExtractedRequestVariantsIndex } from './types.js';

interface OpenAPISchemaObject { [key: string]: any; }

export async function extractResponseAndRequestVariants(baseDir: string, semanticTypes: string[]) {
  // baseDir points to api-test/path-analyser; spec lives at repo root
  const specPath = path.resolve(baseDir, '../../', 'rest-api.domain.yaml');
  const raw = await fs.readFile(specPath, 'utf8');
  const doc = YAML.parse(raw) as OpenAPISchemaObject;
  const responses: ResponseShapeSummary[] = [];
  const requestGroups: RequestOneOfGroupSummary[] = [];

  const paths = doc.paths || doc; // fallback if structure different
  for (const [p, methods] of Object.entries<any>(paths)) {
    for (const [method, op] of Object.entries<any>(methods || {})) {
      if (!op || !op.operationId) continue;
      const operationId = op.operationId;
      // Response extraction: take first 200 json schema if present
  const successCode = Object.keys(op.responses||{}).find(c => ['200','201','204'].includes(c));
  const success = successCode ? op.responses[successCode] : undefined;
      const ctSchemas: any[] = [];
      if (success?.content) {
        for (const [ct, media] of Object.entries<any>(success.content)) {
          if (/json/.test(ct) && media.schema) ctSchemas.push({ ct, schema: media.schema });
        }
      }
      if (ctSchemas.length) {
        const fields = flattenTopLevelFields(ctSchemas[0].schema, doc.components?.schemas || {});
        // Map to semantic types if field (PascalCase) matches
        const producedSet = new Set<string>();
        for (const f of fields) {
          const pascal = toPascalCase(f.name);
            if (semanticTypes.includes(pascal)) {
              (f as any).semantic = pascal;
              producedSet.add(pascal);
            }
        }
  responses.push({ operationId, contentTypes: ctSchemas.map(c=>c.ct), fields, producedSemantics: [...producedSet], successStatus: successCode ? Number(successCode) : undefined });
      }

      // Request oneOf extraction
      const reqSchema = op.requestBody?.content?.['application/json']?.schema;
      if (reqSchema) {
  findOneOfGroups(operationId, reqSchema, doc.components?.schemas || {}, requestGroups);
      }
    }
  }

  const requestIndex: ExtractedRequestVariantsIndex = { byOperation: {} };
  for (const g of requestGroups) {
    (requestIndex.byOperation[g.operationId] ||= []).push(g);
  }
  return { responses, requestIndex };
}

function flattenTopLevelFields(schemaRef: any, components: Record<string, any>) {
  const resolved = resolveSchema(schemaRef, components);
  const out: { name: string; type: string; required?: boolean; objectRef?: string }[] = [];
  if (resolved?.type === 'object' && resolved.properties) {
    const req = new Set(resolved.required || []);
    for (const [fname, fsch] of Object.entries<any>(resolved.properties)) {
      const r = resolveSchema(fsch, components);
      let type = r.type || (r.oneOf ? 'union' : 'unknown');
      if (r.$ref) type = 'object';
      if (type === 'array' && r.items) {
        const it = resolveSchema(r.items, components);
        out.push({ name: fname, type: 'array', required: req.has(fname), objectRef: it.$ref ? refName(it.$ref) : undefined });
      } else {
        out.push({ name: fname, type, required: req.has(fname), objectRef: r.$ref ? refName(r.$ref) : undefined });
      }
    }
  }
  return out;
}

function findOneOfGroups(operationId: string, root: any, components: Record<string, any>, acc: RequestOneOfGroupSummary[], path: string[] = [], depth = 0) {
  const resolved = resolveSchema(root, components);
  // Top-level oneOf
  if (resolved.oneOf && Array.isArray(resolved.oneOf)) {
    const variants: RequestOneOfVariant[] = resolved.oneOf.map((v: any, idx: number) => {
      const vs = resolveSchema(v, components);
      const props = vs.properties || {};
      const required = vs.required || [];
      const optional = Object.keys(props).filter(k => !required.includes(k));
      let discriminator;
      if (resolved.discriminator && resolved.discriminator.propertyName) {
        const discField = resolved.discriminator.propertyName;
        const mapping = resolved.discriminator.mapping || {};
  const entry = Object.entries(mapping).find(([, ref]) => typeof ref === 'string' && ref.endsWith(refName(vs.$ref || v.$ref || '')));
        if (entry) discriminator = { field: discField, value: entry[0] };
      }
      const groupId = path.length ? path.join('.') : 'group0';
      return { groupId, variantName: vs.title || `variant${idx+1}`, required, optional, discriminator };
    });
    const groupId = path.length ? path.join('.') : 'group0';
    acc.push({ operationId, groupId, variants, unionFields: [...new Set(variants.flatMap(v => [...v.required, ...v.optional]))] });
  }
  // Nested: scan properties one level deep for oneOf (shallow)
  if (depth < 3 && resolved.type === 'object' && resolved.properties) {
    for (const [fname, fsch] of Object.entries<any>(resolved.properties)) {
      const rs = resolveSchema(fsch, components);
      findOneOfGroups(operationId, rs, components, acc, [...path, fname], depth + 1);
    }
  }
}

function resolveSchema(schema: any, components: Record<string, any>, depth = 0): any {
  if (!schema || depth > 10) return schema;
  if (schema.$ref) {
    const name = refName(schema.$ref);
    const target = components[name];
    if (target) return resolveSchema(target, components, depth+1);
  }
  return schema;
}

function refName(ref: string): string { return ref.split('/').pop() || ref; }

export async function writeExtractionOutputs(baseDir: string, semanticTypes: string[]) {
  const { responses, requestIndex } = await extractResponseAndRequestVariants(baseDir, semanticTypes);
  const outDir = path.resolve(baseDir, 'dist', 'extraction');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, 'response-shapes.json'), JSON.stringify(responses, null, 2), 'utf8');
  await fs.writeFile(path.join(outDir, 'request-variants.json'), JSON.stringify(requestIndex, null, 2), 'utf8');
  return { responses, requestIndex };
}

function toPascalCase(name: string): string { return name ? name[0].toUpperCase() + name.slice(1) : name; }
