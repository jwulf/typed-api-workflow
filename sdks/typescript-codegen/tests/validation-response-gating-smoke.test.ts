import { describe, it, expect } from 'vitest';
import { hydrateConfig } from '../src/runtime/unifiedConfiguration';
import { z } from 'zod';
import { Camunda8 } from '../src/Camunda8';

// Simple schema requiring string
const schema = z.object({ foo: z.string() });

describe('response validation gating (smoke)', () => {
  it('warn mode does not throw', async () => {
  const client = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'res:warn' });
  const v = await client.gateResponse('dummyOp', schema, { foo: 123 } as any);
    expect(v).toEqual({ foo: 123 });
  });
  it('strict mode throws', async () => {
  const client = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'res:strict' });
  await expect(client.gateResponse('dummyOp', schema, { foo: 123 } as any)).rejects.toThrow();
  });
  it('none mode bypasses', async () => {
  const client = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'none' });
  const v = await client.gateResponse('dummyOp', schema, { foo: 123 } as any);
    expect(v.foo).toBe(123);
  });
});
