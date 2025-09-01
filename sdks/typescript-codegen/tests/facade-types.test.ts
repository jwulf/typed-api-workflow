import { describe, it, expect, vi } from 'vitest';
import { camunda } from '../src';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';
import type { CancelablePromise } from '../src/facade/operations.gen';

// Type-level assertions (compile-time); runtime smoke ensures presence.
describe('facade types', () => {
  it('publishMessage returns CancelablePromise (network stubbed)', () => {
    // Avoid real network
    (globalThis as any).fetch = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    hydrateConfig({ env: { CAMUNDA_REST_ADDRESS: 'https://mock.local', CAMUNDA_SDK_VALIDATION: 'none' } });
    const p = camunda.publishMessage({} as any);
    expect(typeof (p as any).cancel).toBe('function');
  });
});
