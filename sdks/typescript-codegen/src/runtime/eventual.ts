import { CancelablePromise, CancelError } from '../gen/core/CancelablePromise';
import { ApiError } from '../gen/core/ApiError';
import { EventualConsistencyTimeoutError } from './errors';
import { getLogger } from './logger';
import { hydrateConfig } from './unifiedConfiguration';

const log = () => getLogger('eventual');

export interface ConsistencyOptions<T> {
  waitUpToMs: number;
  pollIntervalMs?: number; // user provided
  predicate?: (result: T) => boolean | Promise<boolean>;
  onAttempt?: (info: { attempt: number; elapsedMs: number; remainingMs: number; status?: number; predicateResult?: boolean; nextDelayMs?: number }) => void;
  onComplete?: (info: { attempts: number; elapsedMs: number }) => void;
  abortSignal?: AbortSignal;
}

// Internal union shape (reserved for potential future use when refactoring invoke handling)
type PollInvokeResult<T> = { kind: 'success'; value: T; status?: number } | { kind: 'error'; error: any; status?: number };

function now() { return Date.now(); }

function computeNextDelay(base: number, attempt: number, lastError?: any): number {
  if (lastError instanceof ApiError && lastError.status === 429) {
    // 429 backoff handled outside via provided delay
    return base;
  }
  return base;
}

export function eventualPoll<T>(operationId: string, isGet: boolean, invoke: () => CancelablePromise<T>, options: ConsistencyOptions<T>): CancelablePromise<T> {
  const { waitUpToMs, predicate, onAttempt, onComplete, abortSignal } = options;
  const pollDefaultMs = hydrateConfig().config.eventual?.pollDefaultMs || 500;
  const userInterval = options.pollIntervalMs;
  const baseInterval = userInterval != null ? userInterval : pollDefaultMs;
  let pollInterval = Math.max(10, baseInterval); // floor 10ms
  if (waitUpToMs === 0) {
    // Single fire; still invoke predicate if provided? spec: immediate result
    return invoke();
  }
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    let cancelled = false;
    let attempts = 0;
    const started = now();
    let lastStatus: number | undefined;
    let inFlight: CancelablePromise<T> | undefined;

    const abortHandler = () => {
      if (!cancelled) {
        cancelled = true;
        inFlight?.cancel();
        reject(new CancelError('Request aborted'));
      }
    };
    if (abortSignal) {
      if (abortSignal.aborted) return abortHandler();
      abortSignal.addEventListener('abort', abortHandler);
      onCancel(() => abortSignal.removeEventListener('abort', abortHandler));
    }

    onCancel(() => abortHandler());

    const abortStatusesImmediate = new Set([400,401,403,409,422]);

    const loop = () => {
      if (cancelled) return;
      attempts++;
      inFlight = invoke();
      onCancel(() => (inFlight as any)?.cancel?.());
      inFlight.then(async (res: any) => {
        if (cancelled) return;
        lastStatus = 200; // success assumed
        let predOk = true;
        if (predicate) {
          try { predOk = await predicate(res); } catch (e) { reject(e); return; }
        } else if (!isGet) {
          // default predicate for searches with items
          if (res && typeof res === 'object' && Array.isArray((res as any).items)) {
            predOk = (res as any).items.length > 0;
          }
        }
        const elapsed = now() - started;
        const remaining = waitUpToMs - elapsed;
        if (predOk) {
          onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status: 200, predicateResult: predOk, nextDelayMs: 0 });
          onComplete?.({ attempts, elapsedMs: elapsed });
          resolve(res);
          return;
        }
        if (remaining <= 0) {
          reject(new EventualConsistencyTimeoutError({ attempts, elapsedMs: elapsed, lastStatus: 200, lastResponse: res, operationId }));
          return;
        }
        const nextDelay = Math.min(pollInterval, remaining);
        onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status: 200, predicateResult: predOk, nextDelayMs: nextDelay });
        log().debug?.(`[eventual] op=${operationId} attempt=${attempts} status=200 predicate=false nextDelay=${nextDelay}ms remaining=${remaining}`);
        setTimeout(loop, nextDelay);
      }).catch((err: any) => {
        if (cancelled) return;
        let status: number | undefined = err?.status;
        lastStatus = status;
        const elapsed = now() - started;
        const remaining = waitUpToMs - elapsed;
        if (status === 404 && isGet && remaining > 0) {
          const nextDelay = Math.min(pollInterval, remaining);
          onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status, predicateResult: false, nextDelayMs: nextDelay });
          log().debug?.(`[eventual] op=${operationId} attempt=${attempts} status=404 retry nextDelay=${nextDelay}`);
          setTimeout(loop, nextDelay); return;
        }
        if (status === 429 && remaining > 0) {
            let delay = pollInterval * 2; // exponential baseline
            const ra = err?.body?.['retryAfter'] || err?.body?.['Retry-After'];
            if (ra) {
              const parsed = parseInt(ra, 10);
              if (!isNaN(parsed)) delay = parsed * (parsed < 1000 ? 1000 : 1); // if seconds convert
            }
            delay = Math.min(delay, pollInterval * 5, 2000, remaining);
            const jitter = 0.9 + Math.random() * 0.2;
            delay = Math.floor(delay * jitter);
            onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status, predicateResult: false, nextDelayMs: delay });
            log().debug?.(`[eventual] op=${operationId} attempt=${attempts} status=429 backoff delay=${delay}`);
            setTimeout(loop, delay); return;
        }
        if (status === 503 && remaining > 0) {
          // 503 retry similar to normal predicate failure
          const nextDelay = Math.min(pollInterval, remaining);
          onAttempt?.({ attempt: attempts, elapsedMs: elapsed, remainingMs: Math.max(0, remaining), status, predicateResult: false, nextDelayMs: nextDelay });
          log().debug?.(`[eventual] op=${operationId} attempt=${attempts} status=503 retry nextDelay=${nextDelay}`);
          setTimeout(loop, nextDelay); return;
        }
        if (abortStatusesImmediate.has(status!)) {
          reject(err); return;
        }
        // Non-retryable or no time left
        if (remaining <= 0) {
          if (waitUpToMs > 0) {
            reject(new EventualConsistencyTimeoutError({ attempts, elapsedMs: elapsed, lastStatus: status, lastResponse: err?.body, operationId }));
          } else reject(err);
          return;
        }
        reject(err);
      });
    };

    loop();
  });
}
