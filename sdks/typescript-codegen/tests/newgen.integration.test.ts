import { describe, it, expect, vi } from 'vitest';
import { OpenAPI } from '../src/gen';
import camunda from '../src';
import { configureNewgenRuntime } from '../src/gen/integrations';

// Provide env for basic auth
process.env.CAMUNDA_AUTH_STRATEGY = 'BASIC';
process.env.CAMUNDA_BASIC_AUTH_USERNAME = 'alice';
process.env.CAMUNDA_BASIC_AUTH_PASSWORD = 'secret';
process.env.CAMUNDA_REST_ADDRESS = 'http://example.test:8080';

const mockFetch = vi.fn(async (url: string, init: any) => {
  return new Response(JSON.stringify({ ok: true, url, auth: init?.headers?.get ? init.headers.get('Authorization') : init?.headers?.Authorization }), { status: 200, headers: { 'Content-Type': 'application/json' } });
});

OpenAPI.fetch = mockFetch as any;

configureNewgenRuntime();

describe('newgen integration helper', () => {
  it('sets base URL and injects basic auth header', async () => {
    const res = await camunda.getLicense();
    expect(mockFetch).toHaveBeenCalled();
    const firstCall = mockFetch.mock.calls[0];
    expect(firstCall[0]).toMatch(/^http:\/\/example\.test:8080\/v2\/license/);
    // Extract header from call
  const init = firstCall[1];
  const auth = typeof init.headers?.get === 'function' ? init.headers.get('Authorization') : init.headers?.Authorization;
    expect(auth).toMatch(/^Basic /);
    expect(res).toEqual({ ok: true, url: expect.any(String), auth });
  });
});
