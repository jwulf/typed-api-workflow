import { describe, it, expect, vi } from 'vitest';
import Camunda8 from '../src';

// NOTE: This test previously relied on an outdated integration helper (configureNewgenRuntime)
// which no longer exists. We now hydrate config via configureFromEnv and mock global fetch,
// mirroring the approach in usage-sdk-flow.test.ts.

describe('newgen integration helper (basic auth + base URL)', () => {
  it('applies env config, builds correct URL, injects Basic auth header', async () => {
    // Disable auto-config so test controls configuration explicitly
    process.env.CAMUNDA_SDK_DISABLE_AUTO_CONFIG = 'true';
    // Provide base URL only (auth assertions removed; getLicense has no auth security)
    process.env.CAMUNDA_REST_ADDRESS = 'http://example.test:8080';

    const fetchMock = vi.fn(async (req: Request) => new Response(
      JSON.stringify({ ok: true, url: req.url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    ));
    const camunda = new Camunda8({ CAMUNDA_REST_ADDRESS: 'http://example.test:8080', fetch: fetchMock as any });
    const res = await camunda.getLicense();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls[0][0] as Request).url).toBe('http://example.test:8080/license');
    expect(res).toEqual({ ok: true, url: expect.any(String) });
  });
});
