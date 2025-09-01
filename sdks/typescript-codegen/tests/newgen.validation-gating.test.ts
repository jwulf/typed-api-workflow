import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { createProcessInstance } from '../src';

// Mock fetch to echo request body
;(OpenAPI as any).fetch = (async (_url: string, init: any) => {
  return new Response(JSON.stringify({ echoed: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}) as any;

describe('validation gating (placeholder structural)', () => {
  it('warn mode logs but does not throw on undefined', async () => {
    const warnings: any[] = [];
  delete (OpenAPI as any).validation; // ensure split modes not set
  (OpenAPI as any).validationMode = 'warn';
  (OpenAPI as any).logger = (lvl,msg,meta)=> { if (lvl==='warn') warnings.push({msg,meta}); };
    await createProcessInstance({ requestBody: { variables: { a: undefined, b: 1 } } } as any);
    expect(warnings.find(w=> w.msg.includes('request.validation'))).toBeTruthy();
  });
  it('strict mode throws on undefined', async () => {
  delete (OpenAPI as any).validation; // ensure split modes not set
  (OpenAPI as any).validationMode = 'strict';
    await expect(createProcessInstance({ requestBody: { variables: { a: undefined } } } as any)).rejects.toThrow(/request.validation/);
  });
});
