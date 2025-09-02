import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

interface OA3Parameter { in?: string; name?: string }
interface OA3Schema { oneOf?: any[]; anyOf?: any[]; $ref?: string }
interface OA3MediaType { schema?: OA3Schema }
interface OA3RequestBody { content?: Record<string, OA3MediaType> }
interface OA3Operation { operationId?: string; parameters?: OA3Parameter[]; requestBody?: OA3RequestBody; summary?: string; description?: string; tags?: string[]; ['x-eventually-consistent']?: boolean }
interface OA3PathItem { [method: string]: OA3Operation | any }
interface OA3Spec { paths?: Record<string, OA3PathItem> }

const ROOT = process.cwd();
const SPEC_PATH = path.resolve(ROOT, '../../rest-api.domain.yaml');
const TEMPLATE_FILE = path.join(ROOT, 'src/CamundaClient.template.ts');
const CLASS_FILE = path.join(ROOT, 'src/CamundaClient.ts');
const SDK_GEN_PATH = path.join(ROOT, 'src/gen/sdk.gen.ts');

const MARK_TYPES_START = '// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===';
const MARK_TYPES_END = '// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===';
const MARK_METHODS_START = '// === AUTO-GENERATED CAMUNDA METHODS START ===';
const MARK_METHODS_END = '// === AUTO-GENERATED CAMUNDA METHODS END ===';

