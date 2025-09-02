import { describe, it, expect, vi } from 'vitest';
import { CamundaClient } from '../src';

function mockFetch(cb: (init: any) => void) {
  return vi.fn(async (url: string, init: any) => {
    cb(init);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type':'application/json' } });
  }) as any;
}

describe('newgen auth integration', () => {
  it('injects Basic auth header via interceptor', async () => {
        let seenAuth: string | undefined;

    const fetch = mockFetch(init => {
      if (init.headers instanceof Headers) {
        seenAuth = init.headers.get('Authorization') || undefined;
      } else if (init.headers && typeof init.headers === 'object') {
        seenAuth = init.headers['Authorization'] || init.headers['authorization'];
      }
    });
    const camunda = new CamundaClient({ config: {
         CAMUNDA_AUTH_STRATEGY: 'BASIC',
         CAMUNDA_BASIC_AUTH_USERNAME: 'alice',
         CAMUNDA_BASIC_AUTH_PASSWORD: 'secret',
    }, fetch })
    await camunda.getLicense();
    expect(seenAuth).toMatch(/^Basic /);
  });
});
