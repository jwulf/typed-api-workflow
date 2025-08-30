import { describe, it, expect } from 'vitest';
import { ProcessInstanceKey } from '../src/gen/semantic/camundaKeys';
import { request } from '../src/gen/core/request';
import { OpenAPI } from '../src/gen/core/OpenAPI';

// We monkey patch fetch to capture the final URL and body used.
// Each test restores global fetch after execution.

function mockFetch(capture: { url?: string; init?: RequestInit }) {
  const original = globalThis.fetch;
  // @ts-ignore
  globalThis.fetch = (async (url: any, init?: any) => {
    capture.url = String(url);
    capture.init = init;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }) as any;
  return () => { globalThis.fetch = original; };
}

describe('semantic key request unwrapping', () => {
  it('unwrapped in path params', async () => {
    const key = ProcessInstanceKey.create('12345');
    const capture: any = {};
    const restore = mockFetch(capture);
    try {
      await request<any>(OpenAPI, {
        method: 'GET',
        url: '/process-instances/{processInstanceKey}',
        path: { processInstanceKey: key },
      });
      expect(capture.url).toContain('/process-instances/12345');
    } finally { restore(); }
  });

  it('unwrapped in query params', async () => {
    const key = ProcessInstanceKey.create('67890');
    const capture: any = {};
    const restore = mockFetch(capture);
    try {
      await request<any>(OpenAPI, {
        method: 'GET',
        url: '/process-instances',
        query: { processInstanceKey: key },
      });
      expect(capture.url).toMatch(/processInstanceKey=67890/);
    } finally { restore(); }
  });

  it('unwrapped in JSON body', async () => {
    const key = ProcessInstanceKey.create('24680');
    const capture: any = {};
    const restore = mockFetch(capture);
    try {
      await request<any>(OpenAPI, {
        method: 'POST',
        url: '/fake',
        body: { processInstanceKey: key },
        mediaType: 'application/json',
      });
      const sent = capture.init?.body as string;
      expect(sent).toContain('"processInstanceKey":"24680"');
    } finally { restore(); }
  });
});