function main() {
  if (!fs.existsSync(SPEC_PATH)) { throw new Error('[class-gen] Spec missing, skipping'); }
  if (!fs.existsSync(TEMPLATE_FILE)) { throw new Error('[class-gen] Template missing, skipping'); }
  const spec: OA3Spec = parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  const tpl = fs.readFileSync(TEMPLATE_FILE,'utf8');
  const tS = tpl.indexOf(MARK_TYPES_START), tE = tpl.indexOf(MARK_TYPES_END), mS = tpl.indexOf(MARK_METHODS_START), mE = tpl.indexOf(MARK_METHODS_END);
  if ([tS,tE,mS,mE].some(i=>i===-1) || tE < tS || mE < mS) { throw new Error('[class-gen] Markers missing'); }

  // Underlying docs
  const docs: Record<string,string> = {};
  if (fs.existsSync(SDK_GEN_PATH)) {
  const sdk = fs.readFileSync(SDK_GEN_PATH,'utf8');
  // Only capture operation JSDoc blocks immediately preceding an exported const function (avoid capturing other unrelated blocks)
  const re = /\n\/\*\*([\s\S]*?)\*\/\nexport const (\w+)\s*=\s*</g; let m; while((m=re.exec(sdk))) docs[m[2]]='/**'+m[1]+'*/';
  }

  interface OpMeta { opId: string; hasBody: boolean; bodyOnly: boolean; summary?: string; description?: string; tags?: string[]; originalOpId: string; unionBodies: string[]; eventual: boolean; verb: string; pathParams: string[] }
  const ops: OpMeta[] = [];
  for (const item of Object.values(spec.paths||{})) {
    for (const [verb, raw] of Object.entries(item as any)) {
      const op = raw as OA3Operation; if (!op?.operationId) continue;
      const originalId = op.operationId; const opId = sanitize(op.operationId);
  const params = (op.parameters||[]) as OA3Parameter[];
  const pathParams = params.filter(p=>p.in==='path' && !!p.name).map(p=>p.name!) as string[];
  const hasPQ = params.some(p=> p.in==='path' || p.in==='query');
      const hasBody = !!op.requestBody && hasJsonLike(op.requestBody);
      const bodyOnly = !!(hasBody && !hasPQ);
      const eventual = !!(op as any)['x-eventually-consistent'];
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
  ops.push({ opId, hasBody, bodyOnly, summary: op.summary, description: op.description, tags: op.tags, originalOpId: originalId, unionBodies: Array.from(new Set(unionBodies)), eventual, verb: verb.toLowerCase(), pathParams });
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
  if (!o.hasBody && o.pathParams.length === 1) {
    const pp = o.pathParams[0];
    support.push(`type ${o.opId}PathParam = (NonNullable<${o.opId}Options> extends { path: { ${pp}: infer P } } ? P : any);`);
  }
  // Consistency types must reference the local runtime folder (same directory as this output file)
  if (o.eventual) support.push(`/** Management of eventual consistency **/
type ${o.opId}Consistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.${o.opId}>> 
};`);
  }

  const methods: string[] = [];
  methods.push('  // Generated methods ('+ new Date().toISOString() +')');
  for (const o of ops) {
      let jsdoc = forwardJsDoc(o, docs);
      if (jsdoc && o.eventual) {
        jsdoc = jsdoc.replace(/\n \* @tags[^\n]*\n/, (m)=> m + ' * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.\n');
        if(!/@consistency eventual/.test(jsdoc)) {
          jsdoc = jsdoc.replace(/\*\/$/, ' * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.\n */');
        }
      }
      if (jsdoc) methods.push(indent(jsdoc,2));

  if (o.hasBody) {
      if (o.unionBodies.length > 1) {
        for (const variant of o.unionBodies) {
  methods.push(o.eventual ? `  ${o.opId}(body: ${variant}, /** Management of eventual consistency **/ consistencyManagement: ${o.opId}Consistency): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;` : `  ${o.opId}(body: ${variant}): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
        }
      } else {
  methods.push(o.eventual ? `  ${o.opId}(body: ${o.opId}Body, /** Management of eventual consistency **/ consistencyManagement: ${o.opId}Consistency): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;` : `  ${o.opId}(body: ${o.opId}Body): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
      }
      // Always provide options-shape overload
  methods.push(o.eventual ? `  ${o.opId}(options: ${o.opId}Options, /** Management of eventual consistency **/ consistencyManagement: ${o.opId}Consistency): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;` : `  ${o.opId}(options: ${o.opId}Options): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
    } else {
      // options overload
      methods.push(o.eventual ? `  ${o.opId}(options: ${o.opId}Options | undefined, /** Management of eventual consistency **/ consistencyManagement: ${o.opId}Consistency): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;` : `  ${o.opId}(options?: ${o.opId}Options): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
      // raw single path param overload
      if (o.pathParams.length === 1) {
        const pp = o.pathParams[0];
        methods.push(o.eventual ? `  ${o.opId}(${pp}: ${o.opId}PathParam, /** Management of eventual consistency **/ consistencyManagement: ${o.opId}Consistency): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;` : `  ${o.opId}(${pp}: ${o.opId}PathParam): CancelablePromise<_DataOf<typeof Sdk.${o.opId}>>;`);
      }
    }

  methods.push(`  ${o.opId}(arg: any${o.eventual ? ', /** Management of eventual consistency **/ consistencyManagement: '+o.opId+'Consistency' : ''}): CancelablePromise<any> {`);
    if (o.eventual) {
      methods.push('    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");');
      methods.push('    const useConsistency = consistencyManagement.consistency;');
    }
  // (generator) removed stray lines from earlier patch attempt
    methods.push('    return toCancelable(signal => {');
      if (o.hasBody) {
        // Options/object form (body inside object or other params)
        methods.push("      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {");
        methods.push(`        const call = async () => {`);
        methods.push(`          const opts: any = { ...arg, client: this._client, signal };`);
  methods.push(`          if (opts.body !== undefined && this._validation.settings.req !== 'none') {`);
  methods.push(`            const maybe = await this._validation.gateRequest('${o.originalOpId}', (Schemas as any).z${o.opId.charAt(0).toUpperCase()+o.opId.slice(1)}Data, opts.body);`);
  methods.push(`            if (this._validation.settings.req === 'strict') opts.body = maybe;`);
        methods.push(`          }`);
  methods.push(`          const r = await Sdk.${o.opId}(opts);`);
  methods.push(`          let data = (r as any)?.data;`);
  methods.push(`          if (data === undefined) data = r;`);
  methods.push(`          if (this._validation.settings.res !== 'none') {`);
  methods.push(`            const _respKey = 'z${o.opId.charAt(0).toUpperCase()+o.opId.slice(1)}Response';`);
  methods.push(`            const _schema = (Schemas as any)[_respKey];`);
  methods.push(`            if (_schema) {`);
  methods.push(`              const maybeR = await this._validation.gateResponse('${o.originalOpId}', _schema, data);`);
  methods.push(`              if (this._validation.settings.res === 'strict') data = maybeR;`);
  methods.push(`            }`);
  methods.push(`          }`);
        methods.push(`          return data;`);
        methods.push(`        };`);
        if (o.eventual) {
          methods.push(`        const invoke = () => toCancelable(()=>call());`);
          methods.push(`        if (useConsistency) return eventualPoll('${o.originalOpId}', ${o.verb === 'get'}, invoke, { ...useConsistency, logger: (this as any)._log });`);
          methods.push('        return invoke();');
        } else {
          methods.push('        return call();');
        }
        methods.push('      }');
        // Bare body form
        methods.push(`      const call = async () => {`);
        methods.push(`        let bodyVal: any = arg;`);
  methods.push(`        if (bodyVal !== undefined && this._validation.settings.req !== 'none') {`);
  methods.push(`          const maybe = await this._validation.gateRequest('${o.originalOpId}', (Schemas as any).z${o.opId.charAt(0).toUpperCase()+o.opId.slice(1)}Data, bodyVal);`);
  methods.push(`          if (this._validation.settings.req === 'strict') bodyVal = maybe;`);
        methods.push(`        }`);
  methods.push(`        const r = await Sdk.${o.opId}({ body: bodyVal, client: this._client, signal } as any);`);
  methods.push(`        let data = (r as any)?.data;`);
  methods.push(`        if (data === undefined) data = r;`);
  methods.push(`        if (this._validation.settings.res !== 'none') {`);
  methods.push(`          const _respKey = 'z${o.opId.charAt(0).toUpperCase()+o.opId.slice(1)}Response';`);
  methods.push(`          const _schema = (Schemas as any)[_respKey];`);
  methods.push(`          if (_schema) {`);
  methods.push(`            const maybeR = await this._validation.gateResponse('${o.originalOpId}', _schema, data);`);
  methods.push(`            if (this._validation.settings.res === 'strict') data = maybeR;`);
  methods.push(`          }`);
  methods.push(`        }`);
        methods.push(`        return data;`);
        methods.push(`      };`);
        if (o.eventual) {
          methods.push(`      const invoke = () => toCancelable(()=>call());`);
          methods.push(`      if (useConsistency) return eventualPoll('${o.originalOpId}', ${o.verb === 'get'}, invoke, { ...useConsistency, logger: (this as any)._log });`);
          methods.push('      return invoke();');
        } else {
          methods.push('      return call();');
        }
      } else {
        // no body endpoint
        if (o.pathParams.length === 1) {
          const pp = o.pathParams[0];
          methods.push(`      let opts: any;`);
          methods.push(`      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { ${pp}: arg } };`);
        } else {
          methods.push('      const opts = arg || {};');
        }
        methods.push(`      const call = async () => {`);
        methods.push(`        const full = { ...opts, client: this._client, signal } as any;`);
  methods.push(`        const r = await Sdk.${o.opId}(full);`);
  methods.push(`        let data = (r as any)?.data;`);
  methods.push(`        if (data === undefined) data = r;`);
  methods.push(`        if (this._validation.settings.res !== 'none') {`);
  methods.push(`          const _respKey = 'z${o.opId.charAt(0).toUpperCase()+o.opId.slice(1)}Response';`);
  methods.push(`          const _schema = (Schemas as any)[_respKey];`);
  methods.push(`          if (_schema) {`);
  methods.push(`            const maybeR = await this._validation.gateResponse('${o.originalOpId}', _schema, data);`);
  methods.push(`            if (this._validation.settings.res === 'strict') data = maybeR;`);
  methods.push(`          }`);
  methods.push(`        }`);
        methods.push(`        return data;`);
        methods.push(`      };`);
        if (o.eventual) {
          methods.push(`      const invoke = () => toCancelable(()=>call());`);
          methods.push(`      if (useConsistency) return eventualPoll('${o.originalOpId}', ${o.verb === 'get'}, invoke, { ...useConsistency, logger: (this as any)._log });`);
          methods.push('      return invoke();');
        } else {
          methods.push('      return call();');
        }
      }
    methods.push('    });');
    methods.push('  }');
    methods.push('');
  }

  const banner = '// @generated from CamundaClient.template.ts – DO NOT EDIT DIRECTLY\n';
  const withTypes = tpl.slice(0, tS + MARK_TYPES_START.length) + '\n' + support.join('\n') + '\n' + tpl.slice(tE);
  const w2S = withTypes.indexOf(MARK_METHODS_START); const w2E = withTypes.indexOf(MARK_METHODS_END);
  const finalSrc = banner + withTypes.slice(0, w2S + MARK_METHODS_START.length) + '\n' + methods.join('\n') + '\n' + withTypes.slice(w2E);
  fs.writeFileSync(CLASS_FILE, finalSrc, 'utf8');
  console.log(`[class-gen] Wrote Camunda.ts with ${ops.length} methods`);
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
