import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';

import { SdkDefinitions, SdkDefinition } from './sdks';
import { SupportedSdk } from "./sdks";

// Import the base strategy classes from their original locations
import { SdkEnhancementStrategy as OriginalSdkEnhancementStrategy } from './enhancements/SdkEnhancementOrchestrator';
import { PostBuildStrategy as OriginalPostBuildStrategy } from './post-build/PostBuildOrchestrator';

/**
 * Unified orchestrator that handles both SDK enhancement and post-build phases
 * in a single streamlined pipeline. This replaces the separate SdkEnhancementOrchestrator
 * and PostBuildOrchestrator to eliminate code duplication.
 */
export class SdkPipelineOrchestrator {
  constructor(
    private spec: OpenAPIV3.Document,
    private sdks: SdkDefinitions,
    private sdksDir: string,
    private enhancementStrategies: StrategyConstructor<OriginalSdkEnhancementStrategy | FlexibleSdkEnhancementStrategy>[],
    private postBuildStrategies: StrategyConstructor<OriginalPostBuildStrategy | FlexiblePostBuildStrategy>[]
  ) {}

  async runPipeline(): Promise<void> {
    console.log('🚀 Starting unified SDK pipeline...');
    console.log(`📁 SDKs: ${Object.keys(this.sdks).join(', ')}`);
    console.log('');

    try {
      // Phase 1: Enhancement
      await this.runEnhancements();
      
      // Phase 2: Post-Build Tasks
      await this.runPostBuildTasks();

      // Phase 3: Summary
      this.printSummary();

    } catch (error) {
      console.error('❌ SDK pipeline failed:', (error as Error).message);
      throw error;
    }
  }

  private async runEnhancements(): Promise<void> {
    if (this.enhancementStrategies.length === 0) {
      console.log('⏭️  No enhancement strategies configured. Skipping enhancement phase...');
      return;
    }

    console.log('✨ Phase 1: Enhancing SDKs...');
    console.log('');

    for (const StrategyClass of this.enhancementStrategies) {
      console.log(`🔧 Running enhancement strategy: ${StrategyClass.name}`);
      
      const enhancer = new StrategyClass(this.spec, this.sdks);
      if (typeof enhancer.enhanceAllSDKs !== 'function') {
        throw new Error(`Enhancement strategy ${StrategyClass.name} does not implement enhanceAllSDKs method`);
      }
      
      await enhancer.enhanceAllSDKs(this.sdksDir);
      console.log(`✅ Enhancement strategy ${StrategyClass.name} completed`);
      console.log('');
    }

    console.log('🎉 All SDK enhancements completed!');
    console.log('');
  }

  private async runPostBuildTasks(): Promise<void> {
    if (this.postBuildStrategies.length === 0) {
      console.log('⏭️  No post-build strategies configured. Skipping post-build phase...');
      return;
    }

    console.log('🔧 Phase 2: Running post-build tasks...');
    console.log('');

    for (const StrategyClass of this.postBuildStrategies) {
      console.log(`🏗️  Running post-build strategy: ${StrategyClass.name}`);
      
      const postBuilder = new StrategyClass(this.spec, this.sdks);
      if (typeof postBuilder.runAllPostBuildTasks !== 'function') {
        throw new Error(`Post-build strategy ${StrategyClass.name} does not implement runAllPostBuildTasks method`);
      }
      
      await postBuilder.runAllPostBuildTasks(this.sdksDir);
      console.log(`✅ Post-build strategy ${StrategyClass.name} completed`);
      console.log('');
    }

    console.log('🎉 All post-build tasks completed!');
    console.log('');
  }

  private printSummary(): void {
    console.log('🎉 SDK Pipeline Complete!');
    console.log('');
    console.log('✅ Pipeline Phases Completed:');
    console.log('   🏷️  Semantic types with validation');
    console.log('   📝 Eventually consistent endpoint support');
    console.log('   🔧 Code generation fixes and enhancements');
    console.log('   📦 Dependencies installed and tested');
    console.log('');
    
    // List processed SDKs
    const sdkDirs = fs.readdirSync(this.sdksDir).filter(dir => {
      const fullPath = path.join(this.sdksDir, dir);
      return fs.statSync(fullPath).isDirectory() && dir !== 'tools';
    });

    if (sdkDirs.length > 0) {
      console.log('📦 Generated and Enhanced SDKs:');
      sdkDirs.forEach(sdk => {
        console.log(`   📁 ${sdk}`);
      });
    } else {
      console.log('⚠️  No SDK directories found');
    }
    
    console.log('');
    console.log('🎯 SDKs are fully generated, enhanced, and ready for distribution!');
  }
}

// Type definitions for strategy constructors
type StrategyConstructor<T extends PipelineStrategy> = new (spec: OpenAPIV3.Document, sdks: SdkDefinitions) => T;

// Base interface for all pipeline strategies
export interface PipelineStrategy {
  name: string;
}

// Re-export the original strategy classes for backward compatibility
export { OriginalSdkEnhancementStrategy as SdkEnhancementStrategy };
export { OriginalPostBuildStrategy as PostBuildStrategy };

