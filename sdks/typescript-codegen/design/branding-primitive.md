/**
# Primitive Branded Key Design

## Summary
Branded Camunda keys are now implemented as primitive `string` values with a compile-time only brand (`string & { readonly __brand: T }`). Factories validate constraints (length, pattern) and return the input string cast to the branded type. No `new String()` boxing or runtime object augmentation is performed.

## Motivation
Previous implementation boxed keys (`Object.assign(new String(value), { __type: ... })`) causing:
- Query string serialization anomalies (enumerable index properties) → required fragile postprocess patch in `request.ts`.
- Larger memory footprint and slower string operations due to wrapper objects.
- Additional runtime code to unwrap / normalize.

Primitive branding removes these issues: values serialize naturally, require no request patch, and preserve ergonomic usage anywhere a plain string is accepted (one‑way assignability).

## Type Shape
```ts
export type CamundaKey<T extends string> = string & { readonly __brand: T };
export type ProcessInstanceKey = CamundaKey<'ProcessInstanceKey'>;
```
The brand is erased at runtime; validation occurs only in factory functions.

## Factories
Each key namespace exposes `assumeExists`, `getValue`, `equals`, `isValid`. The verb "assumeExists" communicates that you already obtained (or otherwise trust) this id/key from the cluster (deployment / creation response, search result, correlation context, etc.) and are simply lifting it into its branded static type; no remote validation or fetch is performed. Implementations are intentionally minimal:
```ts
export namespace ProcessInstanceKey {
  // assumeExists: validate basic shape (length/pattern) then brand.
  export function assumeExists(value: string): ProcessInstanceKey { /* validate */ return value as ProcessInstanceKey; }
  export function getValue(k: ProcessInstanceKey): string { return k; }
  export function equals(a: ProcessInstanceKey, b: ProcessInstanceKey) { return a === b; }
}
```

## Migration Notes
1. Runtime behavior: Existing consumer code treating keys as strings continues to work; `typeof key === 'string'` now evaluates to true (previously 'object').
2. Removal of request patch: The bespoke `getQueryString` mutation is eliminated; native serialization suffices.
3. Tests updated: Branding tests now assert primitive nature (no enumerable indices, typeof 'string').

## Trade-offs
Pros:
- Simpler runtime (no wrapper allocation, no patch code).
- Predictable serialization (query params, JSON, logging).
- Fully preserves type safety & mutual exclusivity among different key brands.

Cons / Considerations:
- Brand erasure means runtime cannot distinguish key kinds; rely on type system and validation at creation sites.
- Equality semantics now strict primitive equality (was previously string coercion; effectively same for identical content).

## Future Enhancements
- Optional: generate inline JSDoc referencing original schema constraints near each factory.
- Potential: central validation helper to de-duplicate regex and length checks.

## Changelog Entry (suggested)
Refactor: adopt primitive branded string approach for semantic key types; remove boxed `String` objects and request serialization patch.

*/