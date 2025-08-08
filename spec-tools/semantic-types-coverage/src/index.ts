#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { SemanticAnalyzer } from './analyzer';
import { Reporter, WhitelistLoader } from './reporter';

interface ProgramOptions {
  verbose?: boolean;
  whitelist?: string;
  output?: string;
  fix?: boolean;
  whitelistUpdate?: boolean;
}

const program = new Command();

program
  .name('semantic-types-coverage')
  .description('Validate semantic type coverage in OpenAPI specifications')
  .version('1.0.0')
  .argument('[spec-file]', 'Path to OpenAPI specification file', 'rest-api.domain.yaml')
  .option('-v, --verbose', 'Enable verbose output with detailed location information')
  .option('-w, --whitelist <path>', 'Path to whitelist configuration file')
  .option('-o, --output <path>', 'Path for JSON output file', 'semantic-types-coverage-report.json')
  .option('--fix', 'Suggest fixes for found issues (future enhancement)')
  .option('--whitelist-update', 'Help maintain the whitelist (future enhancement)')
  .action(async (specFile: string, options: ProgramOptions) => {
    try {
      await runAnalysis(specFile, options);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      process.exit(1);
    }
  });

async function runAnalysis(specFile: string, options: ProgramOptions): Promise<void> {
  const chalk = require('chalk');
  
  // Resolve spec file path
  let specPath: string;
  if (path.isAbsolute(specFile)) {
    specPath = specFile;
  } else {
    // Try relative to current directory first, then relative to repo root
    const currentDirPath = path.resolve(specFile);
    const repoRootPath = path.resolve(__dirname, '../../../', specFile);
    
    if (fs.existsSync(currentDirPath)) {
      specPath = currentDirPath;
    } else if (fs.existsSync(repoRootPath)) {
      specPath = repoRootPath;
    } else {
      throw new Error(`Specification file not found: ${specFile}`);
    }
  }
  
  if (!fs.existsSync(specPath)) {
    throw new Error(`Specification file not found: ${specPath}`);
  }
  
  console.log(chalk.blue('🚀 Starting semantic type coverage analysis...'));
  console.log(chalk.gray(`📁 Spec file: ${specPath}`));
  
  // Load whitelist
  const toolDirectory = __dirname;
  const whitelistPath = options.whitelist || 
    WhitelistLoader.findWhitelistFile(specPath, toolDirectory);
  
  const whitelist = WhitelistLoader.load(whitelistPath);
  
  // Run analysis
  console.log(chalk.blue('🔍 Analyzing semantic type coverage...'));
  const analyzer = new SemanticAnalyzer(specPath, whitelist);
  const result = analyzer.analyze();
  
  // Report results
  const reporter = new Reporter(options.verbose);
  
  // Console output
  reporter.reportToConsole(result, specPath);
  
  // JSON output
  const outputPath = path.resolve(options.output || 'semantic-types-coverage-report.json');
  reporter.reportToJson(result, specPath, outputPath);
  
  // Exit with error code if issues found
  if (result.errorCount > 0) {
    console.log(chalk.red(`\n💥 Exiting with error code due to ${result.errorCount} error(s)`));
    process.exit(1);
  }
  
  if (result.warningCount > 0) {
    console.log(chalk.yellow(`\n⚠️  Analysis completed with ${result.warningCount} warning(s)`));
  } else {
    console.log(chalk.green('\n✅ Analysis completed successfully with no issues!'));
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
