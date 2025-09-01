import { describe, it, expect, vi, beforeAll } from 'vitest';
import { camunda, configureFromEnv } from '../src';

// Smoke test: flattened body-only wrapper and passthrough exist, return a CancelablePromise with cancel()

describe('facade ergonomics', () => {
  beforeAll(() => {
    // Ensure base URL configured & stub fetch so we don't attempt real network
    process.env.CAMUNDA_REST_ADDRESS = 'http://localhost:1234';
    configureFromEnv();
    // Minimal successful JSON response
    // @ts-ignore
    global.fetch = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  });
  it('exposes body-only overload accepting raw body', () => {
    expect(typeof camunda.publishMessage).toBe('function');
    // We cannot perform real network call here; just ensure cancelable shape returned
    const p = camunda.publishMessage({ /* raw body placeholder */ } as any);
    expect(typeof (p as any).cancel).toBe('function');
  });
  it('exposes passthrough operation', () => {
    expect(typeof camunda.getLicense).toBe('function');
  });
});
