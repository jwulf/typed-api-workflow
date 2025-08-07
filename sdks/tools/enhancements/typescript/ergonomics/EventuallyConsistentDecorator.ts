/**
 * Decorator for marking methods as eventually consistent
 */

// Type definitions for the eventually property
export interface EventuallyConsistentOptions<T> {
  timeout?: number;
  pollingInterval?: number;
  predicate?: (result: T) => boolean;
}

export type EventuallyConsistentMethod<T extends (...args: any[]) => any> = T & {
  eventually: (options?: EventuallyConsistentOptions<Awaited<ReturnType<T>>>) => ReturnType<T>;
};

// Method decorator that adds eventually consistent behavior
export function eventuallyconsistent(target: any, propertyKey: string, descriptor?: PropertyDescriptor): any {
  console.log('Decorator called on', target.constructor.name, propertyKey);
  
  // Handle case where descriptor is not provided (getter/setter or property)
  if (!descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {
      value: target[propertyKey],
      writable: true,
      enumerable: true,
      configurable: true
    };
  }

  const originalMethod = descriptor.value;
  
  if (typeof originalMethod !== 'function') {
    throw new Error(`@eventuallyconsistent can only be applied to methods, got ${typeof originalMethod}`);
  }

  // Define a property descriptor that creates bound methods for each instance
  const originalDescriptor = descriptor;
  
  return {
    get: function(this: any) {
      console.log('Getter called on instance:', this);
      const instance = this;
      
      // Create a bound method for this instance
      const boundMethod = function(...args: any[]) {
        console.log('Bound method called with args:', args);
        return originalMethod.apply(instance, args);
      };
      
      // Add eventually to the bound method
      (boundMethod as any).eventually = function(options: EventuallyConsistentOptions<any> = {}): any {
        console.log('Eventually called with bound instance:', instance);
        
        const {
          timeout = 30000,
          pollingInterval = 1000,
          predicate = defaultPredicate
        } = options;
        
        return PollingOperation({
          operation: (): any => {
            console.log('Operation called with bound instance:', instance);
            return originalMethod.apply(instance, []);
          },
          timeout,
          pollingInterval,
          predicate
        });
      };
      
      return boundMethod;
    },
    enumerable: originalDescriptor.enumerable !== false,
    configurable: originalDescriptor.configurable !== false
  };

  return descriptor;
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