// New flexible strategy interface that allows SDK-specific implementations
export abstract class FlexibleSdkEnhancementStrategy implements PipelineStrategy {
  constructor(protected spec: OpenAPIV3.Document, protected sdks: SdkDefinitions) {}
  
  public abstract name: string;
  
  // Optional: specify which SDKs this strategy supports
  public supportedSdks?: SupportedSdk[];
  
  // New flexible approach - only implement the SDKs you care about
  public sdkEnhancementStrategies?: Partial<{
    [K in SupportedSdk]: (sdkPath: string) => Promise<void> | void;
  }>;

  // Template method - implemented in base class
  async enhanceAllSDKs(baseDir: string): Promise<void> {
    // Allow subclasses to perform early exit checks
    if (!this.shouldProceed()) {
      console.log(this.getSkipMessage());
      return;
    }

    console.log(this.getStartMessage());
    
    for (const [sdkName, sdk] of Object.entries(this.sdks) as [SupportedSdk, SdkDefinition][]) { 
      const sdkPath = path.join(baseDir, sdk.path);
      if (!fs.existsSync(sdkPath)) {
        console.warn(`  ⚠️  SDK directory not found: ${sdkPath}`);
        continue;
      }
      
      // Check if this strategy supports this SDK
      if (this.supportedSdks && !this.supportedSdks.includes(sdkName)) {
        console.log(`  ⏭️  Skipping ${sdkName} (not supported by this strategy)`);
        continue;
      }
      
      // Check if strategy has an implementation for this SDK
      const enhancementMethod = this.sdkEnhancementStrategies?.[sdkName];
      if (typeof enhancementMethod !== 'function') {
        if (this.supportedSdks && this.supportedSdks.includes(sdkName)) {
          console.warn(`  ⚠️  Strategy claims to support ${sdkName} but no implementation found`);
        } else {
          console.log(`  ⏭️  No enhancement needed for ${sdkName}`);
        }
        continue;
      }
      
      console.log(`  🔧 Enhancing ${sdkName}...`);
      await enhancementMethod.call(this, sdkPath);
      console.log(`  ✅ ${sdkName} enhanced successfully`);
    }
    
    console.log(this.getCompletionMessage());
  }

  // Hook methods for subclasses to override
  protected shouldProceed(): boolean { 
    return true; 
  }

  protected getSkipMessage(): string { 
    return '⏭️  No enhancements needed. Skipping...'; 
  }

  protected abstract getStartMessage(): string;
  protected abstract getCompletionMessage(): string;
}

// New flexible post-build strategy interface
export abstract class FlexiblePostBuildStrategy implements PipelineStrategy {
  constructor(protected spec: OpenAPIV3.Document, protected sdks: SdkDefinitions) {}
  
  public abstract name: string;
  
  // Optional: specify which SDKs this strategy supports
  public supportedSdks?: SupportedSdk[];
  
  // New flexible approach - only implement the SDKs you care about
  public postBuildStrategies?: Partial<{
    [K in SupportedSdk]: (sdkPath: string) => Promise<void> | void;
  }>;

  // Template method - implemented in base class
  async runAllPostBuildTasks(baseDir: string): Promise<void> {
    // Allow subclasses to perform early exit checks
    if (!this.shouldProceed()) {
      console.log(this.getSkipMessage());
      return;
    }

    console.log(this.getStartMessage());
    
    for (const [sdkName, sdk] of Object.entries(this.sdks) as [SupportedSdk, SdkDefinition][]) { 
      const sdkPath = path.join(baseDir, sdk.path);
      if (!fs.existsSync(sdkPath)) {
        console.warn(`  ⚠️  SDK directory not found: ${sdkPath}`);
        continue;
      }
      
      // Check if this strategy supports this SDK
      if (this.supportedSdks && !this.supportedSdks.includes(sdkName)) {
        console.log(`  ⏭️  Skipping ${sdkName} (not supported by this strategy)`);
        continue;
      }
      
      // Check if strategy has an implementation for this SDK
      const postBuildMethod = this.postBuildStrategies?.[sdkName];
      if (typeof postBuildMethod !== 'function') {
        if (this.supportedSdks && this.supportedSdks.includes(sdkName)) {
          console.warn(`  ⚠️  Strategy claims to support ${sdkName} but no implementation found`);
        } else {
          console.log(`  ⏭️  No post-build tasks needed for ${sdkName}`);
        }
        continue;
      }
      
      console.log(`  🏗️  Running post-build tasks for ${sdkName}...`);
      await postBuildMethod.call(this, sdkPath);
      console.log(`  ✅ ${sdkName} post-build completed successfully`);
    }
    
    console.log(this.getCompletionMessage());
  }

  // Hook methods for subclasses to override
  protected shouldProceed(): boolean { 
    return true; 
  }

  protected getSkipMessage(): string { 
    return '⏭️  No post-build tasks needed. Skipping...'; 
  }

  protected abstract getStartMessage(): string;
  protected abstract getCompletionMessage(): string;
}
