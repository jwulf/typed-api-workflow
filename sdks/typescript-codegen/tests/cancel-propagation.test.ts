import { describe, it, expect, vi } from 'vitest';
import camunda from '../src';
import { CancelablePromise } from '../src/gen/core/CancelablePromise';

// We simulate response validation ON so that the wrapper creates a new outer CancelablePromise
process.env.CAMUNDA_SDK_VALIDATION = 'res:strict';

describe('cancellation propagation', () => {
  it('propagates cancel() from wrapper to inner promise', async () => {
    // Dynamically import request to spy (after env var set)
    const reqMod = await import('../src/gen/core/request');
    const requestSpy = vi.spyOn(reqMod, 'request');

    let innerCancelled = false;

    // Fabricate a long-running inner CancelablePromise the service would return
    const inner = new CancelablePromise<string>((resolve, _reject, onCancel) => {
      const t = setTimeout(() => resolve('ok'), 50_000); // never intended to fire in test
      onCancel(() => { innerCancelled = true; clearTimeout(t); });
    });

    // Make the first call (e.g. getTopology) return our fabricated inner promise
    requestSpy.mockImplementationOnce((): any => inner as any);

  const p = camunda.getTopology();
  // Attach a catch to swallow the intentional cancellation rejection
  void (p as any).catch?.(()=>{});
  // cancel wrapper promise
  (p as any).cancel?.();
  // allow microtask queue to process cancellation handlers
  await Promise.resolve();
  expect(innerCancelled).toBe(true);
  });
});
