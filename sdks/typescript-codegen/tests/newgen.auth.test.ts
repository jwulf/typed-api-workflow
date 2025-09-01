import { describe, it, expect, vi } from 'vitest';
import { OpenAPI } from '../src';
import { configureNewgenRuntime } from '../src/gen/integrations';
import { getLicense } from '../src';

function mockFetch(cb: (init: any)=>void) {
  (OpenAPI as any).fetch = vi.fn(async (url: string, init: any) => {
    cb(init);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type':'application/json' } });
  }) as any;
}

describe('newgen auth integration', () => {
  it('injects Basic auth header via interceptor', async () => {
    process.env.CAMUNDA_AUTH_STRATEGY = 'BASIC';
    process.env.CAMUNDA_BASIC_AUTH_USERNAME = 'alice';
    process.env.CAMUNDA_BASIC_AUTH_PASSWORD = 'secret';
    let seenAuth: string | undefined;
    mockFetch(init => {
      if (init.headers instanceof Headers) {
        seenAuth = init.headers.get('Authorization') || undefined;
      } else if (init.headers && typeof init.headers === 'object') {
        seenAuth = init.headers['Authorization'] || init.headers['authorization'];
      }
    });
    configureNewgenRuntime();
    await getLicense();
    expect(seenAuth).toMatch(/^Basic /);
  });
});
