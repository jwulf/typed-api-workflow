Add a test that z.infer<typeof Schema> is assignable to the exported TypeScript type (using a tsd or conditional type assertion pattern).
Generate Zod first and derive TS types from z.infer (single source).


Remove the unwrapped services export, to make sure that users only use the schema validating calls.

## Preprocess Spec to get CamundaKeys via templates vs post-processing

Prompt:

Implement a spec preprocessor and adapt codegen postprocess to use x-camunda-key instead of regex alias rewrites.

Context: Repo: sdks/typescript-codegen/ Primary spec input: rest-api.generated.yaml (or current spec used by scripts/generate.ts – verify). Current branding: postprocess.ts rewrites generated model alias files matching BRAND_NAME_REGEX, injecting imports from gen/semantic/camundaKeys. Goal: Explicitly mark every schema that inherits (directly or via transitive allOf chain) from components.schemas.CamundaKey with vendor extension x-camunda-key: true (and optional x-camunda-key-name: <SchemaName>), then simplify postprocess to rely solely on the extension (no fragile regex searching of file contents).

Deliverables:

New script scripts/preprocess-spec.ts:

Reads source spec (rest-api.domain.yaml or chosen input).
Builds inheritance graph over components.schemas using allOf $ref entries.
Finds all descendants of CamundaKey (exclude CamundaKey itself).
Adds: x-camunda-key: true x-camunda-key-name: <schemaName>
Writes updated spec to rest-api.generated.with-keys.yaml (or replace the current generated one the generator consumes).
Idempotent: re-running should not duplicate or mutate unchanged nodes (only add keys if absent).
Logs count summary.
Adjust generation pipeline (scripts/generate.ts or npm scripts):

Insert preprocessor before openapi-typescript-codegen invocation.
Ensure codegen consumes the annotated spec file.
Update postprocess.ts:

Remove / disable existing BRAND_NAME_REGEX alias rewrite block that scans model .ts files.
Instead, parse the spec (already parsed) and collect schemas with x-camunda-key: true to drive: a) Semantic key helper namespace generation (unchanged logic, but now sourced from extension list). b) Zod schema transforms for those keys.
Ensure base CamundaKey handling remains (stay simple alias).
Remove now-unneeded normalization rewriting for those aliases if no longer generated incorrectly (verify output).
Keep other unrelated logic (wrappers, JSDoc, index, hash, overloads).
Regenerate semantic helper file (camundaKeys.ts) using the new list.

Tests:

Add/adjust a unit test asserting every x-camunda-key schema produced a corresponding namespace in gen/semantic/camundaKeys.ts.
Ensure existing wrapper-validation and request-unwrapping tests still pass.
Clean up:

Delete dead code referencing BRAND_NAME_REGEX.
Update README or a short developer note (EVENTUAL.md or new DEV_NOTES) explaining new preprocessor step.
Acceptance Criteria:

Running npm run build runs preprocessor → codegen → postprocess → tests, all green.
No regex alias rewrites of model files for key branding remain.
camundaKeys.ts still lists identical set of key namespaces as before.
A diff of a previously generated key model file shows it no longer being mutated post-generation (i.e., model file stays simple alias or whatever upstream emits; branding handled elsewhere).
request.ts patch still works (not part of this change).
Preprocessor reports count of discovered key schemas; that count matches number of namespaces generated.
Idempotency: second consecutive npm run build produces no git diff.
Edge Cases:

Multi-level inheritance (A allOf B, B allOf CamundaKey) is detected.
Cycles (should not exist) are guarded (detect and ignore).
Schemas already having x-camunda-key left untouched (don’t overwrite x-camunda-key-name if present unless identical).
Implementation Notes:

Use yaml library already in devDependencies.
Build a graph: map schemaName -> directParents (from allOf $refs).
DFS from CamundaKey to collect descendants.
Write vendor extensions before serialization (preserve existing order where feasible).
Keep formatting minimal; comments not required.
Produce necessary code changes; run tests; summarize changes.