import { describe, it, expect } from 'vitest';
import type { ProcessInstanceKey, DecisionInstanceKey } from '../src/gen/types.gen';

// NOTE: Current generated key types are structural aliases; mutual exclusivity not enforced at compile time.
// This test documents current state and serves as a baseline for future nominal branding enhancement.

describe('newgen key branding (structural)', () => {
  it('allows cross-assignment today (documenting gap)', () => {
    const pi: ProcessInstanceKey = '123' as any;
    const di: DecisionInstanceKey = '456' as any;
    // Cross-assign (should succeed now, will fail once nominal branding added)
    const leak: ProcessInstanceKey = di; // acceptable currently
    expect(leak).toBe('456');
    expect(pi).toBe('123');
  });
});
