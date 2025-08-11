# OpenAPI Request Bodies with Mutual Exclusivity Analysis

## Executive Summary

Based on systematic analysis of the `rest-api.domain.yaml` OpenAPI specification, this report identifies **all request bodies that contain mutual exclusivity constraints** expressed through `oneOf` constructs and categorizes different patterns of `oneOf` usage.

## Current State: Request Bodies with OneOf

### ✅ Properly Modeled Mutual Exclusivity

**Only 1 request body currently uses `oneOf` for mutual exclusivity:**

| Endpoint | Schema | Mutual Exclusivity Type | Status |
|----------|--------|------------------------|---------|
| `POST /process-instances` | `ProcessInstanceCreationInstruction` | ID vs Key selection | ✅ Correct |

#### ProcessInstanceCreationInstruction Analysis

**Endpoint**: `POST /process-instances`  
**Schema Location**: Lines 10432-10437  
**Pattern**: Process definition selection by ID or Key

```yaml
ProcessInstanceCreationInstruction:
  x-polymorphic-schema: true
  description: "Instructions for creating a process instance. The process definition can be specified either by ID or by key."
  oneOf:
    - $ref: "#/components/schemas/ProcessInstanceCreationInstructionById"
    - $ref: "#/components/schemas/ProcessInstanceCreationInstructionByKey"
```

**Why this is correct:**
- ✅ Uses `oneOf` to enforce exactly one choice
- ✅ Separates concerns into distinct schemas
- ✅ Clear documentation: "either by ID or by key"
- ✅ `x-polymorphic-schema: true` indicates intentional design
- ✅ Each option has different required fields:
  - `ById`: requires `processDefinitionId`
  - `ByKey`: requires `processDefinitionKey`
- ✅ Schema specification matches runtime validation behavior

## Schema Patterns Analysis

### OneOf Usage Categories

The specification contains **18 schemas with `oneOf` constructs**, but only **1 is used in request bodies**:

#### 1. Request Body Mutual Exclusivity (1 schema)
- `ProcessInstanceCreationInstruction` - ID vs Key selection

#### 2. Search Filter Polymorphism (14 schemas)
- Filter properties supporting both simple values and advanced filter objects
- Examples: `StringFilterProperty`, `IntegerFilterProperty`, `DateTimeFilterProperty`
- Pattern: `oneOf: [simple_value, AdvancedFilter]`

#### 3. Pagination Strategy Selection (1 schema)
- `SearchQueryPageRequest` - offset vs cursor-based pagination
- Pattern: `oneOf: [OffsetPagination, CursorForwardPagination, CursorBackwardPagination]`

#### 4. Key Type Unions (2 schemas)
- `ResourceKey`, `BatchOperationKey` - union of different key types
- Pattern: `oneOf: [KeyType1, KeyType2, ...]`

### Schemas NOT Used in Request Bodies

**17 `oneOf` schemas are not directly used in request bodies:**

| Category | Schemas | Usage Context |
|----------|---------|---------------|
| **Search Filters** | `BasicStringFilterProperty`, `StringFilterProperty`, `IntegerFilterProperty`, `DateTimeFilterProperty`, `ProcessInstanceStateFilterProperty`, `ElementInstanceStateFilterProperty`, `UserTaskStateFilterProperty`, `JobStateFilterProperty`, `JobKindFilterProperty`, `JobListenerEventTypeFilterProperty`, `MessageSubscriptionTypeFilterProperty`, `BatchOperationTypeFilterProperty`, `BatchOperationStateFilterProperty`, `BatchOperationItemStateFilterProperty` | Used in query parameters/search requests |
| **Pagination** | `SearchQueryPageRequest` | Used in search request contexts |
| **Key Unions** | `ResourceKey`, `BatchOperationKey` | Used as property types, not top-level request bodies |

## Detection Strategy for Request Body Mutual Exclusivity

### Primary Detection Pattern

```typescript
interface RequestBodyMutualExclusivityDetector {
  pattern: "RequestBody → Schema → oneOf"
  criteria: {
    location: "paths.*.*.requestBody.content.*.schema"
    schema_structure: "oneOf: [schema_ref1, schema_ref2, ...]"
    semantic_purpose: "alternative ways to identify/specify the same concept"
  }
}
```

### Detection Algorithm

