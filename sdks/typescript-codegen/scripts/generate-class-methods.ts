import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

interface OA3Parameter { in?: string; name?: string }
interface OA3Schema { oneOf?: any[]; anyOf?: any[]; $ref?: string }
interface OA3MediaType { schema?: OA3Schema }
interface OA3RequestBody { content?: Record<string, OA3MediaType> }
interface OA3Operation { operationId?: string; parameters?: OA3Parameter[]; requestBody?: OA3RequestBody; summary?: string; description?: string; tags?: string[] }
interface OA3PathItem { [method: string]: OA3Operation | any }
interface OA3Spec { paths?: Record<string, OA3PathItem> }

const ROOT = process.cwd();
const SPEC_PATH = path.resolve(ROOT, '../../rest-api.domain.yaml');
const TEMPLATE_FILE = path.join(ROOT, 'src/Camunda8.template.ts');
const CLASS_FILE = path.join(ROOT, 'src/Camunda8.ts');
const SDK_GEN_PATH = path.join(ROOT, 'src/gen/sdk.gen.ts');

const MARK_TYPES_START = '// === AUTO-GENERATED CAMUNDA8 SUPPORT TYPES START ===';
const MARK_TYPES_END = '// === AUTO-GENERATED CAMUNDA8 SUPPORT TYPES END ===';
const MARK_METHODS_START = '// === AUTO-GENERATED CAMUNDA8 METHODS START ===';
const MARK_METHODS_END = '// === AUTO-GENERATED CAMUNDA8 METHODS END ===';

