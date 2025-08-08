import * as fs from 'fs';
import * as path from 'path';

export class TypeScriptTracingEnhancer {
    name = 'TypeScriptTracingEnhancer';
    private sdkPath: string;
    private apiPath: string;
    private packageJsonPath: string;

    constructor(sdkPath: string) {
        this.sdkPath = sdkPath;
        this.apiPath = path.join(sdkPath, 'api.ts');
        this.packageJsonPath = path.join(sdkPath, 'package.json');
    }

    enhance() {
        console.log('Adding OpenTelemetry tracing support to TypeScript SDK...');
        
        this.addTracingDependencies();
        this.addTracingErgonomics();
        this.updateApiExports();
        
        console.log('✅ OpenTelemetry tracing support added successfully');
    }

    private addTracingDependencies() {
        console.log('Adding OpenTelemetry dependencies...');
        
        const packageJsonContent = fs.readFileSync(this.packageJsonPath, 'utf8');
        const packageJson = JSON.parse(packageJsonContent);
        
        if (!packageJson.dependencies) {
            packageJson.dependencies = {};
        }
        
        // Add OpenTelemetry dependencies
        packageJson.dependencies['@opentelemetry/api'] = '^1.7.0';
        
        fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log('✅ Added @opentelemetry/api dependency');
    }

    private addTracingErgonomics() {
        console.log('Adding WithTracing ergonomics...');
        
        // Copy the WithTracing.ts file to the SDK
        const ergonomicsSourcePath = path.join(__dirname, '../../../ergonomics/typescript/WithTracing.ts');
        const tracingDestPath = path.join(this.sdkPath, 'WithTracing.ts');
        
        if (fs.existsSync(ergonomicsSourcePath)) {
            fs.copyFileSync(ergonomicsSourcePath, tracingDestPath);
            console.log('✅ Copied WithTracing.ts to SDK');
        } else {
            console.warn('⚠️  WithTracing.ts source file not found, creating inline...');
            this.createWithTracingInline();
        }
    }

    private createWithTracingInline() {
        const tracingCode = `import * as opentelemetry from '@opentelemetry/api';

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
                    const spanName = \`\${target.constructor.name}.\${String(prop)}\`;
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
}`;

        const tracingDestPath = path.join(this.sdkPath, 'WithTracing.ts');
        fs.writeFileSync(tracingDestPath, tracingCode);
    }

    private updateApiExports() {
        console.log('Updating exports to include WithTracing...');
        
        const apiContent = fs.readFileSync(this.apiPath, 'utf8');
        
        // Check if WithTracing import and export already exist
        if (!apiContent.includes('export { WithTracing }') && !apiContent.includes('export * from \'./WithTracing\'')) {
            // Add export for WithTracing
            const exportLine = 'export { WithTracing } from \'./WithTracing\';';
            const updatedContent = apiContent + '\n' + exportLine + '\n';
            fs.writeFileSync(this.apiPath, updatedContent);
            console.log('✅ Added WithTracing to exports');
        } else {
            console.log('✅ WithTracing already exported');
        }
    }
}
