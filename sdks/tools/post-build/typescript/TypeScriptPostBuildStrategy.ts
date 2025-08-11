import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';
import { execSync } from 'child_process';
import { PostBuildStrategy } from '../../SdkPipelineOrchestrator';
import { SdkDefinitions } from '../../sdks';

/**
 * Handles post-build tasks for TypeScript SDKs:
 * 1. Install npm dependencies
 * 2. Run TypeScript compilation to verify generated code
 * 3. Run tests if available
 */
export class TypeScriptPostBuildStrategy extends PostBuildStrategy {
    name = 'typescript-post-build';
    postBuildStrategies = {
        typescript: this.runPostBuildForSdk,
    }

    constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
        super(spec, sdks);
    }

    private async runPostBuildForSdk(sdkPath: string): Promise<void> {
        const sdkName = 'typescript'; // We know this is TypeScript
        console.log(`🔨 Running TypeScript post-build tasks for ${sdkName}...`);
        
        const packageJsonPath = path.join(sdkPath, 'package.json');
        
        try {
            // Check if package.json exists
            if (!fs.existsSync(packageJsonPath)) {
                throw new Error(`package.json not found at ${packageJsonPath}`);
            }
            
            // Install dependencies
            console.log('  📦 Installing dependencies...');
            execSync('npm install', { 
                cwd: sdkPath, 
                stdio: 'pipe'
            });
            console.log('  ✓ Dependencies installed successfully');
            
            // Read package.json to check available scripts
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            
            // Run build if available
            if (packageJson.scripts?.build) {
                console.log('  🔨 Compiling TypeScript...');
                execSync('npm run build', { 
                    cwd: sdkPath, 
                    stdio: 'pipe'
                });
                console.log('  ✓ TypeScript compilation successful');
            }
            
            // Run acceptance tests from the tests directory
            const testsPath = path.resolve(sdkPath, '../../tests/typescript');
            if (fs.existsSync(testsPath)) {
                console.log('  🧪 Running acceptance tests...');
                execSync('npm test', { 
                    cwd: testsPath, 
                    stdio: 'pipe'
                });
                console.log('  ✓ Acceptance tests passed successfully');
            }
            
        } catch (error: any) {
            const errorMessage = error.message || 'Unknown error';
            const stdout = error.stdout ? error.stdout.toString() : '';
            const stderr = error.stderr ? error.stderr.toString() : '';
            
            throw new Error(`TypeScript post-build failed: ${errorMessage}
STDOUT: ${stdout}
STDERR: ${stderr}`);
        }
    }

    protected getStartMessage(): string {
        return '🏗️  Running TypeScript post-build tasks...';
    }

    protected getCompletionMessage(): string {
        return '✅ TypeScript post-build tasks completed successfully!';
    }
}
