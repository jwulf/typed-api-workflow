import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';

import { execSync } from 'child_process';
import { SdkDefinition, sdks, SupportedSdk } from './sdks';

import { SdkEnhancementOrchestrator } from './enhancements/SdkEnhancementOrchestrator';
import { SemanticTypeEnhancer } from './enhancements/SemanticTypeEnhancer';
import { EventuallyConsistentEnhancer } from './enhancements/EventuallyConsistentEnhancer';
import { TypeScriptPolymorphicSchemaEnhancer } from './enhancements/typescript/TypeScriptPolymorphicSchemaEnhancer';

import { PostBuildOrchestrator } from './post-build/PostBuildOrchestrator';
import { TypeScriptPostBuildStrategy } from './post-build/typescript/TypeScriptPostBuildStrategy';

// Custom post-processing of generated SDKs
const enhancementStrategies = [
  SemanticTypeEnhancer, // Enhance semantic types with validation
  EventuallyConsistentEnhancer, // Enhance eventually consistent operations
  TypeScriptPolymorphicSchemaEnhancer, // Fix TypeScript code generation issues
]

// Post-build tasks for generated SDKs
const postBuildStrategies = [
  TypeScriptPostBuildStrategy, // Install deps, compile, and test TypeScript SDKs
]

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message: string, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function detectPaths() {
    let specFile, sdksDir, toolsDir;
    
    // Check if running from root directory
    if (fs.existsSync('rest-api.domain.yaml')) {
        // Running from root via npm script
        specFile = 'rest-api.domain.yaml';
        sdksDir = './sdks/generated';
        toolsDir = './sdks/tools';
    } else if (fs.existsSync('../../rest-api.domain.yaml')) {
        // Running directly from tools directory
        specFile = '../../rest-api.domain.yaml';
        sdksDir = '../generated';
        toolsDir = '.';
    } else {
        log('❌ Error: Cannot find rest-api.domain.yaml', colors.red);
        log('Run this script from project root (via npm run build:sdks) or from sdks/tools directory');
        process.exit(1);
    }
    
    return { specFile, sdksDir, toolsDir };
}

function checkSpecFile(specFile: string) {
    if (!fs.existsSync(specFile)) {
        log(`❌ Error: Spec file not found: ${specFile}`, colors.red);
        process.exit(1);
    }
}

function createSdksDirectory(sdksDir: string) {
    if (!fs.existsSync(sdksDir)) {
        fs.mkdirSync(sdksDir, { recursive: true });
    }
}

function generateSdk(specFile: string, generator: string, outputDir: string, sdksDir: string, additionalProps: string | null = null) {
    log(`🔨 Generating ${generator} SDK...`, colors.blue);
    
    const outputPath = path.join(sdksDir, outputDir);
    
    let command = [
        'openapi-generator-cli generate',
        `-i "${specFile}"`,
        `-g "${generator}"`,
        `-o "${outputPath}"`,
        '--skip-validate-spec'
    ];
    
    if (additionalProps) {
        command.splice(-1, 0, `--additional-properties="${additionalProps}"`);
    }
    
    const fullCommand = command.join(' ');
    
    try {
        execSync(fullCommand, { stdio: 'inherit' });
        log(`✅ ${generator} SDK generated successfully`, colors.green);
    } catch (error) {
        log(`❌ Failed to generate ${generator} SDK`, colors.red);
        process.exit(1);
    }
}

async function enhanceSDKs(spec: OpenAPIV3.Document, sdksDir: string) {
    log('✨ Enhancing SDKs...', colors.cyan);
    
    try {
        const orchestrator = new SdkEnhancementOrchestrator(spec, sdks, sdksDir, enhancementStrategies);
        await orchestrator.enhanceAllSDKs();

        log('🎉 All SDKs enhanced!', colors.green);
    } catch (error) {
        log('❌ Failed to enhance SDKs', colors.red);
        process.exit(1);
    }
}

async function runPostBuildTasks(spec: OpenAPIV3.Document, sdksDir: string) {
    log('🔧 Running post-build tasks...', colors.cyan);
    
    try {
        const orchestrator = new PostBuildOrchestrator(spec, sdks, sdksDir, postBuildStrategies);
        await orchestrator.runAllPostBuildTasks();

        log('🎉 All post-build tasks completed!', colors.green);
    } catch (error) {
        log('❌ Failed to run post-build tasks', colors.red);
        process.exit(1);
    }
}

async function main() {
    // Detect paths
    const { specFile, sdksDir } = detectPaths();
    
    log('🚀 Generating all SDKs from ' + specFile, colors.cyan);
    log('📁 Output directory: ' + sdksDir, colors.blue);
    log('');
    
    // Check if spec file exists
    checkSpecFile(specFile);
    
    // Create SDKs directory
    createSdksDirectory(sdksDir);

    for (const [, sdk] of Object.entries(sdks) as [SupportedSdk, SdkDefinition][]) { 
        log(`🔨 Generating ${sdk.name} SDK...`, colors.blue);
    
        // Generate SDK
        generateSdk(
            specFile,
            sdk.generator,
            sdk.path,
            sdksDir,
            sdk.generatorOptions
        );
    }
    log('');
    log('🎯 All SDKs generated successfully!', colors.green);
    log('');
    
    const spec = yaml.load(fs.readFileSync(specFile, 'utf8')) as OpenAPIV3.Document;
    
    // Enhance SDKs
    await enhanceSDKs(spec, sdksDir);
    
    // Run post-build tasks after enhancements are complete
    await runPostBuildTasks(spec, sdksDir);
    
    log('');
    log('📦 Generated SDKs:', colors.cyan);
    for (const [, sdk] of Object.entries(sdks) as [SupportedSdk, SdkDefinition][]) { 
        log(`  📁 ${sdk.name}: ${sdksDir}/${sdk.path}`);
    }
    log('');
    log('🎯 Setup complete! Your strongly-typed SDKs are ready to use.', colors.green);
}

main()