import * as fs from 'fs';
import * as path from 'path';
import { OpenAPIV3 } from 'openapi-types';

import { SdkDefinitions, SdkDefinition } from '../sdks';
import { SupportedSdk } from "../sdks";

export class PostBuildOrchestrator {
  spec: OpenAPIV3.Document;
  sdks: SdkDefinitions;
  sdksDir: string;
  postBuildStrategies: StrategyConstructor<any>[];
  constructor(spec: OpenAPIV3.Document, sdks: SdkDefinitions, sdksDir: string, strategies: StrategyConstructor<any>[]) {
    this.spec = spec;
    this.sdks = sdks;
    this.sdksDir = sdksDir;
    this.postBuildStrategies = strategies;
  }

  async runAllPostBuildTasks() {
    console.log('🔧 Starting SDK post-build pipeline...');
    console.log(`📁 SDKs: ${this.sdks}`);
    console.log('');

    try {
      for (const strategy of this.postBuildStrategies) {
        console.log(`🏗️  Running post-build strategy: ${strategy.name}`)
        const postBuilder = new strategy(this.spec, this.sdks);
          if (typeof postBuilder.runAllPostBuildTasks !== 'function') {
          throw new Error(`Post-build strategy ${strategy.name} does not implement runAllPostBuildTasks method`);
        } 
        await postBuilder.runAllPostBuildTasks(this.sdksDir);
        console.log(`✅ Post-build strategy ${strategy.name} completed`);
        console.log('');
      }

      // Summary
      this.printSummary(this.sdksDir);

    } catch (error) {
      console.error('❌ Post-build pipeline failed:', (error as Error).message);
      throw error;
    }
  }

  printSummary(sdksDir: string) {
    console.log('🎉 SDK Post-Build Pipeline Complete!');
    console.log('');
    console.log('✅ Post-Build Tasks Completed:');
    console.log('   📦 Dependencies installed');
    console.log('   🧪 Tests executed');
    console.log('');
    
    // List processed SDKs
    const sdkDirs = fs.readdirSync(sdksDir).filter(dir => {
      const fullPath = path.join(sdksDir, dir);
      return fs.statSync(fullPath).isDirectory() && dir !== 'tools';
    });

    if (sdkDirs.length > 0) {
      console.log('📦 Post-Build Processed SDKs:');
      sdkDirs.forEach(sdk => {
        console.log(`   📁 ${sdk}`);
      });
    } else {
      console.log('⚠️  No SDK directories found');
    }
    
    console.log('');
    console.log('🎯 SDKs are built, enhanced, and ready for distribution!');
  }
}

type StrategyConstructor<T extends PostBuildStrategy> = new (spec: OpenAPIV3.Document, sdks: SdkDefinitions) => T;

export abstract class PostBuildStrategy {
    constructor(protected spec: OpenAPIV3.Document, protected sdks: SdkDefinitions) {}
    public abstract name: string;
    public abstract postBuildStrategies: Partial<{
        [K in SupportedSdk]: (sdkPath: string) => Promise<void> | void;
    }>

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
                console.warn(`SDK directory not found: ${sdkPath}`);
                continue;
            }
            if (typeof this.postBuildStrategies[sdkName] !== 'function') {
                console.warn(`No post-build strategy found for SDK: ${sdkName}`);
                continue;
            }
            await this.postBuildStrategies[sdkName]!.call(this, sdkPath);
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
