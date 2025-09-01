import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { createProcessInstance } from '../src';

// Mock fetch to avoid network
(OpenAPI as any).fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type':'application/json' } });

describe('schema validator (one-of) for createProcessInstance', () => {
  it('strict mode throws when both processDefinitionId and processDefinitionKey are provided', async () => {
    (OpenAPI as any).validation = { req: 'strict', res: 'none' };
    await expect(createProcessInstance({ requestBody: { processDefinitionId: 'id', processDefinitionKey: 123 } } as any)).rejects.toThrow(/ONE_OF/);
  });
  it('warn mode logs when both provided', async () => {
    const warns: string[] = [];
    (OpenAPI as any).validation = { req: 'warn', res: 'none' };
    (OpenAPI as any).logger = (lvl: string, msg: string) => { if (lvl==='warn') warns.push(msg); };
    await createProcessInstance({ requestBody: { processDefinitionId: 'id', processDefinitionKey: 123 } } as any).catch(()=>null);
    expect(warns.find(m=> m.includes('ONE_OF'))).toBeTruthy();
  });
});
