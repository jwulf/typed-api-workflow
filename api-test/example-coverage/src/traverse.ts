import { FieldRecord } from './types.js';
import { OpenAPI } from 'openapi-types';

interface TraverseCtx {
  records: FieldRecord[];
  visited: WeakSet<object>;
  refOrigins: WeakMap<object, string>; // map dereferenced schema object -> original $ref pointer
}

export function collectFromDoc(doc: any): FieldRecord[] {
  const ctx: TraverseCtx = { records: [], visited: new WeakSet(), refOrigins: new WeakMap() };
  if (doc.paths) {
    for (const [p, item] of Object.entries<any>(doc.paths)) {
      for (const method of Object.keys(item)) {
        const op = item[method];
        if (!op || typeof op !== 'object') continue;
        const opPrefix = `operation.${op.operationId || method}.${p}`;
        // parameters
        if (Array.isArray(op.parameters)) {
          for (const param of op.parameters) {
            const schema = (param as any).schema;
            if (schema) traverse(schema, `${opPrefix}.parameter.${param.name}`, 'parameter', ctx);
          }
        }
        // requestBody
        const rb = op.requestBody;
        if (rb && rb.content) {
          for (const media of Object.values<any>(rb.content)) {
            if (media.schema) traverse(media.schema, `${opPrefix}.request`, 'request', ctx);
          }
        }
        // responses
        if (op.responses) {
          for (const [code, resp] of Object.entries<any>(op.responses)) {
            const content = resp && resp.content;
            if (content) {
              for (const media of Object.values<any>(content)) {
                if (media.schema) traverse(media.schema, `${opPrefix}.response.${code}`, 'response', ctx);
              }
            }
          }
        }
      }
    }
  }
  // components.schemas (optional)
  if (doc.components && doc.components.schemas) {
    for (const [name, schema] of Object.entries<any>(doc.components.schemas)) {
      traverse(schema, `component.${name}`, 'component', ctx);
    }
  }
  return ctx.records;
}

function traverse(
  schema: any,
  path: string,
  origin: FieldRecord['origin'],
  ctx: TraverseCtx,
  incomingRef?: string,
  ancestorHasExample: boolean = false,
  ancestorExampleRef?: string
) {
  if (!schema || typeof schema !== 'object') return;
  if (ctx.visited.has(schema)) return; // avoid cycles after deref
  ctx.visited.add(schema);

  // If this node came from a $ref, remember its pointer for all nested children unless they themselves specify a $ref.
  if (incomingRef && !ctx.refOrigins.has(schema)) {
    ctx.refOrigins.set(schema, incomingRef);
  }

  // Detect if this schema is (or was) a $ref. After dereferencing, tools usually replace the object; we can still pick up a preserved $ref key if present.
  const selfRef: string | undefined = (schema.$ref && typeof schema.$ref === 'string') ? schema.$ref : undefined;
  const activeRef = selfRef || incomingRef;
  if (selfRef) {
    ctx.refOrigins.set(schema, selfRef);
  }

  const hasExample = 'example' in schema || ('examples' in schema && schema.examples && Object.keys(schema.examples).length > 0);
  const currentExampleRef = hasExample ? (selfRef || incomingRef || path) : undefined;
  const nextAncestorHasExample = ancestorHasExample || hasExample;
  const nextAncestorExampleRef = currentExampleRef || ancestorExampleRef;

  if (schema.allOf) {
  for (const sub of schema.allOf) traverse(sub, path, origin, ctx, activeRef, nextAncestorHasExample, nextAncestorExampleRef);
  }
  if (schema.oneOf) {
  schema.oneOf.forEach((sub: any, i: number) => traverse(sub, `${path}.oneOf[${i}]`, origin, ctx, activeRef, nextAncestorHasExample, nextAncestorExampleRef));
  }
  if (schema.anyOf) {
  schema.anyOf.forEach((sub: any, i: number) => traverse(sub, `${path}.anyOf[${i}]`, origin, ctx, activeRef, nextAncestorHasExample, nextAncestorExampleRef));
  }

  if (schema.type === 'object' || schema.properties) {
    if (schema.properties) {
      for (const [k, v] of Object.entries<any>(schema.properties)) {
        traverse(v, `${path}.${k}`, origin, ctx, activeRef, nextAncestorHasExample, nextAncestorExampleRef);
      }
    }
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      traverse(schema.additionalProperties, `${path}.{additional}`, origin, ctx, activeRef, nextAncestorHasExample, nextAncestorExampleRef);
    }
  } else if (schema.type === 'array' && schema.items) {
    traverse(schema.items, `${path}[]`, origin, ctx, activeRef, nextAncestorHasExample, nextAncestorExampleRef);
  } else {
    // leaf
    const refPtrForLeaf = activeRef;
    const inheritedExample = !hasExample && nextAncestorHasExample;
    const exampleSourceRef = inheritedExample ? (nextAncestorExampleRef || refPtrForLeaf) : undefined;
    ctx.records.push({
      path,
      origin,
      schemaType: schema.type,
      format: schema.format,
      hasExample, // direct only
      inheritedExample,
      exampleSourceRef,
      refPointer: refPtrForLeaf,
  enum: Array.isArray(schema.enum) ? schema.enum.map(String) : undefined,
  coverageSources: hasExample ? ['direct'] : (inheritedExample ? ['inherited'] : []),
    });
  }
}
