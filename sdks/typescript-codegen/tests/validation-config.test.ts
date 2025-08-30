import { describe, it, expect } from 'vitest';
import { requestValidationMode, responseValidationMode, validationConfig } from '../src/runtime/config';

function set(val?: string) {
  if (val === undefined) delete process.env.CAMUNDA_SDK_VALIDATION; else process.env.CAMUNDA_SDK_VALIDATION = val;
  // Bust module cache side effects not needed because config caches by env string; direct calls reflect change.
}

describe('CAMUNDA_SDK_VALIDATION parsing', () => {
  it('defaults to none/none when unset', () => {
    set(undefined);
    expect(requestValidationMode()).toBe('none');
    expect(responseValidationMode()).toBe('none');
  });
  it('global strict', () => {
    set('strict');
    expect(validationConfig()).toEqual({ req: 'strict', res: 'strict' });
  });
  it('req only', () => {
    set('req:warn');
    expect(validationConfig()).toEqual({ req: 'warn', res: 'none' });
  });
  it('res only', () => {
    set('res:strict');
    expect(validationConfig()).toEqual({ req: 'none', res: 'strict' });
  });
  it('both sides pair list', () => {
    set('req:warn,res:strict');
    expect(validationConfig()).toEqual({ req: 'warn', res: 'strict' });
  });
  it('invalid tokens ignored', () => {
    set('foo:bar,res:warn');
    expect(validationConfig()).toEqual({ req: 'none', res: 'warn' });
  });
});
