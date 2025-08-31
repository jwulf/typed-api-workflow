import { describe, it, expect } from 'vitest';
import { ProcessInstanceKey } from '../src/gen/semantic/camundaKeys';

// NOTE: This test demonstrates the current branding approach:
// 1. A raw string is NOT implicitly assignable to a branded key type (compile-time).
// 2. The factory (create) produces a value usable as a string (String-coercible).
// 3. A user can "lift" a free string via the factory after validation.
// 4. Runtime value still behaves like a string for concatenation & JSON.

describe('Primitive CamundaKey branding', () => {
  it('prevents implicit assignment of raw string (type-level)', () => {
    // @ts-expect-error raw string should not be assignable directly
    const bad: ProcessInstanceKey = '12345';
  const ok: ProcessInstanceKey = ProcessInstanceKey.assumeExists('12345');
    expect(typeof ok).toBe('string');
    expect(ok).toBe('12345');
  });

  it('supports string operations and JSON serialization naturally', () => {
  const k = ProcessInstanceKey.assumeExists('67890');
    const concatenated = `pi-${k}`;
    expect(concatenated).toBe('pi-67890');
    const json = JSON.stringify({ k });
    expect(json).toContain('67890');
  });

  it('rejects invalid input (length / regex)', () => {
  expect(() => ProcessInstanceKey.assumeExists('')).toThrow();
  expect(() => ProcessInstanceKey.assumeExists('abc')).toThrow();
  });
});
