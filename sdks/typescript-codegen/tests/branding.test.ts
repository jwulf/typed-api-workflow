import { describe, it, expect } from 'vitest';
import { ProcessInstanceKey, ProcessDefinitionKey } from '../src';
import * as CamundaKeys from '../src/gen/semantic/camundaKeys';

// compile-time only test helpers (no runtime execution for type errors)

describe('branding nominal incompatibility', () => {
  it('namespace create produces nominal objects not inter-assignable (compile-time)', () => {
    const raw = '123456';
  const pik: ProcessInstanceKey = CamundaKeys.ProcessInstanceKey.assumeDeployed(raw);
  const pdk: ProcessDefinitionKey = CamundaKeys.ProcessDefinitionKey.assumeDeployed(raw);
    expect(CamundaKeys.ProcessInstanceKey.getValue(pik)).toBe(raw);
    expect(CamundaKeys.ProcessDefinitionKey.getValue(pdk)).toBe(raw);
    // @ts-expect-error deliberate mismatch: assigning ProcessDefinitionKey to ProcessInstanceKey variable
    const shouldError: ProcessInstanceKey = pdk;
    void shouldError;
  });
});
