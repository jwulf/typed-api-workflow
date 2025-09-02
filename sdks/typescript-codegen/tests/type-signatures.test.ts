import { describe, it, expect } from 'vitest';
import { CamundaClient } from '../src';
import type { CancelablePromise } from '../src/facade/operations.gen';

const camunda = new CamundaClient({ config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080' } });

type NotAny<T> = 0 extends (1 & T) ? false : true;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _ReturnNotAny = NotAny<ReturnType<typeof camunda.createProcessInstance>> extends true ? true : never;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _ReturnCancelable = ReturnType<typeof camunda.createProcessInstance> extends CancelablePromise<any> ? true : never;

describe('type-signatures', () => {
  it('runtime smoke', () => {
    expect(typeof camunda.createProcessInstance).toBe('function');
    expect(typeof camunda.createDeployment).toBe('function');
  });
});
