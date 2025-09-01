import { describe, it, expect } from 'vitest';
import * as CamundaKeys from '../src/gen';
import type { ProcessInstanceKey } from '../src/gen';

// NOTE: Branding test

describe('Primitive CamundaKey branding', () => {
  it('prevents implicit assignment of raw string (type-level)', () => {
    // @ts-expect-error raw string should not be assignable directly
    const bad: ProcessInstanceKey = '12345';
    const ok: ProcessInstanceKey = CamundaKeys. ProcessInstanceKey.assumeExists('12345');
    expect(typeof ok).toBe('string');
    expect(ok).toBe('12345');
  });

  it('supports string operations and JSON serialization naturally', () => {
    const k = CamundaKeys.ProcessInstanceKey.assumeExists('67890');
    const concatenated = `pi-${k}`;
    expect(concatenated).toBe('pi-67890');
    const json = JSON.stringify({ k });
    expect(json).toContain('67890');
  });

  it('rejects invalid input (length / regex) - currently no regex so always passes', () => {
    // If constraints added later, update expectations
    const k = CamundaKeys.ProcessInstanceKey.assumeExists('42');
    expect(k).toBe('42');
  });
});
