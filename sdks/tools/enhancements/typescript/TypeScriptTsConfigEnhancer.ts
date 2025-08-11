import * as fs from 'fs';
import * as path from 'path';
import { FlexibleSdkEnhancementStrategy } from '../../SdkPipelineOrchestrator';
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions, SupportedSdk } from '../../sdks';

/**
 * TypeScript-specific enhancer that updates tsconfig.json configuration
 * This enhancer enables experimental decorators and other TypeScript compiler options
 * needed for enhanced SDK functionality.
 */
export class TypeScriptTsConfigEnhancer extends FlexibleSdkEnhancementStrategy {
    name = 'TypeScriptTsConfigEnhancer';

    // Only target TypeScript SDKs
    supportedSdks: SupportedSdk[] = ['typescript'];

    // Only implement TypeScript enhancement - no stubs needed for other SDKs
    sdkEnhancementStrategies = {
        typescript: this.enhanceTypeScript,
    };

    constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
        super(spec, sdks);
    }

    /**
     * Enhance TypeScript SDK by updating tsconfig.json
     */
    private async enhanceTypeScript(sdkPath: string): Promise<void> {
        console.log(`    🔧 Updating TypeScript configuration in ${sdkPath}`);

        this.updateTsConfig(sdkPath);

        console.log(`    ✅ TypeScript configuration updated successfully`);
    }

    /**
     * Update SDK tsconfig.json to enable experimental decorators and other useful compiler options
     */
    private updateTsConfig(sdkPath: string): void {
        const tsconfigPath = path.join(sdkPath, 'tsconfig.json');

        if (!fs.existsSync(tsconfigPath)) {
            console.log(`    ! TypeScript config not found: ${tsconfigPath}`);
            return;
        }

        try {
            const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
            const tsconfig = JSON.parse(tsconfigContent);

            if (!tsconfig.compilerOptions) {
                tsconfig.compilerOptions = {};
            }

            // Track what we're adding for logging
            const addedOptions: string[] = [];

            // Add decorator support if not already present
            if (!tsconfig.compilerOptions.experimentalDecorators) {
                tsconfig.compilerOptions.experimentalDecorators = true;
                addedOptions.push('experimentalDecorators');
            }

            if (!tsconfig.compilerOptions.emitDecoratorMetadata) {
                tsconfig.compilerOptions.emitDecoratorMetadata = true;
                addedOptions.push('emitDecoratorMetadata');
            }

            // Add other useful TypeScript options for SDK development
            if (!tsconfig.compilerOptions.strict) {
                tsconfig.compilerOptions.strict = true;
                addedOptions.push('strict');
            }

            if (!tsconfig.compilerOptions.skipLibCheck) {
                tsconfig.compilerOptions.skipLibCheck = true;
                addedOptions.push('skipLibCheck');
            }

            if (!tsconfig.compilerOptions.esModuleInterop) {
                tsconfig.compilerOptions.esModuleInterop = true;
                addedOptions.push('esModuleInterop');
            }

            if (!tsconfig.compilerOptions.allowSyntheticDefaultImports) {
                tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
                addedOptions.push('allowSyntheticDefaultImports');
            }

            // Keep comments for IDE documentation
            tsconfig.compilerOptions.removeComments = false;
            addedOptions.push('removeComments');


            // Only write if we made changes
            if (addedOptions.length > 0) {
                fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4), 'utf8');
                console.log(`    ✓ Updated tsconfig.json with: ${addedOptions.join(', ')}`);
            } else {
                console.log(`    → tsconfig.json already properly configured`);
            }
        } catch (error) {
            console.warn(`    ! Error updating tsconfig.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    protected getStartMessage(): string {
        return '🔧 Updating TypeScript configurations...';
    }

    protected getCompletionMessage(): string {
        return '✅ TypeScript configuration updates completed';
    }
}
