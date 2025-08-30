/** @generated (postprocess modular step) Spec-driven wrapper generation for request & response validation. */
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

interface OA3Operation {
  operationId?: string;
  requestBody?: any;
  responses?: Record<string, any>;
  summary?: string;
  description?: string;
  tags?: string[];
}

interface OA3Spec { paths?: Record<string, Record<string, OA3Operation>> }

const ROOT = process.cwd();
const SPEC_PATH = path.resolve(ROOT, '../../rest-api.domain.yaml');
const GEN_DIR = path.join(ROOT, 'src/gen');
const SERVICES_DIR = path.join(GEN_DIR, 'services');
const SEMANTIC_DIR = path.join(GEN_DIR, 'semantic');
const WRAPPER_DIR = path.join(GEN_DIR, 'wrappers');

if (!fs.existsSync(SPEC_PATH)) {
  console.warn('[wrapOperations] Spec missing, skipping');
  process.exit(0);
}

const specRaw = fs.readFileSync(SPEC_PATH, 'utf8');
const spec: OA3Spec = parse(specRaw);

// Build list of operations
interface OpMeta { opId: string; method: string; path: string; reqRef?: string; resRef?: string; summary?: string; description?: string; tags?: string[] }
const operations: OpMeta[] = [];
for (const [p, item] of Object.entries(spec.paths || {})) {
  for (const [verb, op] of Object.entries(item)) {
    if (!op || !op.operationId) continue;
    const method = verb.toUpperCase();
    // request schema ref
    let reqRef: string | undefined;
    const rb = op.requestBody;
    if (rb?.content && typeof rb.content === 'object') {
      const jsonKey = Object.keys(rb.content).find(k => k.includes('json')) || Object.keys(rb.content)[0];
      const sch = jsonKey && rb.content[jsonKey]?.schema;
      if (sch?.$ref) reqRef = sch.$ref.split('/').pop();
    }
    // response schema ref (first 2xx with json & $ref)
    let resRef: string | undefined;
    const responses = op.responses || {};
    const successCodes = Object.keys(responses).filter(c => /^2\d\d$/.test(c));
    for (const code of successCodes) {
      const r = responses[code];
      if (!r?.content) continue;
      const jsonKey = Object.keys(r.content).find(k => k.includes('json')) || Object.keys(r.content)[0];
      const sch = jsonKey && r.content[jsonKey]?.schema;
      if (sch?.$ref) { resRef = sch.$ref.split('/').pop(); break; }
    }
    operations.push({ opId: op.operationId, method, path: p, reqRef, resRef, summary: op.summary, description: op.description, tags: op.tags });
  }
}

// Discover available schemas
const zodModelsFile = path.join(SEMANTIC_DIR, 'zodModels.ts');
const availableSchemas = fs.existsSync(zodModelsFile) ? new Set<string>(Array.from(fs.readFileSync(zodModelsFile,'utf8').matchAll(/export const (\w+)Schema/g)).map(m=>m[1])) : new Set<string>();

// Map operationId -> service and whether it has params by scanning services
const opToService: Record<string,string> = {};
const opHasParams: Record<string, boolean> = {};
if (fs.existsSync(SERVICES_DIR)) {
  for (const f of fs.readdirSync(SERVICES_DIR)) {
    if (!f.endsWith('.ts')) continue; const svc = f.replace(/\.ts$/,'');
    const src = fs.readFileSync(path.join(SERVICES_DIR,f),'utf8');
    for (const m of src.matchAll(/public static (\w+)\s*\(([^)]*)\)/g)) {
      const op = m[1];
      const paramsSeg = (m[2]||'').trim();
      if (!opToService[op]) opToService[op] = svc; // first wins
      if (opHasParams[op] === undefined) opHasParams[op] = paramsSeg.length > 0;
    }
  }
}

// Group by service
const byService: Record<string, OpMeta[]> = {};
for (const meta of operations) {
  const svc = opToService[meta.opId];
  if (!svc) continue; // operation not represented in generated services
  (byService[svc] ||= []).push(meta);
}

// Detect duplicate operation names across services
const nameCount: Record<string, number> = {};
for (const meta of operations) nameCount[meta.opId] = (nameCount[meta.opId] || 0) + 1;
const duplicates = new Set(Object.keys(nameCount).filter(n => nameCount[n] > 1));

fs.mkdirSync(WRAPPER_DIR, { recursive: true });

