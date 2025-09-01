import { describe, it, expect, vi } from 'vitest';
import { OpenAPI } from '../src/gen';
import camunda from '../src';

// Mock fetch
const mockFetch = vi.fn(async (_url: string, _init: any) => {
  return new Response(JSON.stringify({ license: 'ok' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});

// Polyfill global Response if needed (in node < 18 environment; here assumed available)

describe('newgen request runtime', () => {
  it('applies request & response interceptors and logger', async () => {
    const logs: any[] = [];
    OpenAPI.fetch = mockFetch as any;
    OpenAPI.logger = (level, msg, meta) => logs.push({ level, msg, meta });
    const reqSpy = vi.fn(o => ({ ...o, headers: { ...(o.headers||{}), 'X-Test': '1' } }));
    const resSpy = vi.fn(r => r);
    OpenAPI.interceptors.request.use(reqSpy as any);
    OpenAPI.interceptors.response.use(resSpy as any);

    const result = await camunda.getLicense();
    expect(result).toEqual({ license: 'ok' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(reqSpy).toHaveBeenCalled();
    expect(resSpy).toHaveBeenCalled();
    expect(logs.find(l => l.msg === 'request.success')).toBeTruthy();
  });
});
