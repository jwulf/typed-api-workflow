import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { getProcessInstance } from '../src';

// Simulate response missing required fields
(OpenAPI as any).fetch = async () => new Response(JSON.stringify({ processDefinitionId: 'id' }), { status: 200, headers: { 'Content-Type':'application/json' } });

describe('response schema validation', () => {
  it('strict mode throws on missing required fields', async () => {
    (OpenAPI as any).validation = { req: 'none', res: 'strict' };
    await expect(getProcessInstance({ processInstanceKey: 1 } as any)).rejects.toThrow(/response.validation/);
  });
  it('warn mode logs but returns body', async () => {
    const warns: string[] = [];
    (OpenAPI as any).validation = { req: 'none', res: 'warn' };
    (OpenAPI as any).logger = (lvl: string, msg: string) => { if (lvl==='warn') warns.push(msg); };
    const body = await getProcessInstance({ processInstanceKey: 1 } as any).catch(()=>null);
    expect(body).toBeTruthy();
    expect(warns.find(m=> m.includes('response.validation') && m.includes('REQUIRED'))).toBeTruthy();
  });
});
