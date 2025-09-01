/**
 * Facade generator: produces ergonomic CancelablePromise wrappers that
 * (a) flatten body-only operations to accept the raw body directly
 * (b) strip the transport { data } envelope so callers get the payload
 *
 * Heuristic for body-only operation flattening:
 *  - Has a requestBody
 *  - No path parameters (no parameters with in: 'path')
 *  - No query parameters (no parameters with in: 'query')
 *
 * The underlying generated functions live in src/gen/sdk.gen.ts and return a Promise
 * resolving to either { data: T, ... } or T (future-friendly). We unwrap to T and wrap
 * in a lightweight CancelablePromise providing cancel() (AbortController-based).
 */
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

interface OA3Parameter { in?: string; name?: string }
interface OA3RequestBody { content?: Record<string, any> }
interface OA3Operation { operationId?: string; parameters?: OA3Parameter[]; requestBody?: OA3RequestBody; summary?: string; description?: string }
interface OA3PathItem { [method: string]: OA3Operation | any }
interface OA3Spec { paths?: Record<string, OA3PathItem> }

const ROOT = process.cwd();
const SPEC_PATH = path.resolve(ROOT, '../../rest-api.domain.yaml');
const OUT_DIR = path.join(ROOT, 'src/facade');
const OUT_FILE = path.join(OUT_DIR, 'operations.gen.ts');

