#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SemanticTypeEnhancer } = require('./enhance-semantic-types');
const { EventuallyConsistentEnhancer } = require('./enhance-eventually-consistent');

class SDKEnhancementOrchestrator {
  constructor(specPath) {
    this.specPath = specPath;
    
    if (!fs.existsSync(specPath)) {
      throw new Error(`Spec file not found: ${specPath}`);
    }
  }

  async enhanceAllSDKs(sdksDir) {
    if (!fs.existsSync(sdksDir)) {
      throw new Error(`SDKs directory not found: ${sdksDir}`);
    }

    console.log('🚀 Starting SDK enhancement pipeline...');
    console.log(`📄 Spec: ${this.specPath}`);
    console.log(`📁 SDKs: ${sdksDir}`);
    console.log('');

    try {
      // Step 1: Enhance with semantic types
      console.log('🏷️  STEP 1: Adding semantic types...');
      const semanticEnhancer = new SemanticTypeEnhancer(this.specPath);
      semanticEnhancer.enhanceAllSDKs(sdksDir);
      console.log('');

      // Step 2: Add eventually consistent documentation
      console.log('📝 STEP 2: Adding eventually consistent documentation...');
      const eventuallyConsistentEnhancer = new EventuallyConsistentEnhancer(this.specPath);
      eventuallyConsistentEnhancer.enhanceAllSDKs(sdksDir);
      console.log('');

      // Step 3: Summary
      this.printSummary(sdksDir);

    } catch (error) {
      console.error('❌ Enhancement pipeline failed:', error.message);
      throw error;
    }
  }

  printSummary(sdksDir) {
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

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node enhance-all-sdks.js <spec-file> <sdks-directory>');
    console.log('Example: node enhance-all-sdks.js rest-api.domain.yaml ./sdks');
    console.log('');
    console.log('This script runs both enhancement pipelines:');
    console.log('  1. Semantic type enhancement');
    console.log('  2. Eventually consistent documentation');
    process.exit(1);
  }
  
  let [specFile, sdksDir] = args;
  
  // Handle relative paths
  if (!path.isAbsolute(specFile)) {
    specFile = path.resolve(process.cwd(), specFile);
  }
  if (!path.isAbsolute(sdksDir)) {
    sdksDir = path.resolve(process.cwd(), sdksDir);
  }
  
  const orchestrator = new SDKEnhancementOrchestrator(specFile);
  
  orchestrator.enhanceAllSDKs(sdksDir)
    .then(() => {
      console.log('✅ All enhancements completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Enhancement failed:', error.message);
      process.exit(1);
    });
}
