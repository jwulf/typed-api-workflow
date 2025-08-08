# Semantic Type Coverage Analysis Tool

This tool validates the completeness of semantic type coverage in OpenAPI specifications, specifically designed for the Camunda 8 REST API specification.

## Overview

The tool performs two types of validation:

1. **Semantic Analysis**: Analyzes the actual schema structure to identify semantic type patterns and validate completeness
2. **Pattern Matching**: Uses string patterns to catch naming convention violations and usage inconsistencies

## Features

- ✅ **Detects missing filter properties** for semantic key types
- ✅ **Identifies missing advanced filter schemas**
- ✅ **Finds inconsistent key usage** (BasicStringFilterProperty vs semantic types)
- ✅ **Validates filter property structure** (oneOf patterns)
- ✅ **Reports orphaned semantic keys** (defined but unused)
- ✅ **Supports whitelisting** for legitimate exceptions
- ✅ **Provides line number reporting** for easy issue location
- ✅ **Generates both console and JSON reports**

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

```bash
# Analyze the default domain specification
npm run start

# Analyze a specific file
npm run start -- path/to/spec.yaml

# Enable verbose output with detailed location information
npm run start -- --verbose

# Use a custom whitelist file
npm run start -- --whitelist path/to/whitelist.yaml

# Custom JSON output location
npm run start -- --output report.json
```

### Command Line Options

```
Usage: semantic-types-coverage [options] [spec-file]

Arguments:
  spec-file                          Path to OpenAPI specification file (default: "rest-api.domain.yaml")

Options:
  -v, --verbose                      Enable verbose output with detailed location information
  -w, --whitelist <path>             Path to whitelist configuration file
  -o, --output <path>                Path for JSON output file (default: "semantic-types-coverage-report.json")
  --fix                              Suggest fixes for found issues (future enhancement)
  --whitelist-update                 Help maintain the whitelist (future enhancement)
  -h, --help                         display help for command
```

## Whitelist Configuration

The tool supports a whitelist configuration file (`semantic-type-coverage-whitelist.yaml`) to exclude legitimate exceptions. The whitelist is searched in this order:

1. Next to the specification file
2. In the tool directory
3. Custom path specified with `--whitelist`

### Whitelist Format

```yaml
# Allowed basic string usage (property names that don't need semantic types)
allowed_basic_string_usage:
  - "tenantId"          # Not a semantic key type
  - "batchOperationId"  # Different from batchOperationKey
  - "processDefinitionId" # ID vs Key distinction

# Legacy compatibility exceptions (schema.property combinations)
legacy_compatibility_exceptions:
  - "DecisionInstanceFilter.decisionDefinitionKey"  # Known legacy usage
  - "BatchOperationFilter.itemKey"                  # Complex key type

# Types that are missing semantic enhancements by design
missing_semantic_types_by_design:
  - "ResourceKey"       # Composite type, not pure CamundaKey descendant

# Path parameters that intentionally use basic types
path_parameter_exceptions:
  - "/legacy-endpoints/*" # Legacy endpoints use string types intentionally
```

## Validation Types

### 1. Missing Filter Properties
Identifies semantic key types that don't have corresponding `*FilterProperty` schemas.

**Example Issue:**
- `DecisionDefinitionKey` exists but `DecisionDefinitionKeyFilterProperty` is missing

### 2. Missing Advanced Filters
Identifies semantic key types that don't have corresponding `Advanced*Filter` schemas.

**Example Issue:**
- `DecisionDefinitionKey` exists but `AdvancedDecisionDefinitionKeyFilter` is missing

### 3. Inconsistent Key Usage
Finds properties using `BasicStringFilterProperty` when they should use semantic key types.

**Example Issue:**
- `DecisionInstanceFilter.decisionDefinitionKey` uses `BasicStringFilterProperty` instead of `DecisionDefinitionKeyFilterProperty`

### 4. Incomplete Filter Structure
Validates that filter properties have the correct `oneOf` structure with semantic key and advanced filter references.

**Expected Structure:**
```yaml
ProcessInstanceKeyFilterProperty:
  oneOf:
    - $ref: "#/components/schemas/ProcessInstanceKey"
    - $ref: "#/components/schemas/AdvancedProcessInstanceKeyFilter"
```

### 5. Orphaned Semantic Keys
Identifies semantic key types that are defined but never used in filter contexts.

## Output

### Console Output
- Color-coded issue reporting
- Grouped by issue type
- Summary statistics
- Line number information (with `--verbose`)

### JSON Output
Structured report including:
- Timestamp and analyzed file
- Summary statistics
- Detailed findings categorized by type
- Individual issues with location information

## Exit Codes

- `0`: No errors (warnings are allowed)
- `1`: Errors found or analysis failed

## Integration

### CI/CD Integration
```bash
# Fail build on semantic type coverage issues
npm run build && node dist/index.js --verbose
if [ $? -ne 0 ]; then
  echo "❌ Semantic type coverage validation failed"
  exit 1
fi
```

### NPM Scripts Integration
Add to your main project's `package.json`:
```json
{
  "scripts": {
    "validate:semantic-types": "cd spec-tools/semantic-types-coverage && npm run start -- --verbose"
  }
}
```

## Development

### Project Structure
```
src/
├── index.ts       # CLI interface and main orchestration
├── analyzer.ts    # Core semantic analysis logic
├── reporter.ts    # Console and JSON reporting
└── types.ts       # TypeScript type definitions
```

### Building
```bash
npm run build       # Compile TypeScript
npm run dev         # Run with ts-node for development
```

## Examples

### Successful Analysis
```bash
$ npm run start
🚀 Starting semantic type coverage analysis...
📁 Spec file: /path/to/rest-api.domain.yaml
🔍 Analyzing semantic type coverage...
✅ Analysis completed successfully with no issues!
```

### Issues Found
```bash
$ npm run start -- --verbose
🚀 Starting semantic type coverage analysis...
📁 Spec file: /path/to/rest-api.domain.yaml
🔍 Analyzing semantic type coverage...

❌ Found 53 issues:
   Errors: 42
   Warnings: 11

📋 Missing Filter Properties (11):
   🚨 Missing filter property schema: DecisionDefinitionKeyFilterProperty
      Location: components.schemas.DecisionDefinitionKeyFilterProperty

💥 Exiting with error code due to 42 error(s)
```

## Future Enhancements

- `--fix` mode to suggest corrections
- `--whitelist-update` mode to help maintain whitelist
- Integration with OpenAPI validation pipelines
- Support for custom semantic type patterns
