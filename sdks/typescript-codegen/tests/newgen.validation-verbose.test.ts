import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { createProcessInstance } from '../src';

describe('newgen validation verbose reporting', () => {
  it('includes variant details when verbose env set (warn mode)', async () => {
    (OpenAPI as any).validation = { req: 'warn', res: 'none' };
    process.env.CAMUNDA_SDK_VALIDATION_VERBOSE = '1';
    const warns: string[] = [];
    (OpenAPI as any).logger = (lvl: string, msg: string) => { if (lvl==='warn') warns.push(msg); };
    await createProcessInstance({ requestBody: 123 as any }).catch(()=>{});
    const out = warns.join('\n');
    expect(out).toMatch(/Variant 1: ProcessInstanceCreationInstructionById/);
    expect(out).toMatch(/Exactly one of the variant required-key sets/);
    delete process.env.CAMUNDA_SDK_VALIDATION_VERBOSE;
  });
});
