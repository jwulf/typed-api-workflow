import { describe, it, expect, vi } from 'vitest';
import { ServicesWrapped, OpenAPI } from '../src';

describe('validation verbose mode', () => {
  it('emits expanded union variant info with examples when verbose flag set', async () => {
  process.env.CAMUNDA_SDK_VALIDATION = 'req:warn';
  process.env.CAMUNDA_SDK_LOG_LEVEL = 'warn';
    process.env.CAMUNDA_SDK_VALIDATION_VERBOSE = '1';
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  // Trigger validation on request side; ensure mode is req:warn so we don't throw.
  OpenAPI.BASE = 'https://mock.local';
  const reqMod = await import('../src/gen/core/request');
  vi.spyOn(reqMod, 'request').mockResolvedValue({ processInstanceKey: '1' } as any);
  await ServicesWrapped.ProcessInstanceService.createProcessInstance({ requestBody: 123 as any });
  const output = spy.mock.calls.map(c=>c.join(' ')).join('\n');
  expect(output).toMatch(/Invalid createProcessInstance request/);
  expect(output).toMatch(/Variant 1:/);
  expect(output).toMatch(/Exactly one of the variant required-key sets/);
    spy.mockRestore();
    delete process.env.CAMUNDA_SDK_VALIDATION_VERBOSE;
  delete process.env.CAMUNDA_SDK_VALIDATION;
  delete process.env.CAMUNDA_SDK_LOG_LEVEL;
  });
});