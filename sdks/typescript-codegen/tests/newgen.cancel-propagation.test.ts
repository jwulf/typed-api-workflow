import { describe, it, expect, vi } from 'vitest';
import { OpenAPI } from '../src/gen';
import * as reqMod from '../src/gen/core/request';
import { getTopology } from '../src';
import { CancelablePromise } from '../src/gen/core/CancelablePromise';

// Enable a validation mode (not required but mirrors legacy intent)
(OpenAPI as any).validation = { req: 'none', res: 'strict' };

describe('newgen cancellation propagation', () => {
  it('cancel() propagates to inner CancelablePromise', async () => {
    const spy = vi.spyOn(reqMod, 'request');
    let innerCancelled = false;
    const inner = new CancelablePromise<string>((resolve, _reject, onCancel) => {
      const t = setTimeout(()=> resolve('ok'), 50_000);
      onCancel(()=> { innerCancelled = true; clearTimeout(t); });
    });
    spy.mockImplementationOnce((): any => inner as any);
    const p = getTopology();
    void (p as any).catch?.(()=>{});
    (p as any).cancel?.();
    await Promise.resolve();
    expect(innerCancelled).toBe(true);
  });
});