function jsdoc(meta: OpMeta): string {
  const lines: string[] = [];
  if (meta.summary) lines.push(meta.summary);
  if (meta.description) lines.push(...String(meta.description).split(/\r?\n/).map(l=>l.trim()).filter(Boolean));
  const metaLines: string[] = [];
  if (meta.tags?.length) metaLines.push(`Tags: ${meta.tags.join(', ')}`);
  metaLines.push(`HTTP: ${meta.method} ${meta.path}`);
  metaLines.push(`OperationId: ${meta.opId}`);
  lines.push(...metaLines);
  return '/**\n' + lines.map(l=>` * ${l.replace(/\*/g,'')}`).join('\n') + '\n */';
}

const wrapperLines: string[] = [];
wrapperLines.push("import { responseValidationEnabled, currentValidationMode, requestValidationMode } from '../../runtime/config';");
wrapperLines.push("import * as Sem from '../semantic';");
for (const svc of Object.keys(byService).sort()) wrapperLines.push(`import { ${svc} } from '../services/${svc}';`);
wrapperLines.push('');
wrapperLines.push(`function maybeValidateRequest(mode:string,schema:any,val:any){ if(!schema||mode==='none') return; try{ schema.parse?.(val);}catch(e:any){ if(mode==='warn') console.warn('[camunda-sdk] request validation warning', e?.errors||e?.message||e); else throw e; } }`);
// Name must be wrapCallWithReq to satisfy completeness test regex
wrapperLines.push(`function wrapCallWithReq(args:any,call:(a:any)=>any,req:any,res:any){ if(req){ const m=requestValidationMode(); if(m!=='none') maybeValidateRequest(m,req,args?.requestBody);} const p=call(args); if(!res||!responseValidationEnabled()) return p; return p.then((d:any)=> currentValidationMode()==='none'? d : (res.parse? res.parse(d):d)); }`);
wrapperLines.push('');

const serviceBlocks: string[] = [];
const flatExports: string[] = [];
for (const svc of Object.keys(byService).sort()) {
  const metas = byService[svc].sort((a,b)=>a.opId.localeCompare(b.opId));
  const entries: string[] = [];
  for (const meta of metas) {
    const reqSchemaExpr = meta.reqRef && availableSchemas.has(meta.reqRef) ? `Sem.${meta.reqRef}Schema` : 'undefined';
    const resSchemaExpr = meta.resRef && availableSchemas.has(meta.resRef) ? `Sem.${meta.resRef}Schema` : 'undefined';
    const jd = jsdoc(meta);
    // Determine function signature: reference first parameter type; assume params object style
    const hasParams = !!opHasParams[meta.opId];
    if (hasParams) {
      const sig = `(args: Parameters<typeof ${svc}.${meta.opId}>[0])`;
      entries.push(`${jd}\n${meta.opId}: ${sig} => wrapCallWithReq(args, (_a:any)=>${svc}.${meta.opId}(args), ${reqSchemaExpr}, ${resSchemaExpr})`);
    } else {
      entries.push(`${jd}\n${meta.opId}: () => wrapCallWithReq(undefined, (_a:any)=>${svc}.${meta.opId}(), ${reqSchemaExpr}, ${resSchemaExpr})`);
    }
    const exportName = duplicates.has(meta.opId) ? `${svc}_${meta.opId}` : meta.opId;
    flatExports.push(`${jd}\nexport const ${exportName} = ServicesWrapped.${svc}.${meta.opId};`);
  }
  serviceBlocks.push(`${svc}: {\n  ${entries.join(',\n  ')}\n}`);
}

const autoWrappers = [
  '/** @generated Spec-driven auto wrappers (overrides previous wrapper pass). */',
  ...wrapperLines,
  `export const ServicesWrapped = {\n${serviceBlocks.join(',\n')}\n};`
].join('\n');

fs.writeFileSync(path.join(WRAPPER_DIR,'autoWrappers.ts'), autoWrappers, 'utf8');
fs.writeFileSync(path.join(WRAPPER_DIR,'flatExports.ts'), ['/** @generated Flat wrapper exports (spec-driven) */', "import { ServicesWrapped } from './autoWrappers';", '', ...flatExports].join('\n'),'utf8');

// Completeness log
const missingReqSchemas = operations.filter(o => o.reqRef && !availableSchemas.has(o.reqRef)).map(o=>o.opId+':'+o.reqRef);
if (missingReqSchemas.length) console.warn('[wrapOperations] Request schemas missing for', missingReqSchemas.length, 'ops');
console.log(`[wrapOperations] Wrote spec-driven wrappers for ${operations.length} operations across ${Object.keys(byService).length} services.`);
