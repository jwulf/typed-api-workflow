import { describe, it, expect } from 'vitest';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';
import { z } from 'zod';
import { Camunda8 } from '../src/Camunda8';

const schema = z.object({ foo: z.string() });

describe('validation gating (smoke)', () => {
  it('none mode skips validation (returns original invalid data)', async () => {
    const client = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'none' });
    const v = await client.gateRequest('dummyOp', schema, { foo: 123 } as any);
    expect(v).toEqual({ foo: 123 });
  });
  it('warn mode returns original invalid data', async () => {
    const client = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'req:warn' });
    const v = await client.gateRequest('dummyOp', schema, { foo: 123 } as any);
    expect(v).toEqual({ foo: 123 });
  });
  it('strict mode throws', async () => {
    const client = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'req:strict' });
    await expect(client.gateRequest('dummyOp', schema, { foo: 123 } as any)).rejects.toThrow();
  });
});
