import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { createProcessInstance } from '../src';

describe('newgen validation required reporting', () => {
  it('reports required key sets for union variants', async () => {
    (OpenAPI as any).validation = { req: 'warn', res: 'none' };
    process.env.CAMUNDA_SDK_VALIDATION_VERBOSE = '1';
    const warns: string[] = [];
    (OpenAPI as any).logger = (lvl: string, msg: string) => { if (lvl==='warn') warns.push(msg); };
    await createProcessInstance({ requestBody: {} as any }).catch(()=>{});
    const out = warns.join('\n');
    expect(out).toMatch(/Variant 1:/);
    expect(out).toMatch(/Variant 2:/);
    expect(out).toMatch(/Exactly one of the variant required-key sets/);
    delete process.env.CAMUNDA_SDK_VALIDATION_VERBOSE;
  });
});
