import { FlexibleSdkEnhancementStrategy } from '../../SdkPipelineOrchestrator';
import { OpenAPIV3 } from 'openapi-types';
import { SdkDefinitions, SupportedSdk } from '../../sdks';

/**
 * Example of a TypeScript-only enhancement strategy using the new flexible interface.
 * This strategy only needs to implement TypeScript enhancements and doesn't need
 * to provide stubs for other SDKs.
 */
export class TypeScriptOnlyExampleStrategy extends FlexibleSdkEnhancementStrategy {
  name = 'typescript-only-example-strategy';
  
  // Explicitly declare which SDKs this strategy supports
  supportedSdks: SupportedSdk[] = ['typescript'];
  
  // Only implement the SDKs you care about - no stubs needed!
  sdkEnhancementStrategies = {
    typescript: this.enhanceTypeScript,
  };

  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions) {
    super(spec, sdks);
  }

  private async enhanceTypeScript(sdkPath: string): Promise<void> {
    console.log(`    🎯 Running TypeScript-specific enhancements in ${sdkPath}`);
    
    // Your TypeScript-specific enhancement logic here
    // For example:
    // - Fix TypeScript-specific code generation issues
    // - Add TypeScript-specific utilities
    // - Enhance TypeScript type definitions
    
    console.log(`    ✨ TypeScript enhancements completed`);
  }

  protected getStartMessage(): string {
    return '🔧 Starting TypeScript-only enhancements...';
  }

  protected getCompletionMessage(): string {
    return '✅ TypeScript-only enhancements completed';
  }
}
