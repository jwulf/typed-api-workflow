import { describe, it, expect } from 'vitest';
import * as Raw from '../src/gen/sdk.gen';
import * as Facade from '../src/gen/facade.gen';

// Heuristic: consider any exported function whose name starts with a lowercase letter
// and is not obviously an internal helper (exclude zod schema parsers beginning with 'z').
function isOperationExport([name, value]: [string, any]) {
  return typeof value === 'function' && /^[a-z]/.test(name) && !name.startsWith('z');
}

describe('facade completeness', () => {
  it('exports a facade symbol for every raw operation', () => {
    const rawOps = Object.entries(Raw).filter(isOperationExport).map(([n]) => n).sort();
    const facadeOps = new Set(Object.entries(Facade).filter(isOperationExport).map(([n]) => n));
    const missing = rawOps.filter(n => !facadeOps.has(n));
    // Allowlist of intentional omissions (add here only with justification)
    const allowlist: string[] = [];
    const realMissing = missing.filter(m => !allowlist.includes(m));
    if (realMissing.length) {
      throw new Error(`Facade missing wrappers for operations: ${realMissing.join(', ')}`);
    }
    expect(realMissing.length).toBe(0); // redundant but explicit
  });
});
