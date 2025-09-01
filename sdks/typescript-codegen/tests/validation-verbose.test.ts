import { describe, it, expect, vi } from 'vitest';
import { Camunda8 } from '../src';
import { z } from 'zod';

describe('validation verbose mode', () => {
  it('emits warning with verbose detail in warn mode', async () => {
    process.env.CAMUNDA_SDK_VALIDATION = 'req:warn';
    process.env.CAMUNDA_SDK_VALIDATION_VERBOSE = 'true';
    const client = new Camunda8();
    const schema = z.object({ expected: z.string() }).describe('CreateProcessInstanceRequest');
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await client.gateRequest('createProcessInstance', schema, { expected: 123 } as any);
    const output = spy.mock.calls.map(c=>c.join(' ')).join('\n');
    expect(output).toMatch(/createProcessInstance/);
    spy.mockRestore();
    delete process.env.CAMUNDA_SDK_VALIDATION_VERBOSE;
    delete process.env.CAMUNDA_SDK_VALIDATION;
  });
});