function main() {
  if (!fs.existsSync(SPEC_PATH)) { console.warn('[class-gen] Spec missing, skipping'); return; }
  if (!fs.existsSync(TEMPLATE_FILE)) { console.warn('[class-gen] Template missing, skipping'); return; }
  const spec: OA3Spec = parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  const tpl = fs.readFileSync(TEMPLATE_FILE,'utf8');
  const tS = tpl.indexOf(MARK_TYPES_START), tE = tpl.indexOf(MARK_TYPES_END), mS = tpl.indexOf(MARK_METHODS_START), mE = tpl.indexOf(MARK_METHODS_END);
  if ([tS,tE,mS,mE].some(i=>i===-1) || tE < tS || mE < mS) { console.error('[class-gen] Markers missing'); return; }

  // Underlying docs
  const docs: Record<string,string> = {};
  if (fs.existsSync(SDK_GEN_PATH)) {
  const sdk = fs.readFileSync(SDK_GEN_PATH,'utf8');
  // Only capture operation JSDoc blocks immediately preceding an exported const function (avoid capturing other unrelated blocks)
  const re = /\n\/\*\*([\s\S]*?)\*\/\nexport const (\w+)\s*=\s*</g; let m; while((m=re.exec(sdk))) docs[m[2]]='/**'+m[1]+'*/';
  }

  interface OpMeta { opId: string; hasBody: boolean; bodyOnly: boolean; summary?: string; description?: string; tags?: string[]; originalOpId: string; unionBodies: string[] }
  const ops: OpMeta[] = [];
  for (const item of Object.values(spec.paths||{})) {
    for (const raw of Object.values(item as any)) {
      const op = raw as OA3Operation; if (!op?.operationId) continue;
      const originalId = op.operationId; const opId = sanitize(op.operationId);
      const params = (op.parameters||[]) as OA3Parameter[];
      const hasPQ = params.some(p=> p.in==='path' || p.in==='query');
      const hasBody = !!op.requestBody && hasJsonLike(op.requestBody);
      const bodyOnly = !!(hasBody && !hasPQ);
      // Detect union body variants (top-level oneOf/anyOf) when bodyOnly
      const unionBodies: string[] = [];
      if (bodyOnly && op.requestBody?.content) {
        for (const mt of Object.values(op.requestBody.content)) {
          const schema = mt?.schema as OA3Schema | undefined;
          const variants = schema?.oneOf || schema?.anyOf;
          if (Array.isArray(variants) && variants.length > 1) {
            for (const v of variants) {
              if (v && typeof v === 'object' && '$ref' in v && typeof v.$ref === 'string') {
                const ref = v.$ref as string;
                const name = ref.split('/').pop();
                if (name) unionBodies.push(name.replace(/XML/g,'Xml'));
              }
            }
          }
        }
      }
  ops.push({ opId, hasBody, bodyOnly, summary: op.summary, description: op.description, tags: op.tags, originalOpId: originalId, unionBodies: Array.from(new Set(unionBodies)) });
    }
  }
  ops.sort((a,b)=> a.opId.localeCompare(b.opId));

  const support: string[] = [];
  support.push('// Generated '+ new Date().toISOString());
  support.push('// Operations: '+ ops.length);
  support.push('type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;');
  support.push('type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;');
  for (const o of ops) {
  support.push(`type ${o.opId}Options = Parameters<typeof Sdk.${o.opId}>[0];`);
  if (o.hasBody) support.push(`type ${o.opId}Body = (NonNullable<${o.opId}Options> extends { body?: infer B } ? B : never);`);
  }

  const methods: string[] = [];
  methods.push('  // Generated methods ('+ new Date().toISOString() +')');
  for (const o of ops) {
    const jsdoc = forwardJsDoc(o, docs); if (jsdoc) methods.push(indent(jsdoc,2));

  if (o.hasBody) {
      if (o.unionBodies.length > 1) {
        for (const variant of o.unionBodies) {
          methods.push(`  ${o.opId}(body: ${variant}): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
        }
      } else {
        methods.push(`  ${o.opId}(body: ${o.opId}Body): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
      }
      // Always provide options-shape overload
      methods.push(`  ${o.opId}(options: ${o.opId}Options): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
    } else {
      methods.push(`  ${o.opId}(options?: ${o.opId}Options): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
    }

    methods.push(`  ${o.opId}(arg: any): CancelablePromise<any> {`);
    methods.push('    return toCancelable(signal => {');
  if (o.hasBody) {
      methods.push("      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {");
      methods.push(`        return Sdk.${o.opId}({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);`);
      methods.push('      }');
      methods.push(`      return Sdk.${o.opId}({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);`);
    } else {
      methods.push('      const opts = arg || {};');
      methods.push(`      return Sdk.${o.opId}({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);`);
    }
    methods.push('    });');
    methods.push('  }');
    methods.push('');
  }

  const banner = '// @generated from Camunda8.template.ts – DO NOT EDIT DIRECTLY\n';
  const withTypes = tpl.slice(0, tS + MARK_TYPES_START.length) + '\n' + support.join('\n') + '\n' + tpl.slice(tE);
  const w2S = withTypes.indexOf(MARK_METHODS_START); const w2E = withTypes.indexOf(MARK_METHODS_END);
  const finalSrc = banner + withTypes.slice(0, w2S + MARK_METHODS_START.length) + '\n' + methods.join('\n') + '\n' + withTypes.slice(w2E);
  fs.writeFileSync(CLASS_FILE, finalSrc, 'utf8');
  console.log(`[class-gen] Wrote Camunda8.ts with ${ops.length} methods`);
}

function hasJsonLike(rb: OA3RequestBody): boolean { return !!rb?.content && Object.keys(rb.content).some(k => /json|octet|multipart|text\//i.test(k)); }
function sanitize(id: string): string { return id.replace(/XML/g,'Xml'); }
function forwardJsDoc(op: any, docs: Record<string,string>): string {
  const base = docs[op.opId];
  if (base) {
    const inj: string[] = []; inj.push(' *'); inj.push(` * @operationId ${op.originalOpId}`); if (op.tags?.length) inj.push(` * @tags ${op.tags.join(', ')}`); return base.replace(/\*\/$/, inj.join('\n') + '\n */');
  }
  return buildJsDoc(op);
}
function buildJsDoc(op: { summary?: string; description?: string; originalOpId: string; tags?: string[] }) {
  const parts: string[] = []; if (op.summary) parts.push(op.summary); if (op.description) parts.push(...String(op.description).split(/\r?\n/)); parts.push(`@operationId ${op.originalOpId}`); if (op.tags?.length) parts.push(`@tags ${op.tags.join(', ')}`); return '/**\n' + parts.map(l=>' * '+ l.replace(/\*/g,'')).join('\n') + '\n */';
}
function indent(s: string, d: number) { const pad=' '.repeat(d); return s.split('\n').map(l=> pad+l).join('\n'); }

main();
