import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';

import { SdkDefinitions, SdkDefinition } from '../sdks';
import { SupportedSdk } from "../sdks";

export class SdkEnhancementOrchestrator {
  spec: OpenAPIV3.Document;
  sdks: SdkDefinitions;
  sdksDir: string;
  enhancementStrategies: StrategyConstructor<any>[];
  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions, sdksDir: string, strategies: StrategyConstructor<any>[]) {
    this.spec = spec;
    this.sdks = sdks;
    this.sdksDir = sdksDir;
    this.enhancementStrategies = strategies;
  }

  async enhanceAllSDKs() {
    console.log('🚀 Starting SDK enhancement pipeline...');
    console.log(`📁 SDKs: ${this.sdks}`);
    console.log('');

    try {
      for (const strategy of this.enhancementStrategies) {
        console.log(`🔧 Running enhancement strategy: ${strategy.name}`)
        const enhancer = new strategy(this.spec, this.sdks);
          if (typeof enhancer.enhanceAllSDKs !== 'function') {
          throw new Error(`Enhancement strategy ${strategy.name} does not implement enhanceAllSDKs method`);
        } 
        await enhancer.enhanceAllSDKs(this.sdksDir);
        console.log(`✅ Enhancement strategy ${strategy.name} completed`);
        console.log('');
      }

      // Step 3: Summary
      this.printSummary(this.sdksDir);

    } catch (error) {
      console.error('❌ Enhancement pipeline failed:', (error as Error).message);
      throw error;
    }
  }

  printSummary(sdksDir: string) {
    console.log('🎉 SDK Enhancement Pipeline Complete!');
    console.log('');
    console.log('✅ Enhanced Features:');
    console.log('   🏷️  Semantic types with validation');
    console.log('   📝 Eventually consistent endpoint documentation');
    console.log('');
    
    // List enhanced SDKs
    const sdkDirs = fs.readdirSync(sdksDir).filter(dir => {
      const fullPath = path.join(sdksDir, dir);
      return fs.statSync(fullPath).isDirectory() && dir !== 'tools';
    });

    if (sdkDirs.length > 0) {
      console.log('📦 Enhanced SDKs:');
      sdkDirs.forEach(sdk => {
        console.log(`   📁 ${sdk}`);
      });
    } else {
      console.log('⚠️  No SDK directories found');
    }
    
    console.log('');
    console.log('🎯 Ready for use! Check the generated files in each SDK directory.');
  }
}

type StrategyConstructor<T extends SdkEnhancementStrategy> = new (spec: OpenAPIV3.Document, sdks: SdkDefinitions) => T;

export abstract class SdkEnhancementStrategy {
    constructor(protected spec: OpenAPIV3.Document, protected sdks: SdkDefinitions) {}
    public abstract name: string;
    public abstract sdkEnhancementStrategies: Partial<{
        [K in SupportedSdk]: (sdkPath: string) => Promise<void> | void;
    }>

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
                console.warn(`SDK directory not found: ${sdkPath}`);
                continue;
            }
            if (typeof this.sdkEnhancementStrategies[sdkName] !== 'function') {
                console.warn(`No enhancement strategy found for SDK: ${sdkName}`);
                continue;
            }
            this.sdkEnhancementStrategies[sdkName].call(this, sdkPath);
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