function main() {
  if (!fs.existsSync(SPEC_PATH)) { console.warn('[facade-gen] Spec missing, skipping'); return; }
  const spec: OA3Spec = parse(fs.readFileSync(SPEC_PATH, 'utf8'));
  interface OpMeta { opId: string; summary?: string; description?: string; hasBody: boolean; bodyOnly: boolean }
  const allOps: OpMeta[] = [];
  const bodyOnlyOps: OpMeta[] = [];

  for (const [p, item] of Object.entries(spec.paths || {})) {
    for (const [verb, rawOp] of Object.entries(item)) {
      const op = rawOp as OA3Operation;
      if (!op?.operationId) continue;
      const params = (op.parameters || []) as OA3Parameter[];
      const hasPathOrQuery = params.some(pr => pr.in === 'path' || pr.in === 'query');
      const hasBody = !!op.requestBody && hasJsonLike(op.requestBody);
      const meta: OpMeta = { opId: op.operationId, summary: op.summary, description: op.description, hasBody, bodyOnly: !!(hasBody && !hasPathOrQuery) };
      allOps.push(meta);
      if (meta.bodyOnly) bodyOnlyOps.push(meta);
    }
  }

  allOps.sort((a,b)=> a.opId.localeCompare(b.opId));
  bodyOnlyOps.sort((a,b)=> a.opId.localeCompare(b.opId));
  const passthroughOps = allOps.filter(o => !o.bodyOnly);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const lines: string[] = [];
  lines.push('// @generated ergonomic operation wrappers');
  lines.push('// DO NOT EDIT MANUALLY – run npm run generate');
  // Import every underlying operation (body-only + passthrough)
  const importOps = allOps.map(o => o.opId);
  lines.push("import { /* underlying */ " + importOps.map(o=> `${o} as _${o}`).join(', ') + " } from '../gen/sdk.gen';");
  lines.push('');
  lines.push('// Lightweight CancelablePromise implementation (local to facade)');
  lines.push('export class CancelError extends Error { constructor(){ super("Cancelled"); this.name = "CancelError"; } }');
  lines.push('export interface CancelablePromise<T> extends Promise<T> { cancel(): void }');
  lines.push('export function toCancelable<T>(factory:(signal:AbortSignal)=>Promise<T>): CancelablePromise<T> {');
  lines.push('  const ac = new AbortController();');
  lines.push('  let inner = factory(ac.signal);');
  lines.push('  const wrapped: any = new Promise<T>((resolve, reject) => {');
  lines.push('    inner.then(resolve, reject);');
  lines.push('  });');
  lines.push('  wrapped.cancel = () => { ac.abort(); };');
  lines.push('  return wrapped as CancelablePromise<T>;');
  lines.push('}');
  lines.push('');
  lines.push('// Helper conditional types to derive the success payload of the underlying call');
  lines.push('type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;');
  lines.push('// Exclude undefined so success payload types are always concrete (errors throw)');
  lines.push('type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;');
  lines.push('');

  for (const op of bodyOnlyOps) {
    const jsdoc = buildJsDoc(op);
    lines.push(jsdoc);
    // Overloads
    lines.push(`export function ${op.opId}(body: any): CancelablePromise<_DataOf<typeof _${op.opId}>>;`);
    lines.push(`export function ${op.opId}(options: Parameters<typeof _${op.opId}>[0]): CancelablePromise<_DataOf<typeof _${op.opId}>>;`);
    lines.push(`export function ${op.opId}(arg: any): CancelablePromise<_DataOf<typeof _${op.opId}>> {`);
    lines.push(`  return toCancelable(signal => {`);
    lines.push(`    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {`);
    lines.push(`      return _${op.opId}( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);`);
    lines.push('    }');
    lines.push(`    return _${op.opId}({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);`);
    lines.push('  });');
    lines.push('}');
    lines.push('');
  }

  // Passthrough wrappers for all remaining operations so users get a uniform surface
  for (const op of passthroughOps) {
    const jsdoc = buildJsDoc(op, true);
    lines.push(jsdoc);
    lines.push(`export function ${op.opId}(options?: Parameters<typeof _${op.opId}>[0]): CancelablePromise<_DataOf<typeof _${op.opId}>> {`);
    lines.push(`  return toCancelable(signal => _${op.opId}({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));`);
    lines.push('}');
    lines.push('');
  }

  if (!allOps.length) {
    lines.push('export {} // no operations found');
  }

  fs.writeFileSync(OUT_FILE, lines.join('\n'), 'utf8');
  console.log(`[facade-gen] Wrote ${bodyOnlyOps.length} flattened + ${passthroughOps.length} passthrough wrappers (total ${allOps.length}) -> ${path.relative(ROOT, OUT_FILE)}`);

  // Legacy shims for tests expecting previous file layout
  const semanticDir = path.join(ROOT, 'src/gen/semantic');
  fs.mkdirSync(semanticDir, { recursive: true });
  const semanticFile = path.join(semanticDir, 'camundaKeys.ts');
  if (!fs.existsSync(semanticFile)) {
    fs.writeFileSync(semanticFile, [
      '// @generated shim – legacy semantic camundaKeys re-export',
      "export * from '../types.gen';"
    ].join('\n'), 'utf8');
    console.log('[facade-gen] Created semantic/camundaKeys shim');
  }

  const coreDir = path.join(ROOT, 'src/gen/core');
  fs.mkdirSync(coreDir, { recursive: true });
  const requestShim = path.join(coreDir, 'request.ts');
  if (!fs.existsSync(requestShim)) {
    fs.writeFileSync(requestShim, [
      '// @generated minimal request shim (facade) – TODO replace with transport if needed',
      'export interface RequestOptions { url: string; method?: string; body?: any; signal?: AbortSignal }',
      'export function request(_config: any, opts: RequestOptions): Promise<any> {',
      '  if (opts.signal?.aborted) return Promise.reject(new Error("aborted"));',
      '  // This shim is only for tests that spy on request; real transport sits behind sdk.gen',
      '  return Promise.resolve({});',
      '}'
    ].join('\n'), 'utf8');
    console.log('[facade-gen] Created core/request shim');
  }

  const wrappersDir = path.join(ROOT, 'src/gen/wrappers');
  fs.mkdirSync(wrappersDir, { recursive: true });
  const autoWrappers = path.join(wrappersDir, 'autoWrappers.ts');
  if (!fs.existsSync(autoWrappers)) {
    fs.writeFileSync(autoWrappers, [
      '// @generated placeholder – previous auto wrappers not yet reimplemented',
      'export const ServicesWrapped = {};'
    ].join('\n'),'utf8');
    console.log('[facade-gen] Created wrappers/autoWrappers placeholder');
  }

  // Barrel export for facade operations + CamundaKey types
  try {
    const metadataPath = path.join(ROOT, 'branding/branding-metadata.json');
    let keyNames: string[] = [];
    if (fs.existsSync(metadataPath)) {
      const meta = JSON.parse(fs.readFileSync(metadataPath,'utf8'));
      if (Array.isArray(meta.keys)) keyNames = meta.keys.map((k:any)=> k.name).filter(Boolean).sort();
    } else {
      // Fallback: parse types.gen.ts heuristically
      const typesFile = path.join(ROOT,'src/gen/types.gen.ts');
      if (fs.existsSync(typesFile)) {
        const src = fs.readFileSync(typesFile,'utf8');
        const re = /export type (\w+) = CamundaKey<[^>]+>/g; let m; while((m=re.exec(src))) keyNames.push(m[1]);
        keyNames = Array.from(new Set(keyNames)).sort();
      }
    }
    const barrel = [
      '// @generated facade barrel',
      "export * from '../facade/operations.gen';",
      keyNames.length ? 'export { '+ keyNames.join(', ') +" } from './types.gen';" : '//' + ' no key names found'
    ].join('\n');
    const barrelPath = path.join(ROOT,'src/gen/facade.gen.ts');
    fs.writeFileSync(barrelPath, barrel, 'utf8');
    console.log(`[facade-gen] Wrote barrel with ${keyNames.length} CamundaKey exports -> src/gen/facade.gen.ts`);
  } catch (e) {
    console.warn('[facade-gen] Barrel generation failed', e);
  }
}

function hasJsonLike(rb: OA3RequestBody): boolean {
  if (!rb?.content) return false;
  return Object.keys(rb.content).some(k => /json|octet|multipart|text\//i.test(k));
}

function buildJsDoc(op: { opId: string; summary?: string; description?: string }, passthrough = false): string {
  const parts: string[] = []; parts.push(op.opId);
  if (op.summary) parts.push(op.summary);
  if (op.description) parts.push(...String(op.description).split(/\r?\n/));
  if (passthrough) {
    parts.push('Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.');
  } else {
    parts.push('Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.');
  }
  return '/**\n' + parts.map(l=> ' * ' + l.replace(/\*/g,'')).join('\n') + '\n */';
}

main();
