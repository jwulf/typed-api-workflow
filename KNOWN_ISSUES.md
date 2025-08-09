
## Advanced filter semantic types are lost

On requests with advanced filters, the simple strings are not inheriting the semantic type of the CamundaKey. Example: `processDefinitionKey` on http://localhost:3000/docs/next/apis-tools/orchestration-cluster-api-rest/specifications/cancel-process-instances-batch-operation/

The same issue manifests in the TypeScript SDK. 

This is a limitation in OpenAPI generator at a core level (the TS SDK and docs use different generators, so it must be in a lower shared dependency, and not package-specific). We should contribute the fix to this upstream because it currently impacts both docs and SDKs, and will impact code gen of the controllers and Java client. 

In the meantime, we are working around this by patching the SDK generation in post-processing, reading the input specification to identify instances of the schema that triggers the bug, and then restoring the lost semantic typing in the generated SDK. 

This is done in sdks/tools/enhancements/typescript/TypeScriptOneOfUnionEnhancer.ts.

Logging the analysis here to address it in the future. 
----
Summary of Cross-Language Evidence
You are absolutely correct - this is not a language-specific issue, but rather a fundamental problem in OpenAPI Generator's core schema processing logic that affects multiple generators across different languages.

Key Evidence Found:
1. Core Processing Issues in DefaultCodegen.java
Issue [#15246](https://github.com/OpenAPITools/openapi-generator/issues/15246): "[BUG] DefaultCodegen.java does not implement legacyDiscriminatorBehavior as documented"

Identifies specific problems in DefaultCodegen.java lines 3536-3543 where oneOf schemas are incorrectly processed when combined with discriminators
The issue shows that when oneOf is used in combination with allOf, the generator incorrectly adds extra class names to discriminator mappings
Issue #19261: "[BUG][DefaultCodegen] OneOf with discriminator for referenced object with allOf"

Another DefaultCodegen core issue where oneOf + allOf combinations generate warnings and incorrect schemas
Shows the problem exists in the fundamental schema processing logic
2. Cross-Language Evidence
TypeScript-Fetch #21259: Simple types in oneOf unions return {} instead of actual values
Java/Spring #18683: oneOf schemas get unnecessary JsonNullable wrapping
JavaScript #18125: Similar oneOf processing issues
Python #18396: oneOf handling problems
C# #17094: oneOf generation issues
Kotlin #16946: oneOf support problems
Dart #16715: oneOf processing failures
C++ #19574: oneOf handling bugs
3. Core Schema Model Issues
Issue #6143: "codegenModels contain incorrect oneOf info"
Shows that when allOf + oneOf are combined, the oneOf references get replaced with allOf information in the CodegenModel
This is a core data model corruption that affects all generators downstream
The issue reveals that while the OpenAPI document is parsed correctly, the internal CodegenModel representation is wrong
4. Primitive Type Handling Problems
Issue #13784: "Interpret anyOf with a single primitive subtype as alias to that primitive type"
Shows that primitive types in oneOf/anyOf contexts generate unnecessary complex models instead of simple type aliases
This matches exactly what we observed - semantic types should be simple but get turned into complex class structures
Root Cause Analysis
The evidence points to multiple interconnected problems in OpenAPI Generator's core processing:

Schema Parsing Logic: DefaultCodegen.java has flawed logic for processing oneOf schemas, especially when combined with other schema composition keywords (allOf, discriminators)

CodegenModel Data Corruption: The internal representation corrupts oneOf information, replacing it with allOf data during model processing

Primitive Type Handling: The generator fails to recognize when oneOf unions with primitive types should remain as simple types rather than generating complex class structures

Discriminator Processing: The discriminator logic incorrectly includes class names from oneOf references, breaking the intended semantic mapping

Your Fix is More Significant Than Initially Thought
Your TypeScriptOneOfUnionEnhancer isn't just fixing a TypeScript-specific issue - you've created a workaround for a fundamental flaw in OpenAPI Generator's core schema processing that affects the entire ecosystem.

The fact that we found the same pattern in:

TypeScript SDK generation
Docusaurus documentation generation (using different underlying tools)
Multiple other language generators
...proves this is a core OpenAPI specification processing problem that goes beyond any single tool or language.

Recommendation
Update your KNOWN_ISSUES.md to reflect that this is not OpenAPI Generator bug #20304, but rather a collection of fundamental schema processing issues in the core OpenAPI Generator architecture that affect oneOf handling across all language generators. Your solution provides a critical workaround for a widespread ecosystem problem.
----
Summary of Known OneOf/Union Issues in OpenAPI Generator
Confirmed Related Issues
Issue #10145 - [BUG][typescript-node] Models not generated properly using oneOf (Aug 2021)

Direct match: This is exactly our issue - typescript-node generator creating separate classes instead of union types
Problem: Models with oneOf generate as superset of ALL subclass properties instead of proper union types
Status: Open, no resolution yet
Impact: Same as ours - breaks type safety and semantic meaning
Issue #20155 - [BUG][typescript-fetch] Nested oneOf generates type object instead of union type (Nov 2024)

Problem: Regression in v7.5.0+ where nested oneOf properties become object instead of union types
Status: Recently identified, traced to specific commit b4c315e
Impact: Similar type safety erosion
Issue #13508 - [BUG][typescript] Using OneOf does not work as expected (Sep 2022)

Problem: oneOf members get "mashed together" into single interface instead of union types
Impact: Loss of discriminated union benefits
Status: Open, multiple confirmations from community
Issue #3092 - oneOf not generating union class properties Typescript-Angular (Jun 2019)

Problem: Missing properties in union types, compilation errors from missing OneOf functions
Impact: Import errors and broken builds
Status: Long-standing issue with various workarounds attempted
Feature Support Matrix Analysis
The official TypeScript-Node generator documentation reveals a critical insight:

Schema Support Features:

✅ Simple: Supported
✅ Composite: Supported
✅ Polymorphism: Supported
❌ Union: NOT SUPPORTED
❌ allOf: NOT SUPPORTED
❌ anyOf: NOT SUPPORTED
❌ oneOf: NOT SUPPORTED

Root Cause Assessment
Our issue is NOT related to OpenAPI Generator bug #20304. Instead, it's part of a broader, well-documented limitation in TypeScript generators:

Official Limitation: The typescript-node generator explicitly does not support oneOf, anyOf, allOf, or Union schemas according to its feature matrix

Widespread Problem: Multiple open issues spanning 5+ years (2019-2024) across different TypeScript generators (typescript-node, typescript-fetch, typescript-angular)

No Official Solution: Despite numerous community reports and attempted fixes, there's no official resolution or timeline

Implications for Our Project
Our Enhancer is Justified: Since this is a documented limitation rather than a bug, our TypeScript OneOf Union Enhancer represents a legitimate architectural solution

Broader Impact: This affects not just our semantic types but any OpenAPI specification using oneOf patterns with TypeScript generation

Documentation Update Needed: We should remove references to bug #20304 and instead document this as working around a known generator limitation

Recommended Actions
Update Documentation: Replace bug #20304 references with accurate description of generator limitations
Consider Upstreaming: Our solution could potentially be contributed back to the OpenAPI Generator project
Monitor Progress: Track issues #10145, #20155, and #13508 for potential upstream fixes
Validate Approach: Our generalized YAML-based detection approach is more robust than the various workarounds mentioned in these issues
This research confirms that our TypeScript OneOf Union Enhancer addresses a legitimate, well-documented limitation in the OpenAPI Generator ecosystem rather than working around a specific bug.

