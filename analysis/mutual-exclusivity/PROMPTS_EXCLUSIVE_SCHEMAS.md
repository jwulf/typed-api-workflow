OK, there may be other examples of this anti-pattern in the schema, and I want to exhaustively detect them. The mutual exclusivity is enforced at runtime, so the controller implementation is the source of truth of the request schema.

The controller for this endpoint is in camunda/zeebe/gateway-rest. I want you to examine the controller code and explain to me how this mutual exclusivity is enforced at run-time. Then we are going to look at another controller implementation that enforces mutual exclusivity at runtime to see if they follow a predictable pattern.

Examine the controller for the evaluate decision endpoint first, and give me an analysis of how the mutual exclusivity is enforced at runtime.
---------

Key Patterns:
Either/Or Validation: Exactly one of two fields must be provided
Early Validation: Validation happens before any business logic
Fail-Fast: Returns ProblemDetail immediately if validation fails
Functional Error Handling: Uses Either<ProblemDetail, T> for error handling
Centralized Validation: All validation logic is in dedicated validator classes
Standardized Error Messages: Reusable error message templates
This is a classic XOR constraint (exclusive OR) implemented at the application layer rather than the schema level, which allows for detailed error messages and runtime flexibility but doesn't provide compile-time type safety.
---

OK, so now let us examine another example of this pattern. The create process instance request has the same pattern: mutual exclusivity constraint, enforced at runtime but not expressed in the schema. 

Examine the controller for the create process instance endpoint for the implementation of runtime enforcement of mutual exclusivity of request fields. Give me an analysis. 
----
Identical Pattern Confirmation
This follows the exact same pattern as the decision evaluation:

✅ Either/Or Validation: Exactly one of processDefinitionId or processDefinitionKey must be provided
✅ Early Validation: Validation happens before any business logic
✅ Fail-Fast: Returns ProblemDetail immediately if validation fails
✅ Functional Error Handling: Uses Either<ProblemDetail, T> for error handling
✅ Centralized Validation: All validation logic is in dedicated validator classes
✅ Standardized Error Messages: Uses the same reusable error message templates:
ERROR_MESSAGE_AT_LEAST_ONE_FIELD → "At least one of [processDefinitionId, processDefinitionKey] is required"
ERROR_MESSAGE_ONLY_ONE_FIELD → "Only one of [processDefinitionId, processDefinitionKey] is allowed"
Schema vs Runtime Discrepancy
Just like with DecisionEvaluationInstruction, the ProcessInstanceCreationInstruction schema in the OpenAPI spec does not model the mutual exclusivity constraint - it's only enforced at runtime through application-level validation.

Predictable Pattern Identified ✅
Both examples follow an identical architectural pattern for enforcing XOR constraints:

Schema: Allows both fields (no structural constraint)
Validation: Runtime validation with standardized error messages
Integration: Validation integrated into request mapping layer
Error Handling: Functional Either<Error, Success> pattern
This confirms there's a consistent, predictable pattern used across the codebase for mutual exclusivity validation.
----
Let's examine a controller that does not enforce mutual exclusivity at runtime to make sure that we have a reliable structural signal.

Examine the controller for the Activate Jobs endpoint. This endpoint has no mutual exclusivity in the request schema.

Do you understand what we are looking for in the structural signals? We want to exhaustively examine the controllers for runtime-enforced mutual exclusivity that is currently not encoded in the schema. So we are looking for the validation pattern that tells us this behaviour exists at runtime. By looking at a controller that does not implement this behaviour we are building a reliable pattern to match against. Make sense? Any questions?
----
Absolutely! That makes perfect sense. We're building a differential analysis to identify the structural signals that indicate runtime mutual exclusivity enforcement.

What We're Looking For:
Positive Signal (Mutual Exclusivity Present):
Validation functions that check for both null + both non-null conditions
Usage of ERROR_MESSAGE_AT_LEAST_ONE_FIELD and ERROR_MESSAGE_ONLY_ONE_FIELD
XOR validation logic patterns

Negative Signal (No Mutual Exclusivity):
Validation functions that only check individual field constraints
No XOR logic (no "both null" + "both present" checks)
Standard field validation without exclusivity rules
Let me examine the Activate Jobs endpoint controller to establish the negative pattern.

----Reliable Structural Signals for Detection ✅
POSITIVE INDICATORS (Mutual Exclusivity Present):

🔍 XOR Logic Pattern: (fieldA == null && fieldB == null) + (fieldA != null && fieldB != null)
🔍 Specific Error Constants: ERROR_MESSAGE_AT_LEAST_ONE_FIELD + ERROR_MESSAGE_ONLY_ONE_FIELD
🔍 Field Pair References: Error messages mentioning multiple field names in lists
NEGATIVE INDICATORS (No Mutual Exclusivity):

