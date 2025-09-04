// fp-ts adapter: create a TaskEither facade over the throwing Camunda client.
// We don't add fp-ts as a runtime dependency; user must install it. Types are imported lazily via type-only import.
// Usage:
//   import { createCamundaFpClient } from '@camunda8/orchestration-cluster';
//   const fp = createCamundaFpClient();
//   const deployTE = fp.createDeployment({ resources: [file] });
//   pipe(deployTE, TE.match(...))

import { createCamundaClient, CamundaClient, CamundaOptions } from './CamundaClient';

// Minimal TaskEither type contract so we can produce it without depending on fp-ts at runtime.
// Consumers using fp-ts proper will benefit from structural compatibility.
export interface TaskEither<E, A> { (): Promise<import('./resultClient').Result<A, E> extends { ok: true; value: A } ? A : A>; }

// Internal helper to wrap a promise-returning thunk into a TaskEither<E,A> following fp-ts semantics:
// A TaskEither is a lazy () => Promise<Either<E,A>>. We choose to re-use our Result shape and map to Either at call sites.
// For simplicity we return a Promise that resolves or rejects? Instead we resolve with value or throw? We'll implement proper Either by requiring fp-ts if available.

type Left<E> = { _tag: 'Left'; left: E };
type Right<A> = { _tag: 'Right'; right: A };
export type Either<E, A> = Left<E> | Right<A>;

const left = <E, A = never>(e: E): Either<E, A> => ({ _tag: 'Left', left: e });
const right = <E = never, A = never>(a: A): Either<E, A> => ({ _tag: 'Right', right: a });

export interface CamundaFpClient {
  inner: CamundaClient;
  // Dynamically typed operation methods will be attached via proxy
  [k: string]: any;
}

export function createCamundaFpClient(options?: CamundaOptions): CamundaFpClient {
  const base = createCamundaClient(options);

  const handler: ProxyHandler<any> = {
    get(_t, prop) {
      if (prop === 'inner') return base;
      const v = (base as any)[prop];
      if (typeof v !== 'function') return v;
      return (...args: any[]): (() => Promise<Either<unknown, any>>) => {
        return async () => {
          try {
            const result = await v.apply(base, args);
            return right(result);
          } catch (e) {
            return left(e);
          }
        };
      };
    }
  };

  return new Proxy({}, handler) as CamundaFpClient;
}

// Simple type guard helpers
export const isLeft = <E, A>(e: Either<E, A>): e is Left<E> => e._tag === 'Left';
export const isRight = <E, A>(e: Either<E, A>): e is Right<A> => e._tag === 'Right';
