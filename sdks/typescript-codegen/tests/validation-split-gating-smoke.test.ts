import { describe, it, expect } from 'vitest';
import { Camunda8 } from '../src/Camunda8';
import { z } from 'zod';

const reqSchema = z.object({ a: z.number() });
const resSchema = z.object({ b: z.string() });

describe('split req/res validation gating (smoke)', () => {
  it('req:warn,res:strict combination', async () => {
  const client = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'req:warn,res:strict' });
  // Assert modes via instance
  expect(client.validationConfig()).toEqual({ req: 'warn', res: 'strict' });
  expect(client.requestValidationMode()).toBe('warn');
  expect(client.responseValidationMode()).toBe('strict');
  // Request invalid -> warn returns original
  const reqVal = await client.gateRequest('opX', reqSchema, { a: 'not-num' } as any);
  expect(reqVal).toEqual({ a: 'not-num' });
  // Create second client with identical env to prove idempotence
  const client2 = new Camunda8({ CAMUNDA_SDK_VALIDATION: 'req:warn,res:strict' });
  expect(client2.validationConfig()).toEqual({ req: 'warn', res: 'strict' });
  // Response invalid -> strict throws
  await expect(client2.gateResponse('opX', resSchema, { b: 42 } as any)).rejects.toThrow();
  });
});
