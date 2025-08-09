import * as opentelemetry from '@opentelemetry/api';

/**
 * Configuration options for WithTracing
 */
export interface TracingOptions {
    /** Enable request/response logging */
    enableRequestLogging?: boolean;
    /** Custom logger function (defaults to console.log) */
    logger?: (message: string, ...args: any[]) => void;
    /** Log level: 'none', 'basic', 'detailed' */
    logLevel?: 'none' | 'basic' | 'detailed';
}

/**
 * Default tracing configuration from environment variables
 */
const getDefaultTracingOptions = (): TracingOptions => ({
    enableRequestLogging: process.env.CAMUNDA_TRACE_REQUESTS === 'true' || process.env.NODE_ENV === 'development',
    logger: console.log,
    logLevel: (process.env.CAMUNDA_TRACE_LEVEL as TracingOptions['logLevel']) || 'basic'
});

/**
 * Wraps an API instance with OpenTelemetry tracing
 * @param api The API instance to wrap with tracing
 * @param options Optional tracing configuration
 * @returns A traced version of the API instance
 */
export function WithTracing<T extends object>(api: T, options?: TracingOptions): T {
    const tracer = opentelemetry.trace.getTracer('camunda-api-sdk');
    const config = { ...getDefaultTracingOptions(), ...options };
    
    return new Proxy(api, {
        get(target, prop, receiver) {
            const original = Reflect.get(target, prop, receiver);
            
            if (typeof original === 'function') {
                // Create the wrapped function
                const wrappedFunction = async function(...args: any[]) {
                    const spanName = `${target.constructor.name}.${String(prop)}`;
                    const span = tracer.startSpan(spanName);
                    
                    return opentelemetry.context.with(
                        opentelemetry.trace.setSpan(opentelemetry.context.active(), span),
                        async () => {
                            try {
                                // Add some useful attributes
                                span.setAttributes({
                                    'api.class': target.constructor.name,
                                    'api.method': String(prop),
                                    'api.args.count': args.length
                                });
                                
                                // Configurable request/response logging
                                if (config.enableRequestLogging && config.logLevel !== 'none') {
                                    if (config.logLevel === 'basic') {
                                        config.logger!(`🔍 ${spanName} - Called with ${args.length} arguments`);
                                    } else if (config.logLevel === 'detailed') {
                                        config.logger!(`\n🔍 ${spanName} - Request:`, JSON.stringify(args, null, 2));
                                    }
                                }
                                
                                const result = await original.apply(target, args);
                                
                                // Configurable response logging
                                if (config.enableRequestLogging && config.logLevel === 'detailed') {
                                    config.logger!(`\n🔍 ${spanName} - Response:`, JSON.stringify(result, null, 2));
                                }
                                
                                span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
                                return result;
                            } catch (error) {
                                span.recordException(error as Error);
                                span.setStatus({ 
                                    code: opentelemetry.SpanStatusCode.ERROR,
                                    message: (error as Error).message 
                                });
                                throw error;
                            } finally {
                                span.end();
                            }
                        }
                    );
                };
                
                // Preserve all properties from the original function, including .eventually
                Object.setPrototypeOf(wrappedFunction, Object.getPrototypeOf(original));
                Object.assign(wrappedFunction, original);
                
                return wrappedFunction;
            }
            
            return original;
        }
    }) as T;
}