❌ Simple Null Checks: Only field == null or field.isBlank() patterns
❌ Different Error Constants: ERROR_MESSAGE_EMPTY_ATTRIBUTE, ERROR_MESSAGE_INVALID_ATTRIBUTE_VALUE
❌ Single Field Focus: Each validation block focuses on one field independently
This gives us a robust pattern matching strategy to scan the codebase for all instances of runtime mutual exclusivity validation!

Questions:

Should we now scan all validator classes for these XOR patterns?
Do you want me to build a systematic search to find all instances of this pattern across the codebase?
----
Let's do both. First, I want you to do the scan directly and produce a report. Then, we will build an AST scanner that can do this, for cross-validation. 

You do the scan directly first, then we will regroup around the report before building the AST scanner. 
----

The report I created (MUTUAL_EXCLUSIVITY_SCAN_REPORT.md) contains the complete analysis with code examples, error messages, schema recommendations using oneOf constructs, and detailed architectural analysis.

Ready to proceed with building the AST scanner for cross-validation? This manual scan gives us a solid foundation and confirms we have a reliable pattern to match against programmatically.
----
Yes. Build it in java/runtime-mutual-exclusivity
----
Now we need to approach this issue from the other side. 

How do we identify mutually exclusive request bodies in the schema? Use the rest-api.domain.yaml schema to reason about this. 

I want to ensure that we can exhaustively identify programmatically all mutually exclusive request bodies modelled in the schema. 

Analyse the schema and give me a report on its current state, and your suggestions on approaches to identifying this pattern in a generalised way.
----
The problem is subtly different on this side. Assume that the rest-api.domain.yaml is an accurate description of the schema. (I am going to update evaluate decision to modelled the mutually-exclusive constraint).

How do we reason about the schema to make a statement that "the following request bodies contain a mutually-exclusive constraint"?

We would be reasoning about request bodies, and from there what are we looking for? oneOf, I am thinking.

So that would give us: request bodies > oneOf.

Let's start there. Give me a report on all the request bodies that currently contain a oneOf schema.

We can then look at those to determine what further discrimination we need to do.
---
Summary
I've completed a comprehensive analysis of request bodies with mutual exclusivity constraints in the OpenAPI schema. Here are the key findings:

Current State
✅ Only 1 request body properly uses oneOf for mutual exclusivity:

Endpoint: POST /process-instances
Schema: ProcessInstanceCreationInstruction
Pattern: Choice between ID-based and Key-based process definition selection
Implementation: Properly separated into ProcessInstanceCreationInstructionById and ProcessInstanceCreationInstructionByKey
Broader OneOf Usage
18 total schemas use oneOf constructs, but only 1 is for request body mutual exclusivity:

Request Body Mutual Exclusivity (1): ProcessInstanceCreationInstruction
Search Filter Polymorphism (13): Various filter properties supporting simple values OR advanced filter objects
Pagination Strategy Selection (1): SearchQueryPageRequest for different pagination approaches
Key Type Unions (3): ResourceKey, BatchOperationKey for union types
Detection Strategy
Primary Pattern: RequestBody → Schema → oneOf

Discrimination Criteria for true mutual exclusivity:

✅ Alternative identification methods (ID vs Key)
✅ Required field differences per option
✅ Semantic equivalence (same goal, different path)
✅ Business logic: "either this way OR that way"
Non-mutual exclusivity patterns:

❌ Polymorphic types (genuinely different structures)
❌ Filter unions (simple value OR complex filter)
❌ Strategy patterns (different algorithms)
Gap Analysis
Based on our runtime validation analysis, there's at least 1 missing oneOf construct:

DecisionEvaluationInstruction should use oneOf for decisionDefinitionId vs decisionDefinitionKey
Next Steps
Fix the known gap: Transform DecisionEvaluationInstruction to use oneOf
Systematic discovery: Find other request bodies with ID/Key patterns
Cross-validation: Compare with runtime XOR validation patterns
Automation: Build CI/CD validation to prevent schema/runtime mismatches
This analysis provides a solid foundation for systematically identifying and fixing mutual exclusivity modeling inconsistencies between the OpenAPI schema and runtime validation behavior.
----
You say:

Key Type Unions (3): ResourceKey, BatchOperationKey for union types

The count is three, but I only see two there. Please explain this.
----
You're absolutely correct! I made an error in my analysis. There are only 2 schemas that are key type unions, not 3:

ResourceKey (5 oneOf options)
BatchOperationKey (2 oneOf options)
Let me correct this in the report and also double-check where I might have gotten the third one from:

