/**
 * Decorator for marking methods as eventually consistent
 */

// Type definitions for the eventually property
export interface EventuallyConsistentOptions<T> {
	/* Timeout for this operation in milliseconds */
  timeout?: number;
	/** How often should we poll? Defaults to 500ms */
  pollingInterval?: number;
  /** An optional predicate to match the result */
  predicate?: (result: T) => boolean;
}

/**
 * Deal with eventual consistency of the data store by polling until we get results, or reach a timeout.
 */
export type EventuallyConsistentMethod<T extends (...args: any[]) => any> = {
  eventually: (...args: [...Parameters<T>, EventuallyConsistentOptions<Awaited<ReturnType<T>>>?]) => ReturnType<T>;
};

// Method decorator that adds eventually consistent behavior
export function eventuallyconsistent<T extends (...args: any[]) => any>(
  target: any, 
  propertyKey: string, 
  descriptor: TypedPropertyDescriptor<T>
): any {  
  const originalMethod = descriptor.value;
  
  if (typeof originalMethod !== 'function') {
    throw new Error(`@eventuallyconsistent can only be applied to methods, got ${typeof originalMethod}`);
  }

  // Return a property descriptor that creates bound methods for each instance
  return {
    get: function(this: any): T {
      const instance = this;
      
      // Create a bound method for this instance
      const boundMethod = function(...args: any[]) {
        return originalMethod.apply(instance, args);
      } as T;
      
      // Add eventually to the bound method
      (boundMethod as any).eventually = function(...args: any[]): any {
        // Extract eventually options from last parameter if it's an options object
        const lastArg = args[args.length - 1];
        const isEventuallyOptions = lastArg && typeof lastArg === 'object' && 
          (lastArg.timeout !== undefined || lastArg.pollingInterval !== undefined || lastArg.predicate !== undefined);
        
        const methodArgs = isEventuallyOptions ? args.slice(0, -1) : args;
        const eventuallyOptions = isEventuallyOptions ? lastArg : {};
        
        const {
          timeout = 30000,
          pollingInterval = 1000,
          predicate = defaultPredicate
        } = eventuallyOptions;
        
        return PollingOperation({
          operation: (): any => {
            return originalMethod.apply(instance, methodArgs);
          },
          timeout,
          pollingInterval,
          predicate
        });
      };
      
      return boundMethod as T;
    },
    enumerable: descriptor.enumerable !== false,
    configurable: descriptor.configurable !== false
  };
}

function defaultPredicate<T extends { items: Array<unknown> }>(
	result: T
): boolean {
	return result.items?.length > 0;
}

interface PollingOperationOptionsBase<T> {
	operation: () => Promise<T>
	/** how often to poll in ms - defaults to 1000 */
	pollingInterval?: number
	/** when to timeout - defaults to 30000 */
	timeout?: number
}

interface PollingOperationOptionsWithPredicate<T>
	extends PollingOperationOptionsBase<T> {
	/** predicate to check if the result is valid */
	predicate: (result: T) => boolean
}

interface PollingOperationOptionsWithoutPredicate<
	T extends { items: Array<unknown> },
> extends PollingOperationOptionsBase<T> {
	/** predicate to check if the result is valid - optional when T has items array */
	predicate?: (result: T) => boolean
}

class PredicateError<T> extends Error {
	result: T | null
	constructor(message: string) {
		super(message)
		this.name = 'PredicateError'
		// Ensure the prototype chain is correctly set up
		Object.setPrototypeOf(this, PredicateError.prototype)
		this.result = null
	}
}
/**
 * Poll for a result of an operation until it returns an awaited result or times out.
 * This is useful for operations that may take some time to complete, such as waiting for a process instance to finish or data to propagate to query indices.
 * Takes an optional prediicate function to determine if the result is the awaited one. By default, it checks if the result is not null or undefined and has at least one item in the `items` array.
 * @param options options for the polling operation
 * @returns either the result of the operation or an error if the operation times out. If results were returned, but the predicate was not met, a PredicateError is thrown.
 * Otherwise, the failure is propagated as an error.
 * @example
 * ```ts
 * // Wait for a process instance to appear in the search results
 * const elementInstances = await PollingOperation({
 *   operation: () =>
 *     c8.searchElementInstances({
 *	     sort: [{ field: 'processInstanceKey' }],
 *       filter: {
 *         processInstanceKey: processInstance.processInstanceKey,
 *         type: 'SERVICE_TASK',
 *       },
 *   }),
 *   interval: 500,
 *   timeout: 10000,
 * })
 *
 * // If the operation does not return an object with an `items` array (ie: a v1 API), you need to provide a predicate function to check if the result is the awaited one.
 * const process = await PollingOperation({
 *   operation: () => c.getProcessInstance(p.processInstanceKey),
 *   predicate: (res) => res.key === p.processInstanceKey,
 *   interval: 500,
 *   timeout: 15000,
 * })
 *```
 */
 function PollingOperation<T extends { items: Array<unknown> }>(
	options: PollingOperationOptionsWithoutPredicate<T>
): Promise<T>
 function PollingOperation<T>(
	options: PollingOperationOptionsWithPredicate<T>
): Promise<T>
 function PollingOperation<T>(
	options:
		| PollingOperationOptionsWithPredicate<T>
		| PollingOperationOptionsWithoutPredicate<T & { items: Array<unknown> }>
): Promise<T> {
	const pollingInterval = options.pollingInterval || 1000
	const timeout = options.timeout || 30000
	const operation = options.operation
	// Use default predicate if no predicate provided, otherwise use provided predicate
	const predicate =
		options.predicate || (defaultPredicate as (result: T) => boolean)
	return new Promise((resolve, reject) => {
		const startTime = Date.now()

		const poll = async () => {
			try {
				const result = await operation()
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				if (!predicate(result as any)) {
					const error = new PredicateError<T>('Predicate did not match')
					error.result = result
					throw error
				}
				resolve(result)
			} catch (error) {
				if (Date.now() - startTime < timeout) {
					setTimeout(poll, pollingInterval)
				} else {
					reject(error)
				}
			}
		}

		poll()
	})
}
