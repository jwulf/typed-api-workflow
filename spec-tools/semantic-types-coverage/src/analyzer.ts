import * as YAML from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import { ValidationIssue, ValidationResult, WhitelistConfig, SemanticKey, SchemaNode } from './types';

export class SemanticAnalyzer {
  private spec: any;
  private specContent: string;
  private lineMap: Map<string, number> = new Map();
  private whitelist: WhitelistConfig;

  constructor(specPath: string, whitelistConfig: WhitelistConfig) {
    this.specContent = fs.readFileSync(specPath, 'utf8');
    
    // Parse with line counter for line number tracking
    const lineCounter = new YAML.LineCounter();
    this.spec = YAML.parse(this.specContent, { lineCounter });
    
    this.whitelist = whitelistConfig;
    this.buildLineMap();
  }

  private buildLineMap(): void {
    const lines = this.specContent.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        // Extract schema names and property names
        const schemaMatch = trimmed.match(/^(\w+):\s*$/);
        if (schemaMatch) {
          this.lineMap.set(schemaMatch[1], index + 1);
        }
        
        const propertyMatch = trimmed.match(/^(\w+):\s*(?!$)/);
        if (propertyMatch && !trimmed.includes('$ref') && !trimmed.includes('type:')) {
          this.lineMap.set(`property:${propertyMatch[1]}`, index + 1);
        }
      }
    });
  }

  public analyze(): ValidationResult {
    const issues: ValidationIssue[] = [];
    
    // Strategy 1: Semantic Analysis
    const semanticKeys = this.findSemanticKeyTypes();
    issues.push(...this.validateFilterPropertyExistence(semanticKeys));
    issues.push(...this.validateAdvancedFilterExistence(semanticKeys));
    issues.push(...this.validateFilterPropertyStructure());
    issues.push(...this.validateConsistentKeyUsage());
    
    // Strategy 2: Pattern Matching
    issues.push(...this.validateWithPatterns());
    
    // Filter out whitelisted issues
    const filteredIssues = this.filterWhitelistedIssues(issues);
    
    return this.buildValidationResult(filteredIssues, semanticKeys);
  }

  private findSemanticKeyTypes(): SemanticKey[] {
    const semanticKeys: SemanticKey[] = [];
    const schemas = this.spec?.components?.schemas || {};
    
    Object.entries(schemas).forEach(([name, schema]: [string, any]) => {
      if (this.isSemanticKeyType(schema)) {
        semanticKeys.push({
          name,
          semanticType: schema['x-semantic-type'] || name,
          lineNumber: this.lineMap.get(name),
          location: `components.schemas.${name}`
        });
      }
    });
    
    return semanticKeys;
  }

  private isSemanticKeyType(schema: any): boolean {
    if (!schema || typeof schema !== 'object') return false;
    
    // Check if it has x-semantic-type
    if (schema['x-semantic-type']) return true;
    
    // Check if it extends CamundaKey
    if (schema.allOf && Array.isArray(schema.allOf)) {
      return schema.allOf.some((item: any) => 
        item.$ref === '#/components/schemas/CamundaKey'
      );
    }
    
    return false;
  }

  private validateFilterPropertyExistence(semanticKeys: SemanticKey[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const schemas = this.spec?.components?.schemas || {};
    
    semanticKeys.forEach(semanticKey => {
      const expectedFilterProperty = `${semanticKey.name}FilterProperty`;
      
      if (!schemas[expectedFilterProperty]) {
        const isWhitelisted = this.whitelist.missing_semantic_types_by_design?.includes(semanticKey.name);
        
        if (!isWhitelisted) {
          issues.push({
            type: 'missing-filter-property',
            message: `Missing filter property schema: ${expectedFilterProperty}`,
            location: `components.schemas.${expectedFilterProperty}`,
            schemaName: expectedFilterProperty,
            severity: 'error'
          });
        }
      }
    });
    
    return issues;
  }

  private validateAdvancedFilterExistence(semanticKeys: SemanticKey[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const schemas = this.spec?.components?.schemas || {};
    
    semanticKeys.forEach(semanticKey => {
      const expectedAdvancedFilter = `Advanced${semanticKey.name}Filter`;
      
      if (!schemas[expectedAdvancedFilter]) {
        const isWhitelisted = this.whitelist.missing_semantic_types_by_design?.includes(semanticKey.name);
        
        if (!isWhitelisted) {
          issues.push({
            type: 'missing-advanced-filter',
            message: `Missing advanced filter schema: ${expectedAdvancedFilter}`,
            location: `components.schemas.${expectedAdvancedFilter}`,
            schemaName: expectedAdvancedFilter,
            severity: 'error'
          });
        }
      }
    });
    
    return issues;
  }

  private validateFilterPropertyStructure(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const schemas = this.spec?.components?.schemas || {};
    
    Object.entries(schemas).forEach(([name, schema]: [string, any]) => {
      if (name.endsWith('FilterProperty') && name !== 'BasicStringFilterProperty') {
        if (!this.hasCorrectFilterPropertyStructure(schema)) {
          issues.push({
            type: 'incomplete-filter-structure',
            message: `Filter property ${name} has incorrect structure (should have oneOf with semantic key and advanced filter)`,
            location: `components.schemas.${name}`,
            lineNumber: this.lineMap.get(name),
            schemaName: name,
            severity: 'error'
          });
        }
      }
    });
    
    return issues;
  }

  private hasCorrectFilterPropertyStructure(schema: any): boolean {
    if (!schema.oneOf || !Array.isArray(schema.oneOf)) return false;
    
    let hasSemanticKeyRef = false;
    let hasAdvancedFilterRef = false;
    
    schema.oneOf.forEach((item: any) => {
      if (item.$ref) {
        const refName = item.$ref.split('/').pop();
        if (refName && refName.endsWith('Key') && !refName.includes('Filter')) {
          hasSemanticKeyRef = true;
        }
        if (refName && refName.startsWith('Advanced') && refName.endsWith('Filter')) {
          hasAdvancedFilterRef = true;
        }
      }
    });
    
    return hasSemanticKeyRef && hasAdvancedFilterRef;
  }

  private validateConsistentKeyUsage(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const schemas = this.spec?.components?.schemas || {};
    
    Object.entries(schemas).forEach(([schemaName, schema]: [string, any]) => {
      if (this.isFilterSchema(schemaName)) {
        const keyUsageIssues = this.findInconsistentKeyUsageInSchema(schemaName, schema);
        issues.push(...keyUsageIssues);
      }
    });
    
    return issues;
  }

  private isFilterSchema(schemaName: string): boolean {
    return schemaName.includes('Filter') || schemaName.includes('SearchQuery');
  }

  private findInconsistentKeyUsageInSchema(schemaName: string, schema: any): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const properties = this.getAllProperties(schema);
    
    Object.entries(properties).forEach(([propName, propSchema]: [string, any]) => {
      if (propName.toLowerCase().includes('key')) {
        const isUsingBasicString = this.isUsingBasicStringFilter(propSchema);
        const shouldUseSemanticType = this.shouldUseSemanticKeyType(propName);
        const whitelistKey = `${schemaName}.${propName}`;
        
        if (isUsingBasicString && shouldUseSemanticType && 
            !this.whitelist.legacy_compatibility_exceptions?.includes(whitelistKey) &&
            !this.whitelist.allowed_basic_string_usage?.includes(propName)) {
          
          issues.push({
            type: 'inconsistent-key-usage',
            message: `Property ${propName} in ${schemaName} uses BasicStringFilterProperty but should use semantic key type`,
            location: `components.schemas.${schemaName}.properties.${propName}`,
            lineNumber: this.getPropertyLineNumber(schemaName, propName),
            schemaName,
            propertyName: propName,
            severity: 'error'
          });
        }
      }
    });
    
    return issues;
  }

  private getAllProperties(schema: any): Record<string, any> {
    let properties: Record<string, any> = {};
    
    // Direct properties
    if (schema.properties) {
      properties = { ...properties, ...schema.properties };
    }
    
    // Properties from allOf
    if (schema.allOf && Array.isArray(schema.allOf)) {
      schema.allOf.forEach((item: any) => {
        if (item.properties) {
          properties = { ...properties, ...item.properties };
        }
        // Handle $ref in allOf
        if (item.$ref) {
          const referencedSchema = this.resolveReference(item.$ref);
          if (referencedSchema) {
            const refProperties = this.getAllProperties(referencedSchema);
            properties = { ...properties, ...refProperties };
          }
        }
      });
    }
    
    return properties;
  }

  private isUsingBasicStringFilter(propSchema: any): boolean {
    if (!propSchema) return false;
    
    // Check direct allOf reference
    if (propSchema.allOf && Array.isArray(propSchema.allOf)) {
      return propSchema.allOf.some((item: any) => 
        item.$ref === '#/components/schemas/BasicStringFilterProperty'
      );
    }
    
    // Check oneOf reference
    if (propSchema.oneOf && Array.isArray(propSchema.oneOf)) {
      return propSchema.oneOf.some((item: any) => 
        item.$ref === '#/components/schemas/BasicStringFilterProperty'
      );
    }
    
    return false;
  }

  private shouldUseSemanticKeyType(propName: string): boolean {
    const semanticKeyPatterns = [
      'processInstanceKey', 'processDefinitionKey', 'elementInstanceKey',
      'userTaskKey', 'jobKey', 'variableKey', 'scopeKey', 'incidentKey',
      'messageSubscriptionKey', 'decisionDefinitionKey', 'decisionInstanceKey',
      'batchOperationKey', 'resourceKey', 'deploymentKey', 'formKey',
      'authorizationKey', 'messageKey', 'signalKey', 'decisionRequirementsKey'
    ];
    
    return semanticKeyPatterns.includes(propName);
  }

  private resolveReference(ref: string): any {
    if (!ref.startsWith('#/components/schemas/')) return null;
    
    const schemaName = ref.replace('#/components/schemas/', '');
    return this.spec?.components?.schemas?.[schemaName];
  }

  private getPropertyLineNumber(schemaName: string, propName: string): number | undefined {
    return this.lineMap.get(`property:${propName}`) || this.lineMap.get(schemaName);
  }

  private validateWithPatterns(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Pattern 1: Find BasicStringFilterProperty usage where semantic types should be used
    issues.push(...this.findBasicStringUsageViolations());
    
    // Pattern 2: Find orphaned semantic keys
    issues.push(...this.findOrphanedSemanticKeys());
    
    return issues;
  }

  private findBasicStringUsageViolations(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const lines = this.specContent.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('BasicStringFilterProperty')) {
        // Look for the property name in surrounding lines
        const propName = this.extractPropertyNameFromContext(lines, index);
        if (propName && this.shouldUseSemanticKeyType(propName)) {
          const whitelistEntry = this.whitelist.allowed_basic_string_usage?.includes(propName);
          
          if (!whitelistEntry) {
            issues.push({
              type: 'basic-string-usage',
              message: `Property ${propName} uses BasicStringFilterProperty but should use semantic key type`,
              location: `line ${index + 1}`,
              lineNumber: index + 1,
              propertyName: propName,
              severity: 'warning'
            });
          }
        }
      }
    });
    
    return issues;
  }

  private extractPropertyNameFromContext(lines: string[], currentIndex: number): string | null {
    // Look backwards for property name
    for (let i = currentIndex - 1; i >= Math.max(0, currentIndex - 5); i--) {
      const line = lines[i].trim();
      const match = line.match(/^(\w+):\s*$/);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }

  private findOrphanedSemanticKeys(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const semanticKeys = this.findSemanticKeyTypes();
    const schemas = this.spec?.components?.schemas || {};
    
    semanticKeys.forEach(semanticKey => {
      const isUsedInFilters = this.isSemanticKeyUsedInFilters(semanticKey.name, schemas);
      
      if (!isUsedInFilters) {
        issues.push({
          type: 'orphaned-semantic-key',
          message: `Semantic key ${semanticKey.name} is defined but not used in any filter properties`,
          location: semanticKey.location,
          lineNumber: semanticKey.lineNumber,
          schemaName: semanticKey.name,
          severity: 'warning'
        });
      }
    });
    
    return issues;
  }

  private isSemanticKeyUsedInFilters(keyName: string, schemas: Record<string, any>): boolean {
    const expectedFilterProperty = `${keyName}FilterProperty`;
    const expectedAdvancedFilter = `Advanced${keyName}Filter`;
    
    // Check if filter property exists and is used
    if (schemas[expectedFilterProperty]) {
      return this.isSchemaReferenced(expectedFilterProperty, schemas);
    }
    
    // Check if the key is directly referenced in filter contexts
    return this.isKeyDirectlyUsedInFilters(keyName, schemas);
  }

  private isSchemaReferenced(schemaName: string, schemas: Record<string, any>): boolean {
    const refString = `#/components/schemas/${schemaName}`;
    const specString = JSON.stringify(schemas);
    return specString.includes(refString);
  }

  private isKeyDirectlyUsedInFilters(keyName: string, schemas: Record<string, any>): boolean {
    const refString = `#/components/schemas/${keyName}`;
    
    // Check if used in filter schemas
    Object.entries(schemas).forEach(([name, schema]) => {
      if (this.isFilterSchema(name)) {
        const schemaString = JSON.stringify(schema);
        if (schemaString.includes(refString)) {
          return true;
        }
      }
    });
    
    return false;
  }

  private filterWhitelistedIssues(issues: ValidationIssue[]): ValidationIssue[] {
    return issues.filter(issue => {
      // Check various whitelist categories
      if (issue.propertyName && this.whitelist.allowed_basic_string_usage?.includes(issue.propertyName)) {
        return false;
      }
      
      if (issue.schemaName && this.whitelist.missing_semantic_types_by_design?.includes(issue.schemaName)) {
        return false;
      }
      
      const locationKey = `${issue.schemaName}.${issue.propertyName}`;
      if (this.whitelist.legacy_compatibility_exceptions?.includes(locationKey)) {
        return false;
      }
      
      return true;
    });
  }

  private buildValidationResult(issues: ValidationIssue[], semanticKeys: SemanticKey[]): ValidationResult {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    const missingFilterProperties = issues
      .filter(i => i.type === 'missing-filter-property')
      .map(i => i.schemaName || '');
    
    const missingAdvancedFilters = issues
      .filter(i => i.type === 'missing-advanced-filter')
      .map(i => i.schemaName || '');
    
    const inconsistentUsages = issues
      .filter(i => i.type === 'inconsistent-key-usage')
      .map(i => `${i.schemaName}.${i.propertyName}`);
    
    return {
      issues,
      totalIssues: issues.length,
      errorCount,
      warningCount,
      summary: {
        semanticKeysFound: semanticKeys.map(k => k.name),
        missingFilterProperties,
        missingAdvancedFilters,
        inconsistentUsages
      }
    };
  }
}
