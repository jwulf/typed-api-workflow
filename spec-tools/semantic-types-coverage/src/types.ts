export interface ValidationIssue {
  type: 'missing-filter-property' | 'missing-advanced-filter' | 'inconsistent-key-usage' | 'basic-string-usage' | 'incomplete-filter-structure' | 'orphaned-semantic-key';
  message: string;
  location: string;
  lineNumber?: number;
  schemaName?: string;
  propertyName?: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  issues: ValidationIssue[];
  totalIssues: number;
  errorCount: number;
  warningCount: number;
  summary: {
    semanticKeysFound: string[];
    missingFilterProperties: string[];
    missingAdvancedFilters: string[];
    inconsistentUsages: string[];
  };
}

export interface WhitelistConfig {
  allowed_basic_string_usage?: string[];
  legacy_compatibility_exceptions?: string[];
  missing_semantic_types_by_design?: string[];
  path_parameter_exceptions?: string[];
}

export interface SemanticKey {
  name: string;
  semanticType: string;
  lineNumber?: number;
  location: string;
}

export interface SchemaNode {
  name: string;
  content: any;
  lineNumber?: number;
  location: string;
}
