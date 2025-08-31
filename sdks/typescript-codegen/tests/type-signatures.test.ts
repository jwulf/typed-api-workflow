import { describe, it, expect } from 'vitest';
import camunda from '../src';
import type { CancelablePromise } from '../src/gen/core/CancelablePromise';
import type { CreateProcessInstanceResult } from '../src/gen/models/CreateProcessInstanceResult';
import type { DeploymentResult } from '../src/gen/models/DeploymentResult';
import type { ProcessInstanceCreationInstruction } from '../src/gen/models/ProcessInstanceCreationInstruction';
import type { EvaluateDecisionResult } from '../src/gen/models/EvaluateDecisionResult';
import type { UserSearchResult } from '../src/gen/models/UserSearchResult';
import type { UserSearchQueryRequest } from '../src/gen/models/UserSearchQueryRequest';

// Simple type-level helpers
// Equal / Expect from TS utility patterns
// (No runtime output; if these types fail to compile, the test suite fails.)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? (<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2)
    ? true
    : false
  : false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Expect<T extends true> = T;
// Detect any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NotAny<T> = 0 extends (1 & T) ? false : true;

// createProcessInstance return type assertion
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateProcessInstanceReturn = Expect<
  Equal<ReturnType<typeof camunda.createProcessInstance>, CancelablePromise<CreateProcessInstanceResult>>
>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateProcessInstanceNotAny = Expect<NotAny<ReturnType<typeof camunda.createProcessInstance>>>;

// createProcessInstance param shape (single consolidated signature currently)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateProcessInstanceParam = Expect<
  Equal<Parameters<typeof camunda.createProcessInstance>[0], { requestBody: ProcessInstanceCreationInstruction }>
>;

// createDeployment return type assertion
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateDeploymentReturn = Expect<
  Equal<ReturnType<typeof camunda.createDeployment>, CancelablePromise<DeploymentResult>>
>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateDeploymentNotAny = Expect<NotAny<ReturnType<typeof camunda.createDeployment>>>;

// evaluateDecision return type assertion
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _EvaluateDecisionReturn = Expect<
  Equal<ReturnType<typeof camunda.evaluateDecision>, CancelablePromise<EvaluateDecisionResult>>
>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _EvaluateDecisionNotAny = Expect<NotAny<ReturnType<typeof camunda.evaluateDecision>>>;

// searchUsers overload unification: parameter is a discriminated union of page strategies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _SearchUsersReturn = Expect<
  Equal<ReturnType<typeof camunda.searchUsers>, CancelablePromise<UserSearchResult>>
>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _SearchUsersNotAny = Expect<NotAny<ReturnType<typeof camunda.searchUsers>>>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _SearchUsersParam = Expect<NotAny<Parameters<typeof camunda.searchUsers>[0]>>;

// Lightweight runtime smoke just to keep Vitest counting a test file
describe('type-signatures', () => {
  it('runtime smoke', () => {
    expect(typeof camunda.createProcessInstance).toBe('function');
    expect(typeof camunda.createDeployment).toBe('function');
  });
});