```python
def detect_request_body_mutual_exclusivity(openapi_spec):
    results = []
    
    for path, path_data in openapi_spec.get('paths', {}).items():
        for method, method_data in path_data.items():
            request_body = method_data.get('requestBody')
            if request_body:
                for content_type, content_data in request_body.get('content', {}).items():
                    schema = content_data.get('schema', {})
                    
                    # Check for direct oneOf in request body schema
                    if 'oneOf' in schema:
                        results.append({
                            'endpoint': f'{method.upper()} {path}',
                            'type': 'direct_oneof',
                            'options': len(schema['oneOf'])
                        })
                    
                    # Check for referenced schema with oneOf
                    elif '$ref' in schema:
                        ref_schema = resolve_schema_reference(schema['$ref'])
                        if 'oneOf' in ref_schema:
                            results.append({
                                'endpoint': f'{method.upper()} {path}',
                                'type': 'referenced_oneof', 
                                'schema_name': extract_schema_name(schema['$ref']),
                                'options': len(ref_schema['oneOf'])
                            })
    
    return results
```

### Discrimination Criteria

To distinguish **mutual exclusivity** from other `oneOf` uses:

#### ✅ Mutual Exclusivity Indicators:
1. **Alternative Identification**: Different ways to identify the same entity (ID vs Key)
2. **Required Field Differences**: Each option requires mutually exclusive fields
3. **Semantic Equivalence**: Options serve the same conceptual purpose
4. **Business Logic**: "Either this way OR that way to achieve the same goal"

#### ❌ Non-Mutual Exclusivity Patterns:
1. **Polymorphic Types**: Genuinely different data structures
2. **Filter Unions**: Simple value OR complex filter object
3. **Strategy Patterns**: Different algorithms/approaches (pagination strategies)
4. **Type Unions**: Collections of related but distinct types

## Current Gap Analysis

### Missing Request Body Mutual Exclusivity

Based on our runtime validation analysis, there should be **additional request bodies** with `oneOf` constructs that are currently missing:

| Expected Endpoint | Expected Schema | Current State | Action Needed |
|------------------|-----------------|---------------|---------------|
| `POST /decision-evaluation` | `DecisionEvaluationInstruction` | Missing `oneOf` | ❌ Add `oneOf` construct |
| Other endpoints with ID/Key patterns | TBD (requires further analysis) | Unknown | 🔍 Investigate |

## Recommended Next Steps

### 1. Schema Enhancement
Fix the known gap:
```yaml
# Transform DecisionEvaluationInstruction to use oneOf
DecisionEvaluationInstruction:
  oneOf:
    - $ref: "#/components/schemas/DecisionEvaluationInstructionById"
    - $ref: "#/components/schemas/DecisionEvaluationInstructionByKey"
```

### 2. Systematic Discovery
Search for additional request bodies that should have `oneOf`:
- Look for schemas with ID/Key field pairs
- Cross-reference with runtime validation patterns
- Identify other "either/or" scenarios in business logic

### 3. Validation Automation
```python
def validate_mutual_exclusivity_consistency():
    runtime_patterns = scan_validator_code_for_xor_patterns()
    schema_patterns = scan_openapi_for_oneof_patterns()
    
    gaps = []
    for runtime_pattern in runtime_patterns:
        matching_schema = find_corresponding_schema(runtime_pattern)
        if not matching_schema.has_oneof:
            gaps.append({
                'endpoint': runtime_pattern.endpoint,
                'schema': matching_schema.name,
                'issue': 'runtime_xor_without_schema_oneof'
            })
    
    return gaps
```

### 4. Prevention Guidelines
- **Schema Design Rule**: When runtime validation enforces XOR constraints, schema must use `oneOf`
- **CI/CD Validation**: Automated checks to ensure runtime ↔ schema consistency
- **Documentation Standards**: Clear descriptions mentioning mutual exclusivity

## Conclusion

**Current state**: Only 1 request body properly models mutual exclusivity using `oneOf`  
**Gap identified**: At least 1 request body (`DecisionEvaluationInstruction`) needs `oneOf` construct  
**Detection approach**: `RequestBody → Schema → oneOf` pattern with semantic analysis  
**Action needed**: Systematic review and schema enhancement for consistency

The analysis shows that while the OpenAPI specification has extensive use of `oneOf` constructs (18 total), **only 1 request body currently uses this pattern for mutual exclusivity**. This suggests significant opportunities for improvement to ensure schema accuracy matches runtime behavior.
