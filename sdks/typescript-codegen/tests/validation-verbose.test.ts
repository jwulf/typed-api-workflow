import { describe, it, expect, vi } from 'vitest';
import { CamundaClient } from '../src';
import { z } from 'zod';

describe('validation verbose mode', () => {
  it('emits warning with verbose detail in warn mode', async () => {
    const client = new CamundaClient({ config: { CAMUNDA_SDK_VALIDATION: 'req:warn', CAMUNDA_SDK_VALIDATION_VERBOSE: true } });
    const schema = z.object({ expected: z.string() }).describe('CreateProcessInstanceRequest');
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await client.gateRequest('createProcessInstance', schema, { expected: 123 } as any);
    const output = spy.mock.calls.map(c=>c.join(' ')).join('\n');
    expect(output).toMatch(/createProcessInstance/);
    spy.mockRestore();
  });
});