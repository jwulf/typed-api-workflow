import * as opentelemetry from '@opentelemetry/api';

/**
 * Wraps an API instance with OpenTelemetry tracing
 * @param api The API instance to wrap with tracing
 * @returns A traced version of the API instance
 */
export function WithTracing<T extends object>(api: T): T {
    const tracer = opentelemetry.trace.getTracer('camunda-api-sdk');
    
    return new Proxy(api, {
        get(target, prop, receiver) {
            const original = Reflect.get(target, prop, receiver);
            
            if (typeof original === 'function') {
                return async function(...args: any[]) {
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
                                
                                const result = await original.apply(target, args);
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
            }
            
            return original;
        }
    }) as T;
}
