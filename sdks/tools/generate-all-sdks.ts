import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';
import { OpenAPIV3 } from 'openapi-types';

import { execSync } from 'child_process';
import { SdkDefinition, sdks, SupportedSdk } from './sdks';

import { SdkPipelineOrchestrator } from './SdkPipelineOrchestrator';
import { SemanticTypeEnhancer } from './enhancements/SemanticTypeEnhancer';
import { EventuallyConsistentEnhancer } from './enhancements/EventuallyConsistentEnhancer';
import { TracingEnhancer } from './enhancements/TracingEnhancer';
import { TypeScriptPolymorphicSchemaEnhancer } from './enhancements/typescript/TypeScriptPolymorphicSchemaEnhancer';
import { ASTTypeScriptOneOfUnionEnhancer } from './enhancements/typescript/ASTTypeScriptOneOfUnionEnhancer';

import { TypeScriptPostBuildStrategy } from './post-build/typescript/TypeScriptPostBuildStrategy';

// Custom post-processing of generated SDKs  
const enhancementStrategies = [
    SemanticTypeEnhancer, // Enhance semantic types with validation
    EventuallyConsistentEnhancer, // Enhance eventually consistent operations  
    TracingEnhancer, // Add OpenTelemetry tracing support
    TypeScriptPolymorphicSchemaEnhancer, // Fix TypeScript code generation issues
    ASTTypeScriptOneOfUnionEnhancer, // Fix OneOf union types using AST transformations
];

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

async function runSdkPipeline(spec: OpenAPIV3.Document, sdksDir: string) {
    log('🚀 Running unified SDK pipeline...', colors.cyan);
    
    try {
        const orchestrator = new SdkPipelineOrchestrator(
            spec, 
            sdks, 
            sdksDir, 
            enhancementStrategies,
            postBuildStrategies
        );
        await orchestrator.runPipeline();

        log('🎉 SDK pipeline completed successfully!', colors.green);
    } catch (error) {
        log('❌ SDK pipeline failed', colors.red);
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
    
    // Run unified SDK pipeline (enhancement + post-build)
    await runSdkPipeline(spec, sdksDir);
    
    log('');
    log('📦 Generated SDKs:', colors.cyan);
    for (const [, sdk] of Object.entries(sdks) as [SupportedSdk, SdkDefinition][]) { 
        log(`  📁 ${sdk.name}: ${sdksDir}/${sdk.path}`);
    }
    log('');
    log('🎯 Setup complete! Your strongly-typed SDKs are ready to use.', colors.green);
}

main()