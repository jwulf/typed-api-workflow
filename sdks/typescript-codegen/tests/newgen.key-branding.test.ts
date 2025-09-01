import { describe, it, expect } from 'vitest';
import { ProcessInstanceKey, ProcessDefinitionKey } from '../src/gen';
import * as CamundaKeys from '../src/keys';

describe('newgen primitive CamundaKey branding', () => {
  it('factory produces key and raw string is NOT implicitly assignable', () => {
    // @ts-expect-error raw string should not be assignable after branding
    const raw: ProcessInstanceKey = '12345';
    const ok: ProcessInstanceKey = CamundaKeys.ProcessInstanceKey.assumeExists('12345');
    expect(typeof ok).toBe('string');
    expect(ok).toBe('12345');
    const pd: ProcessDefinitionKey = CamundaKeys.ProcessDefinitionKey.assumeExists('999');
    expect(pd).toBe('999');
    // @ts-expect-error cross-assignment should now be rejected
    const cross: ProcessInstanceKey = pd;
    void cross;
  });

  it('string operations & JSON', () => {
    const k = CamundaKeys.ProcessInstanceKey.assumeExists('67890');
    const concat = `pi-${k}`;
    expect(concat).toBe('pi-67890');
    expect(JSON.stringify({ k })).toContain('67890');
  });
});
