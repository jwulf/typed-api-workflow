# Path Analyser

Generates endpoint scenario chains that satisfy semantic type requirements using the operation dependency graph and then (optionally) emits Playwright test suites from those scenarios.

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
- `dist/feature-output/index.json` – summary of processed endpoints.

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

- `<operationId>.feature.spec.ts` – One test per scenario in the collection (currently status-code assertions; body templates & deeper field assertions forthcoming).

### Running the Generated Tests

You can execute a generated spec with Playwright directly (ensure you have installed `@playwright/test`, which this package already depends on):

```bash
npx playwright test dist/generated-tests/searchProcessInstances.feature.spec.ts
```

Or run all generated specs (when multiple exist):

```bash
npx playwright test dist/generated-tests
```

### Environment Variables

The runtime uses a small env helper (`src/codegen/support/env.ts`):

- `API_BASE_URL` – Base URL of the target API (default: `http://localhost:8080`).
- `API_TOKEN` – Bearer token used for `Authorization` header (default: `dev-token`).

Example:

```bash
API_BASE_URL=https://api.example.com API_TOKEN=abc123 \
	npx playwright test dist/generated-tests/searchProcessInstances.feature.spec.ts
```

### Current Test Generation Scope

Implemented:

- Per-scenario request plan (currently usually a single step per endpoint).
- Status code assertion (uses extracted success status when available, default 200).
- Hook for future variable extraction (captures semantic-labeled fields when present).

Planned / Upcoming:

- Request body template emission (including oneOf minimal/rich variants and union violation negative cases).
- Filter parameter population for search endpoints.
- Field/value assertions based on response shape metadata.
- Path parameter binding resolution from scenario bindings.
- Negative error schema (ProblemDetail) assertions.
- Multi-step chained scenarios (threading extracted variables across steps).

## Development Notes

Rebuild TypeScript before generating scenarios or code:

```bash
npm run build
```

Then regenerate scenarios & tests as needed. The code generator scans `dist/feature-output/` for a file whose `endpoint.operationId` matches the provided argument.

---

Feel free to extend the emitter in `src/codegen/playwright/emitter.ts` to add richer assertions or integrate additional frameworks.