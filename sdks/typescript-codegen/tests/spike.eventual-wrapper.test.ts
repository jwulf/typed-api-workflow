import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as Svc from '../spike-openapi-ts/generated/services.gen';
import * as Adapter from '../spike-openapi-ts/adapter/eventual-wrapper';

// Only run if spike generated
const hasSearch = typeof (Svc as any)._raw_searchJobs === 'function';

describe('spike eventual wrapper', () => {
  beforeAll(() => {
    // @ts-ignore
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, statusText: 'OK', headers: new Headers({'Content-Type':'application/json'}), json: async()=>({}), text: async()=>'', blob: async()=> new Blob(), formData: async()=> new FormData() });
  });
  it('raw call without consistency bypasses eventualPoll', async () => {
    if (!hasSearch) return; // skip silently
    const spy = vi.spyOn(Adapter, 'eventualPoll');
    (Svc as any).searchJobs();
    expect(spy).not.toHaveBeenCalled();
  });
  it('call with consistency triggers eventualPoll', async () => {
    if (!hasSearch) return;
    const spy = vi.spyOn(Adapter, 'eventualPoll').mockImplementation((_id: string,_isGet:boolean,invoke:any,_c:any)=>invoke());
    (Svc as any).searchJobs({}, { waitUpToMs: 1 });
    expect(spy).toHaveBeenCalled();
  });
});
