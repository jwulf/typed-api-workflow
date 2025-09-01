import { describe, it, expect } from 'vitest';
import { request } from '../src/gen/core/request';
import { OpenAPI } from '../src/gen/core/OpenAPI';
import * as CamundaKeys from '../src/gen/semantic/camundaKeys';

function mockFetch(capture: { url?: string; init?: RequestInit }) {
  const original = globalThis.fetch;
  // @ts-ignore
  globalThis.fetch = (async (url: any, init?: any) => {
    capture.url = String(url);
    capture.init = init;
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type':'application/json' } });
  }) as any;
  return () => { globalThis.fetch = original; };
}

describe('newgen key request unwrapping (string branding)', () => {
  it('path param replacement', async () => {
    const key = CamundaKeys.ProcessInstanceKey.assumeExists('12345');
    const capture: any = {};
    const restore = mockFetch(capture);
    try {
      await request<any>(OpenAPI as any, { method:'GET', url:'/process-instances/{processInstanceKey}', path:{ processInstanceKey: key } });
      expect(capture.url).toContain('/process-instances/12345');
    } finally { restore(); }
  });
  it('query param serialization', async () => {
    const key = CamundaKeys.ProcessInstanceKey.assumeExists('67890');
    const capture: any = {}; const restore = mockFetch(capture);
    try {
      await request<any>(OpenAPI as any, { method:'GET', url:'/process-instances', query:{ processInstanceKey: key } });
      expect(capture.url).toMatch(/processInstanceKey=67890/);
    } finally { restore(); }
  });
  it('body JSON serialization', async () => {
    const key = CamundaKeys.ProcessInstanceKey.assumeExists('24680');
    const capture: any = {}; const restore = mockFetch(capture);
    try {
      await request<any>(OpenAPI as any, { method:'POST', url:'/fake', body:{ processInstanceKey: key }, mediaType:'application/json' });
      expect((capture.init?.body as string)).toContain('"processInstanceKey":"24680"');
    } finally { restore(); }
  });
});
