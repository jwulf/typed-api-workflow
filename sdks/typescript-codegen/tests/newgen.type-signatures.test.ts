import { describe, it, expect } from 'vitest';
import * as newgen from '../src/gen';
import type { CancelablePromise } from '../src/gen/core/CancelablePromise';
import type { CreateProcessInstanceResponse, CreateProcessInstanceData } from '../src/gen/types.gen';

// Type utility helpers
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Equal<A,B> = (<T>()=> T extends A ? 1:2) extends (<T>()=> T extends B ? 1:2) ? ((<T>()=> T extends B ? 1:2) extends (<T>()=> T extends A ? 1:2) ? true : false) : false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Expect<T extends true> = T;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NotAny<T> = 0 extends (1 & T) ? false : true;

// Return type check (compile-time only)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateProcessInstanceReturn = Expect<Equal<ReturnType<typeof newgen.createProcessInstance>, CancelablePromise<CreateProcessInstanceResponse>>>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateProcessInstanceNotAny = Expect<NotAny<ReturnType<typeof newgen.createProcessInstance>>>;
// Param type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _CreateProcessInstanceParam = Expect<Equal<Parameters<typeof newgen.createProcessInstance>[0], CreateProcessInstanceData>>;

describe('newgen type-signatures', () => {
  it('runtime smoke', () => {
    expect(typeof newgen.createProcessInstance).toBe('function');
  });
});
