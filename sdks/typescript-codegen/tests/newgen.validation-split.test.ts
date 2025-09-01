import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { getLicense } from '../src';

// Simulate response with invalid number
(OpenAPI as any).fetch = async () => new Response(JSON.stringify({ value: Infinity }), { status: 200, headers: { 'Content-Type':'application/json' } });

describe('split req/res validation modes', () => {
  it('strict response mode throws on invalid number while request mode none', async () => {
    (OpenAPI as any).validation = { req: 'none', res: 'strict' };
    await expect(getLicense()).rejects.toThrow(/response.validation/);
  });
  it('warn response mode logs but does not throw', async () => {
    const warns: any[] = [];
    (OpenAPI as any).validation = { req: 'none', res: 'warn' };
    (OpenAPI as any).logger = (lvl: string, msg: string) => { if (lvl==='warn') warns.push(msg); };
    const res = await getLicense().catch(()=>null);
    expect(res).toBeTruthy();
    expect(warns.find(m=>m.includes('response.validation'))).toBeTruthy();
  });
});
