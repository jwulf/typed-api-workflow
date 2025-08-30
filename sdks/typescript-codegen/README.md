# Camunda 8 Orchestration Cluster TypeScript SDK (Generator)

This project generates the runtime SDK package `@camunda8/orchestration-cluster` using `openapi-typescript-codegen` plus post-processing for:

- Zod schemas & branded semantic types (runtime nominal types)
- Unions (oneOf/anyOf/allOf + discriminators) normalization
- Env-gated request and response validation (single var: `CAMUNDA_SDK_VALIDATION`)
- Dual module build (ESM + CJS) for Node 18+ and browsers (native fetch)

## Scripts

`npm run generate` – Run codegen + postprocess (outputs into `src/gen` and augmented files under `src/semantic`).

`npm run build` – Clean, regenerate, bundle to `dist/` (ESM & CJS + types).

## Environment Variables

`CAMUNDA_SDK_VALIDATION` unified grammar (case-insensitive):

Global modes (apply to request + response):
   - `none`   – disable all validation (default if unset)
   - `warn`   – warn and return original data
   - `strict` – throw on validation errors

Side-specific form (comma separated):
   - `req:<mode>` and/or `res:<mode>` where `<mode>` is `none|warn|strict`
   - Omitted side defaults to `none`.

Examples:
   - `CAMUNDA_SDK_VALIDATION=warn` -> request warn, response warn
   - `CAMUNDA_SDK_VALIDATION=req:strict` -> request strict, response none
   - `CAMUNDA_SDK_VALIDATION=res:strict` -> request none, response strict
   - `CAMUNDA_SDK_VALIDATION=req:warn,res:strict`

## Architecture

1. Codegen step creates service classes + models using `fetch` client.
2. Postprocess parses the OpenAPI spec (`rest-api.domain.yaml`) and emits:
   - `semanticTypes.ts` (brands + primitive Zod schemas)
   - `zodModels.ts` (object schemas mapped from component schemas)
   - `unions.ts` (discriminated & composite unions)
   - `wrappedServices.ts` (function-style wrappers with validation & branding integration)
3. `src/index.ts` re-exports class-based services and function wrappers.

## TODO (Future Enhancements)

- Advanced anyOf/allOf property merging for composed schemas
- Operation-specific response union narrowing
- Pagination helpers & error classification
- Auth pluggable interceptors

---

Generated SDK consumer install (after publish):

```bash
npm install @camunda8/orchestration-cluster
```

```ts
import { createClient, startProcessInstance } from '@camunda8/orchestration-cluster';
```
