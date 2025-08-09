// tracing.ts - OpenTelemetry setup for the test application
import { NodeSDK } from '@opentelemetry/sdk-node';
import { trace } from '@opentelemetry/api';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Check if tracing is enabled via environment variable
const TRACING_ENABLED = process.env.OTEL_TRACING_ENABLED !== 'false';

let sdk: NodeSDK | null = null;

if (TRACING_ENABLED) {
    // Initialize OpenTelemetry SDK
    sdk = new NodeSDK({
        // Configure tracing to output to console for demo
        spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
        instrumentations: [], // We're manually instrumenting, not using auto-instrumentation
    });

    // Start the SDK
    sdk.start();

    console.log('🔍 OpenTelemetry tracing initialized');
} else {
    console.log('🔍 OpenTelemetry tracing disabled (OTEL_TRACING_ENABLED=false)');
}

// Export the configured tracer for our application
export const tracer = trace.getTracer('camunda-api-test', '1.0.0');

// Graceful shutdown
process.on('SIGTERM', () => {
    if (sdk) {
        sdk.shutdown()
            .then(() => console.log('🔍 OpenTelemetry tracing terminated'))
            .catch((error) => console.log('Error terminating OpenTelemetry SDK', error))
            .finally(() => process.exit(0));
    } else {
        process.exit(0);
    }
});
