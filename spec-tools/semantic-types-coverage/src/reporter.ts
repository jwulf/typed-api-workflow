import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { ValidationResult, WhitelistConfig } from './types';

export class Reporter {
  constructor(private verbose: boolean = false) {}

  public reportToConsole(result: ValidationResult, specFile: string): void {
    const chalk = require('chalk');
    
    console.log(chalk.bold('\n🔍 Semantic Type Coverage Analysis'));
    console.log(chalk.gray(`Analyzed: ${specFile}`));
    console.log(chalk.gray(`Semantic keys found: ${result.summary.semanticKeysFound.length}`));
    
    if (result.totalIssues === 0) {
      console.log(chalk.green('✅ No issues found! All semantic types are properly covered.'));
      return;
    }
    
    console.log(chalk.red(`\n❌ Found ${result.totalIssues} issues:`));
    console.log(chalk.red(`   Errors: ${result.errorCount}`));
    console.log(chalk.yellow(`   Warnings: ${result.warningCount}`));
    
    // Group issues by type
    const issuesByType = result.issues.reduce((acc, issue) => {
      if (!acc[issue.type]) acc[issue.type] = [];
      acc[issue.type].push(issue);
      return acc;
    }, {} as Record<string, typeof result.issues>);
    
    Object.entries(issuesByType).forEach(([type, issues]) => {
      console.log(chalk.bold(`\n📋 ${this.formatIssueType(type)} (${issues.length}):`));
      
      issues.forEach((issue, index) => {
        const severityIcon = issue.severity === 'error' ? '🚨' : '⚠️';
        const lineInfo = issue.lineNumber ? ` (line ${issue.lineNumber})` : '';
        
        console.log(`   ${severityIcon} ${issue.message}${lineInfo}`);
        
        if (this.verbose) {
          console.log(chalk.gray(`      Location: ${issue.location}`));
          if (issue.schemaName) console.log(chalk.gray(`      Schema: ${issue.schemaName}`));
          if (issue.propertyName) console.log(chalk.gray(`      Property: ${issue.propertyName}`));
        }
      });
    });
    
    // Summary section
    console.log(chalk.bold('\n📊 Summary:'));
    
    if (result.summary.missingFilterProperties.length > 0) {
      console.log(chalk.red(`   Missing filter properties: ${result.summary.missingFilterProperties.join(', ')}`));
    }
    
    if (result.summary.missingAdvancedFilters.length > 0) {
      console.log(chalk.red(`   Missing advanced filters: ${result.summary.missingAdvancedFilters.join(', ')}`));
    }
    
    if (result.summary.inconsistentUsages.length > 0) {
      console.log(chalk.yellow(`   Inconsistent usages: ${result.summary.inconsistentUsages.length} properties`));
      if (this.verbose) {
        result.summary.inconsistentUsages.forEach(usage => {
          console.log(chalk.gray(`      ${usage}`));
        });
      }
    }
    
    console.log(chalk.gray('\n💡 Tip: Use --verbose for detailed location information'));
    console.log(chalk.gray('💡 Tip: Add exceptions to semantic-type-coverage-whitelist.yaml if needed'));
  }

  public reportToJson(result: ValidationResult, specFile: string, outputPath: string): void {
    const report = {
      timestamp: new Date().toISOString(),
      specFile,
      summary: {
        totalIssues: result.totalIssues,
        errorCount: result.errorCount,
        warningCount: result.warningCount,
        semanticKeysFound: result.summary.semanticKeysFound.length,
        semanticKeysList: result.summary.semanticKeysFound
      },
      findings: {
        missingFilterProperties: result.summary.missingFilterProperties,
        missingAdvancedFilters: result.summary.missingAdvancedFilters,
        inconsistentUsages: result.summary.inconsistentUsages
      },
      issues: result.issues.map(issue => ({
        type: issue.type,
        severity: issue.severity,
        message: issue.message,
        location: issue.location,
        lineNumber: issue.lineNumber,
        schemaName: issue.schemaName,
        propertyName: issue.propertyName
      }))
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📄 JSON report written to: ${outputPath}`);
  }

  private formatIssueType(type: string): string {
    const typeNames: Record<string, string> = {
      'missing-filter-property': 'Missing Filter Properties',
      'missing-advanced-filter': 'Missing Advanced Filters',
      'inconsistent-key-usage': 'Inconsistent Key Usage',
      'basic-string-usage': 'Basic String Usage',
      'incomplete-filter-structure': 'Incomplete Filter Structure',
      'orphaned-semantic-key': 'Orphaned Semantic Keys'
    };
    
    return typeNames[type] || type;
  }
}

export class WhitelistLoader {
  public static load(whitelistPath: string): WhitelistConfig {
    try {
      if (!fs.existsSync(whitelistPath)) {
        console.warn(`⚠️  Whitelist file not found: ${whitelistPath}`);
        console.warn('   Proceeding without whitelist (all issues will be reported)');
        return {};
      }
      
      const content = fs.readFileSync(whitelistPath, 'utf8');
      const config = YAML.parse(content);
      
      console.log(`📋 Loaded whitelist from: ${whitelistPath}`);
      return config || {};
    } catch (error) {
      console.error(`❌ Error loading whitelist from ${whitelistPath}:`, error);
      console.warn('   Proceeding without whitelist');
      return {};
    }
  }

  public static findWhitelistFile(specFilePath: string, toolDirectory: string): string {
    const whitelistFilename = 'semantic-type-coverage-whitelist.yaml';
    
    // Priority 1: Next to spec file
    const specDir = path.dirname(specFilePath);
    const whitelistNextToSpec = path.join(specDir, whitelistFilename);
    if (fs.existsSync(whitelistNextToSpec)) {
      return whitelistNextToSpec;
    }
    
    // Priority 2: In tool directory
    const whitelistInTool = path.join(toolDirectory, whitelistFilename);
    if (fs.existsSync(whitelistInTool)) {
      return whitelistInTool;
    }
    
    // Default: return tool directory path (even if it doesn't exist)
    return whitelistInTool;
  }
}
