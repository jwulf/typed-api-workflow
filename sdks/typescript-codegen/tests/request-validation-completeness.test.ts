import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

interface Operation { opId: string; reqSchema?: string }

describe('request validation completeness', () => {
  it('ensures every JSON requestBody operation has a request schema wrapper', () => {
    const specPath = path.resolve(process.cwd(), '../../rest-api.domain.yaml');
    if (!fs.existsSync(specPath)) {
      console.warn('spec not found, skipping completeness test');
      return;
    }
    const spec = parse(fs.readFileSync(specPath, 'utf8')) as any;
    const ops: Operation[] = [];
    for (const [p, item] of Object.entries<any>(spec.paths || {})) {
      for (const verb of Object.keys(item)) {
        const op: any = (item as any)[verb];
        if (!op || !op.operationId) continue;
        let reqRef: string | undefined;
        const rb = op.requestBody;
        const content = rb && rb.content;
        if (content && typeof content === 'object') {
          const jsonType = Object.keys(content).find(k => k.includes('json')) || Object.keys(content)[0];
          if (jsonType) {
            const sch = content[jsonType]?.schema;
            if (sch?.$ref) reqRef = sch.$ref.split('/').pop();
          }
        }
        if (reqRef) ops.push({ opId: op.operationId, reqSchema: reqRef });
      }
    }
    // Read generated wrappers
    const wrappersPath = path.resolve(process.cwd(), 'src/gen/wrappers/autoWrappers.ts');
    const wrappers = fs.readFileSync(wrappersPath, 'utf8');
    const missing: string[] = [];
    for (const op of ops) {
      // Look for the method line with wrapCallWithReq and capture request schema arg.
      // Generator evolved arrow form from (_a:any)=> to ()=>, so we relax pattern:
      const re = new RegExp(`${op.opId}: [^\\n]*wrapCallWithReq\\(args, [^,]+, (Sem\\.[A-Za-z0-9_]+Schema|undefined),`);
      const m = wrappers.match(re);
      if (!m) {
        missing.push(`${op.opId} (no wrapper line found)`);
        continue;
      }
      const reqArg = m[1];
      if (reqArg === 'undefined') {
        missing.push(`${op.opId} (schema undefined)`);
      }
    }
    expect(missing).toEqual([]);
  });
});
