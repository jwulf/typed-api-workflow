import { describe, it, expect, vi } from 'vitest';
import { ServicesWrapped, OpenAPI } from '../src';

// Regression test: ensure required keys for union variants are reported correctly
// Specifically: ProcessInstanceCreationInstructionById must list processDefinitionId as required.
describe('validation reporting - required keys', () => {
  it('reports required keys for ProcessInstanceCreationInstruction variants', async () => {
  process.env.CAMUNDA_SDK_VALIDATION = 'req:warn';
  process.env.CAMUNDA_SDK_LOG_LEVEL = 'warn';
  process.env.CAMUNDA_SDK_VALIDATION_VERBOSE = '1';
    const spy = vi.spyOn(console, 'warn').mockImplementation(()=>{});
    OpenAPI.BASE = 'https://mock.local';
    const reqMod = await import('../src/gen/core/request');
    vi.spyOn(reqMod, 'request').mockResolvedValue({ processInstanceKey: '1' } as any);
  // Use clearly invalid primitive body to trigger union validation path
  await ServicesWrapped.ProcessInstanceService.createProcessInstance({ requestBody: 123 as any });
    const output = spy.mock.calls.map(c=>c.join(' ')).join('\n');
    expect(output).toMatch(/Variant 1: ProcessInstanceCreationInstructionById: required {.*processDefinitionId/);
    expect(output).toMatch(/Exactly one of the variant required-key sets must match: .*processDefinitionId .*\| .*processDefinitionKey/);
    spy.mockRestore();
    delete process.env.CAMUNDA_SDK_VALIDATION_VERBOSE;
  delete process.env.CAMUNDA_SDK_VALIDATION;
  delete process.env.CAMUNDA_SDK_LOG_LEVEL;
  });
});
