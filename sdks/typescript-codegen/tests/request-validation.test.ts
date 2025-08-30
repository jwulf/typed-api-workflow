import { describe, it, expect, vi } from 'vitest';
import { ServicesWrapped, OpenAPI } from '../src';

// We rely on generated schema for ProcessInstanceCreationInstruction.

describe('request-side validation', () => {
  it('throws in req:strict mode on invalid body', async () => {
    process.env.CAMUNDA_SDK_VALIDATION = 'req:strict';
    OpenAPI.BASE = 'https://mock.local';
    const reqMod = await import('../src/gen/core/request');
    const spy = vi.spyOn(reqMod, 'request');
  expect(() => ServicesWrapped.ProcessInstanceService.createProcessInstance({ requestBody: 123 as any })).toThrow();
    expect(spy).not.toHaveBeenCalled();
  });
  it('warns and proceeds in req:warn mode', async () => {
    process.env.CAMUNDA_SDK_VALIDATION = 'req:warn';
    OpenAPI.BASE = 'https://mock.local';
    const reqMod = await import('../src/gen/core/request');
    const spy = vi.spyOn(reqMod, 'request').mockResolvedValue({ processInstanceKey: '1' } as any);
  const res = await ServicesWrapped.ProcessInstanceService.createProcessInstance({ requestBody: 123 as any });
    expect(res).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });
  it('skips in req:none mode', async () => {
    process.env.CAMUNDA_SDK_VALIDATION = 'req:none';
    OpenAPI.BASE = 'https://mock.local';
    const reqMod = await import('../src/gen/core/request');
    const spy = vi.spyOn(reqMod, 'request').mockResolvedValue({ processInstanceKey: '1' } as any);
  const res = await ServicesWrapped.ProcessInstanceService.createProcessInstance({ requestBody: 123 as any });
    expect(res).toBeDefined();
    expect(spy).toHaveBeenCalled();
  });
});
