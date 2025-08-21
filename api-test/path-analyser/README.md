# Path Analyser

Generates endpoint scenario chains that satisfy semantic type requirements using the operation dependency graph and can emit Playwright test suites from those scenarios.

## Install

```bash
npm install
```

## Generate Scenarios

```bash
npm start   # shorthand for: npm run build && npm run generate:scenarios
```

This produces JSON files under `dist/feature-output/` (feature coverage enriched scenarios) and legacy raw scenario files (graph based) under `dist/output/`.

Structure:

- `dist/feature-output/<method>--<path>-scenarios.json` – scenario collection for a single endpoint (feature coverage + metadata like `requestPlan`, `responseShapeFields`, oneOf variants, negative union variants, etc.).
- `dist/output/index.json` – summary of processed endpoints.

Constraints / heuristics:

- Max 20 scenarios per endpoint (feature coverage generator trims beyond this cap).
- Cycles in the dependency graph: one extra traversal iteration is allowed to satisfy semantic dependencies before pruning to avoid infinite loops.

## Generate Playwright Tests

After scenarios are built you can emit a Playwright spec for a specific `operationId`, or all specs at once.

```bash
npm run codegen:playwright -- <operationId>
# Example:
npm run codegen:playwright -- searchProcessInstances
# All endpoints:
npm run codegen:playwright:all
```

Outputs go to `dist/generated-tests/`:

- `<operationId>.feature.spec.ts` – One test per scenario in the collection. The emitter asserts:
  - Status code (using the extracted success status when available).
  - Presence and type of top-level fields in the final response.
  - For deployment responses, required inner fields for expected slices (e.g., `deployments[0].processDefinition.*`).
  - It parses JSON once and reuses it for all assertions.

### Running the Generated Tests

You can execute a generated spec with Playwright directly (ensure you have installed `@playwright/test`, which this package already depends on):

```bash
npx playwright test dist/generated-tests/searchProcessInstances.feature.spec.ts
```

Or run all generated specs (when multiple exist):

```bash
npx playwright test dist/generated-tests
```

Note: multipart endpoints (e.g., createDeployment) use a small fixture located under `fixtures/` by default. Adjust paths or variables as needed. Multipart requests are emitted using Playwright's keyed `multipart` object with `FilePayload` entries (`{ name, mimeType, buffer }`).

### Deployment Artifact Registry and Manifest

- Registry file (editable): `api-test/path-analyser/fixtures/deployment-artifacts.json`
  - Purpose: define deployable artifacts used by tests. The planner prefers these over generic defaults.
  - Shape:
    - `artifacts: Array<{ kind: string; path: string; description?: string; parameters?: Record<string, any> }>`
    - `kind` must match a domain artifact kind (e.g., `bpmnProcess`, `form`, `dmnDecision`, `dmnDrd`).
    - `path` is relative to `api-test/path-analyser/fixtures/`.
    - `description` is free text to capture notable characteristics.
    - Optional `parameters` can seed scenario bindings (e.g., `{ jobType: "sampleJobType" }`).
  - Example entries are provided for BPMN, Form, and DMN.

- Output manifest (read-only, regenerated): `api-test/path-analyser/dist/output/deployment-artifacts.manifest.json`
  - Purpose: machine-readable list of artifacts referenced by generated scenarios/tests.
  - Shape: `{ artifacts: [{ kind, path, description? }] }`
  - Use this file to build artifacts programmatically for a CI test environment or pre-seed step.

CreateDeployment coverage:
- The feature generator emits one scenario per declared artifact rule (BPMN, Form, DMN Decision, DMN DRD) using the registry to select files. Assertions verify the corresponding deployment slices in the response.

## Environment Variables

The runtime uses a small env helper (`src/codegen/support/env.ts`):

- `API_BASE_URL` – Base URL of the target API (default: `http://localhost:8080`).
- `API_TOKEN` – Bearer token used for `Authorization` header (default: `dev-token`).

Example:

```bash
API_BASE_URL=https://api.example.com API_TOKEN=abc123 \
  npx playwright test dist/generated-tests/searchProcessInstances.feature.spec.ts
```

## Response Shape Recorder

Purpose

- Capture real runtime responses from generated tests to inform schema defaults, error mappings, and which fields are actually present.
- Persist a sanitized JSONL log you can aggregate into a compact summary.

How it works

- The Playwright emitter automatically logs every request via two helpers:
  - `recordResponse({...})` appends one JSON line per request to `dist/runtime-observations/responses.jsonl`.
  - `sanitizeBody(value)` replaces concrete values with type-like placeholders (e.g., strings → "<string>").
- Each observation includes: timestamp, operationId, scenarioId/name, stepIndex, isFinal, method, pathTemplate, status, expectedStatus, and optional sanitized `bodyShape`.
- Logging is best-effort; recorder errors never fail tests.

Paths

- Runtime log: `dist/runtime-observations/responses.jsonl`
- Aggregated summary: `dist/runtime-observations/summary.json`

Usage

1) Generate and run tests (recorder is built-in):

```bash
npm run codegen:playwright -- <operationId>
npx playwright test dist/generated-tests/<operationId>.feature.spec.ts
```

2) Aggregate observations into a per-operation summary:

```bash
npm run observe:aggregate
```

Or run end-to-end for all endpoints:

```bash
npm run observe:run
```

What the summary contains

- Per operationId:
  - Total request count and status distribution (overall and final-step only).
  - Top-level response keys presence frequency across final responses.
  - One sanitized example body per observed status code.

Code references

- Recorder: `src/codegen/support/recorder.ts`
- Aggregator: `src/scripts/aggregate-observations.ts`
- Emitter integration: `src/codegen/playwright/emitter.ts` (search for `recordResponse`)

## Current Test Generation Scope

Implemented:

- Per-scenario request plan (usually a single step per endpoint; multi-step when dependencies exist).
- Status code assertion (uses extracted success status when available, default 200).
- Field presence/type assertions for final responses.
- Deployment slice assertions for createDeployment responses.

Planned / Upcoming:

- Additional negative error schema (ProblemDetail) assertions.
- Broader oneOf variant coverage and union violation tests.
- Filter parameter population for search endpoints.
- Path parameter binding resolution from scenario bindings.

## Development Notes

Rebuild TypeScript before generating scenarios or code:

```bash
npm run build
```

Then regenerate scenarios & tests as needed. The code generator scans `dist/feature-output/` for a file whose `endpoint.operationId` matches the provided argument.

---

Feel free to extend the emitter in `src/codegen/playwright/emitter.ts` to add richer assertions or integrate additional frameworks.