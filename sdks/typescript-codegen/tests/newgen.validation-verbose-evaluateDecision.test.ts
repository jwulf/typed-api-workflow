import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { evaluateDecision } from '../src';

describe('newgen verbose reporting evaluateDecision', () => {
  it('logs variant details for evaluateDecision', async () => {
    (OpenAPI as any).validation = { req: 'warn', res: 'none' };
    process.env.CAMUNDA_SDK_VALIDATION_VERBOSE = '1';
    const warns: string[] = [];
    (OpenAPI as any).logger = (lvl: string, msg: string) => { if (lvl==='warn') warns.push(msg); };
    await evaluateDecision({ requestBody: {} as any }).catch(()=>{});
    const out = warns.join('\n');
    expect(out).toMatch(/Variant 1: DecisionEvaluationById/);
    expect(out).toMatch(/Variant 2: DecisionEvaluationByKey/);
    expect(out).toMatch(/Exactly one of the variant required-key sets must match: { decisionDefinitionId } \| { decisionDefinitionKey }/);
    delete process.env.CAMUNDA_SDK_VALIDATION_VERBOSE;
  });
});
