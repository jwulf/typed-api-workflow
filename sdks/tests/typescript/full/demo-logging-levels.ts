// Demo script to show configurable logging levels in WithTracing
import './tracing';
import { ProcessInstanceApi, WithTracing } from '../../../generated/typescript/dist/api';

async function demoLoggingLevels() {
    console.log('=== Demo: WithTracing Configurable Logging ===\n');

    // Example API - doesn't need to actually work, just needs to be created
    const baseApi = new ProcessInstanceApi();

    console.log('1. 📝 Default logging (basic level, enabled in development):');
    const tracedApiDefault = WithTracing(baseApi);
    console.log('   - Uses environment variables: CAMUNDA_TRACE_REQUESTS and CAMUNDA_TRACE_LEVEL');
    console.log('   - Default: enableRequestLogging = NODE_ENV === "development"');
    console.log('   - Default: logLevel = "basic"\n');

    console.log('2. 🔇 No logging:');
    const tracedApiNone = WithTracing(baseApi, {
        logLevel: 'none'
    });
    console.log('   - logLevel: "none" - completely silent\n');

    console.log('3. 📋 Basic logging:');
    const tracedApiBasic = WithTracing(baseApi, {
        enableRequestLogging: true,
        logLevel: 'basic'
    });
    console.log('   - logLevel: "basic" - shows method calls with argument count\n');

    console.log('4. 🔍 Detailed logging:');
    const tracedApiDetailed = WithTracing(baseApi, {
        enableRequestLogging: true,
        logLevel: 'detailed'
    });
    console.log('   - logLevel: "detailed" - shows full request/response JSON\n');

    console.log('5. 🎛️  Custom logger:');
    const customLogger = (message: string, ...args: any[]) => {
        console.log(`[CUSTOM] ${message}`, ...args);
    };
    const tracedApiCustom = WithTracing(baseApi, {
        enableRequestLogging: true,
        logLevel: 'detailed',
        logger: customLogger
    });
    console.log('   - Custom logger function for integration with your logging system\n');

    console.log('🌍 Environment Variable Configuration:');
    console.log('   CAMUNDA_TRACE_REQUESTS=true    - Enable request logging');
    console.log('   CAMUNDA_TRACE_LEVEL=detailed   - Set log level (none|basic|detailed)');
    console.log('   NODE_ENV=development           - Auto-enables logging\n');

    console.log('✅ All logging configurations ready!');
    console.log('   Use these patterns in your application to control tracing verbosity.');
}

// Run the demo if executed directly
if (require.main === module) {
    demoLoggingLevels().catch(console.error);
}

export { demoLoggingLevels };
