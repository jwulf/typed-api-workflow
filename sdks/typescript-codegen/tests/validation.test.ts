import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { validateData } from '../src/runtime/validation';

describe('validation modes', () => {
  const schema = z.object({ n: z.number() });
  it('strict throws', () => {
    process.env.CAMUNDA_SDK_VALIDATION = 'strict';
    expect(() => validateData(schema, { n: 'x' })).toThrow();
  });
  it('warn does not throw', () => {
    process.env.CAMUNDA_SDK_VALIDATION = 'warn';
    expect(() => validateData(schema, { n: 'x' })).not.toThrow();
  });
  it('none bypasses', () => {
    process.env.CAMUNDA_SDK_VALIDATION = 'none';
    expect(() => validateData(schema, { n: 'x' })).not.toThrow();
  });
});
