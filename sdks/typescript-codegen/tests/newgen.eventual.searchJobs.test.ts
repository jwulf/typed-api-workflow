import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventualConsistencyTimeoutError, Camunda8, configureFromEnv } from '../src';

function makeResponse(status: number, body: any) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type':'application/json' } }); }

describe('newgen eventual consistency wrapper (searchJobs)', () => {
  const originalFetch = global.fetch;
  beforeEach(()=> { vi.useFakeTimers(); });
  afterEach(()=> { vi.useRealTimers(); // @ts-ignore
    global.fetch = originalFetch; });
  beforeEach(()=> { process.env.CAMUNDA_REST_ADDRESS = 'http://localhost:1234'; configureFromEnv(); });

  it('polls until items exist', async () => {
    let calls = 0;
    const camunda = new Camunda8({fetch: vi.fn().mockImplementation(()=> { calls++; return calls < 3 ? Promise.resolve(makeResponse(200,{ items: [] })) : Promise.resolve(makeResponse(200,{ items:[{id:1}] })); }) })
    const p = camunda.searchJobs({}, { consistency: { waitUpToMs: 1000, pollIntervalMs: 50 } });
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(50);
    await vi.advanceTimersByTimeAsync(50);
    const result = await p;
    expect(result.items?.length).toBe(1);
    expect(calls).toBe(3);
  });

  it('times out', async () => {
    let calls = 0;
    // Always return empty items so predicate never succeeds
    const camunda = new Camunda8({fetch: vi.fn().mockImplementation(()=> { calls++; return Promise.resolve(makeResponse(200,{ items: [] })); }) })
    const p = camunda.searchJobs({}, { consistency: { waitUpToMs: 120, pollIntervalMs: 40 } });
    const expectation = expect(p).rejects.toBeInstanceOf(EventualConsistencyTimeoutError);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(40);
    await vi.advanceTimersByTimeAsync(40);
    await vi.advanceTimersByTimeAsync(40);
    await expectation;
    expect(calls).toBeGreaterThanOrEqual(3);
  });
});
