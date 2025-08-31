# Maintainer Guide (Camunda 8 Orchestration Cluster TypeScript SDK)

This document captures generation, architecture, and contributor details. End‑user docs live in `README.md`.

## Overview

Pipeline (invoked via `npm run build`):
1. Base generation (`openapi-typescript-codegen`) from `../../rest-api.domain.yaml`.
2. Post‑processing script (`scripts/postprocess.ts` chain) applies:
   * Semantic key branding (primitive string brands + helpers).
   * Union (oneOf/anyOf/allOf) normalization with Zod discriminators.
   * Overload insertion for selected operations (evaluation, pagination, instruction unions).
   * Zod schema emission for every component (lazy loaded models allowed).
   * Public index generation.
3. Wrapper generation (`scripts/wrapOperations.ts`): builds `src/gen/wrappers/autoWrappers.ts` + `flatExports.ts`.
4. Type + runtime tests (Vitest) run automatically during build.
5. Bundling with `tsup` (ESM + CJS + .d.ts).

## Generated Layout (src/gen)

- `core/` – runtime primitives (`CancelablePromise`, request helper, etc.)
- `models/` – raw TypeScript models from codegen.
- `semantic/` – Zod schemas + brands (`zodModels.ts`, `semanticTypes.ts`, `unions.ts`).
- `services/` – static service classes per tag / domain.
- `wrappers/` – function wrappers with validation + cancel propagation.

## Wrapper Generator Contract

See annotated header in `scripts/wrapOperations.ts` for invariants. Highlights:
- Preserve `CancelablePromise<R>` typing via `wrapCallWithReq<A,R>` generics.
- Request validation only when a schema exists and `req` mode != none.
- Response validation only when a success schema exists and `res` mode != none.
- Cancel propagation: wrapper `.cancel()` triggers inner cancel when a wrapping layer is constructed.
- Overloads remain in service classes; wrappers expose unified single param object.

## Validation Environment Variable Grammar

`CAMUNDA_SDK_VALIDATION` (case‑insensitive):
- Global: `none|warn|strict` → applies to request + response.
- Pair list: `req:<mode>[,res:<mode>]` and/or `res:<mode>[,req:<mode>]`; unspecified side defaults to `none`.

Parsing logic in `src/runtime/config.ts` (kept intentionally small + cached per process env value).

## Adding / Adjusting Overloads

Overloads inserted post‑generation by pattern matching within service `.ts` files. Search for `@overload-inserted` comments for anchors. Adjust postprocess script if spec introduces new polymorphic structures.

## Branded Keys

Primitive branded types use `type X = string & { readonly __brand: 'X' }` (or Zod `.brand<'X'>()`) hidden behind helper factories `X.create(value: string)`. Keep runtime cost minimal: functions return the input cast.

Adding a new key:
1. Ensure model or schema includes the underlying string field.
2. Extend key list in the branding generation step (see `postprocess` script section generating semantic key helpers).
3. Rebuild; verify `tests/key-branding.test.ts` covers new key.

## Tests

Key test categories:
- `type-signatures.test.ts` – ensures wrappers retain typed returns & no `any` erosion.
- `request-validation-completeness.test.ts` – every JSON requestBody op has a request schema wrapper.
- `wrapper-validation.test.ts` – response parsing behaviors.
- `cancel-propagation.test.ts` – cancel propagation contract.
- Branding tests – brand round‑trip & primitive behavior.

When modifying the generator, strengthen tests first (red → green workflow) to catch regressions.

## Adding a New Operation Wrapper Behavior

1. Extend generator logic in `wrapOperations.ts` (avoid editing `autoWrappers.ts`).
2. Add / update tests to cover behavior.
3. Run `npm run build` locally; confirm all tests green.

## Releasing

(Assuming publication pipeline is set externally.)
1. Update `CHANGELOG.md` (root or package specific) with notable changes.
2. Bump version in `package.json`.
3. Tag & publish per internal release process.

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Missing wrapper for op | Tag inference failure | Ensure spec tag matches service or add mapping logic. |
| Return type shows `any` | Generator inference regression | Check `wrapCallWithReq` generics & tests. |
| Validation not running | Env var unset or mode `none` | Export `CAMUNDA_SDK_VALIDATION=res:strict` before run. |
| Cancellation not cancelling | Response schema absent (no outer promise) | Behavior is best effort; ensure schema or review wrapper code. |

## Style Notes

- Keep generated files compact; avoid unnecessary whitespace to keep diff noise low.
- Avoid importing unused schemas; tree‑shaking relies on minimal references.
- Use small helper functions in generator for clarity if logic grows; keep hot path lean.

## Future Ideas

- Automatic pagination helpers.
- Structured error classes per response code.
- Pluggable auth / retry middleware.
- Partial response (field selection) support if API adds server‑side projection.

---

For deeper changes, open a draft PR early to share approach & gather feedback.
