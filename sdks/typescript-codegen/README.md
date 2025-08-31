<!--
End‑user documentation for the Camunda 8 Orchestration Cluster TypeScript SDK.
Internal/generation details live in MAINTAINER.md.
-->

# Camunda 8 Orchestration Cluster TypeScript SDK

Type‑safe, promise‑based client for the Camunda 8 Orchestration Cluster REST API.

Focus points:
* First‑class TypeScript types – request/response models, semantic branded IDs/keys.
* Optional request & response validation (Zod) via a single environment variable.
* Cancelable promises for long‑running operations.
* Function wrappers for ergonomic calls + underlying service classes if you prefer explicit style.

## Installation

```bash
npm install @camunda8/orchestration-cluster
# or
yarn add @camunda8/orchestration-cluster
# or
pnpm add @camunda8/orchestration-cluster
```

Requires Node 18+ (native fetch) or a browser environment. For older Node versions, bring your own fetch polyfill.

## Quick Start

```ts
import camunda from '@camunda8/orchestration-cluster';

// Point to your cluster / self‑managed gateway
camunda.OpenAPI.BASE = 'https://api.my-camunda.example';
// Optional auth header / interceptor (simplest: static)
camunda.OpenAPI.TOKEN = 'Bearer <token>'; // or set camunda.OpenAPI.HEADERS

// Deploy a BPMN (FormData resource upload)
const bpmn = new Blob([`<?xml version="1.0"?><definitions><!-- ... --></definitions>`], { type: 'application/xml' });
const deployment = await camunda.createDeployment({ formData: { resources: [bpmn] } });
const { processDefinitionKey } = deployment.deployments[0].processDefinition!;

// Start a process instance
const instance = await camunda.createProcessInstance({ requestBody: { processDefinitionKey, variables: { hello: 'world' } } });

// Search instances
const search = await camunda.searchProcessInstances({ requestBody: { filter: { processDefinitionKey } } });
console.log('Found', search.total, 'instances');
```

### Import Styles

Default export (recommended):
```ts
import camunda from '@camunda8/orchestration-cluster';
await camunda.getTopology();
```

Named flat operation imports (tree‑shake friendly):
```ts
import { getTopology, createProcessInstance } from '@camunda8/orchestration-cluster';
await getTopology();
```

Service class (lower‑level, mirrors OpenAPI operations):
```ts
import { ProcessInstanceService } from '@camunda8/orchestration-cluster';
await ProcessInstanceService.createProcessInstance({ requestBody: { /* ... */ } });
```

Branded key helpers:
```ts
import { ProcessInstanceKey } from '@camunda8/orchestration-cluster';
const key = ProcessInstanceKey.assumeExists('123'); // runtime brand (string at runtime, distinct type in TS)
```

## Validation

Validation is opt‑in and controlled by a single environment variable read at runtime: `CAMUNDA_SDK_VALIDATION`.

Modes (case‑insensitive):
* `none` (default) – No validation.
* `warn` – Validate; on error, log a warning and return raw data.
* `strict` – Validate; on error, throw.

You can set a global mode or specify request/response separately:

Global (applies to both request & response):
```bash
CAMUNDA_SDK_VALIDATION=warn node app.js
```

Side‑specific (comma separated pairs):
```bash
CAMUNDA_SDK_VALIDATION=req:strict,res:warn node app.js
```

Accepted grammar:
```
<globalMode>
   | req:<mode>[,res:<mode>]
   | res:<mode>[,req:<mode>]

<mode> ::= none | warn | strict
```

Examples:
* `CAMUNDA_SDK_VALIDATION=res:strict` → only response validation strict; requests unvalidated.
* `CAMUNDA_SDK_VALIDATION=req:warn,res:strict` → request warnings, response throws.
* Unset / malformed → treated as `req:none,res:none`.

Scope:
* Request validation applies (where a JSON body exists) before the HTTP call.
* Response validation applies (where a JSON success schema exists) after the call resolves.
* Validation only covers documented 2xx JSON bodies.
* Non‑JSON responses (files, XML) are passed through.

Opt‑in philosophy: You decide when to pay the validation cost. Turn it on for tests, staging, or debugging; leave it off in hot paths if you trust the server.

## Configuration

The SDK exposes a unified, declarative configuration system (environment + explicit object overrides) covering authentication strategy, validation modes, and related flags. A machine‑generated reference (keys, types, defaults, conditional requirements, secret redaction) is available here:

👉 [Configuration Reference](./docs/SDK_REFERENCE.md)

Key points:
* `CAMUNDA_AUTH_STRATEGY` defaults to `NONE` (supports `OAUTH` and `BASIC`).
* Conditional requirements: OAuth requires `CAMUNDA_CLIENT_ID` & `CAMUNDA_CLIENT_SECRET`; Basic requires `CAMUNDA_BASIC_AUTH_USERNAME` & `CAMUNDA_BASIC_AUTH_PASSWORD`.
* Secrets are redacted in diagnostic/serialized output (masked except last 4 chars).
* Validation modes and verbose flag (`CAMUNDA_SDK_VALIDATION`, `CAMUNDA_SDK_VALIDATION_VERBOSE`) are part of the same spec.

Full guide: [Detailed Configuration Documentation](./docs/CONFIGURATION.md)

Common environment sets:

OAuth quick start:
```bash
export CAMUNDA_AUTH_STRATEGY=OAUTH
export CAMUNDA_CLIENT_ID=abc123
export CAMUNDA_CLIENT_SECRET=shhDontTellAnyone
export CAMUNDA_REST_ADDRESS=https://api.cluster.example
export CAMUNDA_SDK_VALIDATION=warn
```

Basic auth with mixed validation:
```bash
export CAMUNDA_AUTH_STRATEGY=BASIC
export CAMUNDA_BASIC_AUTH_USERNAME=alice
export CAMUNDA_BASIC_AUTH_PASSWORD=supersecret123
export CAMUNDA_SDK_VALIDATION=req:warn,res:strict
export CAMUNDA_SDK_VALIDATION_VERBOSE=1
```

Disable validation:
```bash
export CAMUNDA_SDK_VALIDATION=none
```

Programmatic hydration & redacted logging:
```ts
import { hydrateConfig } from '@camunda8/orchestration-cluster/dist/runtime/unifiedConfiguration';
import camunda from '@camunda8/orchestration-cluster';
const { config, redacted } = hydrateConfig();
camunda.OpenAPI.BASE = config.restAddress;
console.log('[config]', redacted);
```

Remote (browser) async fetch:
```ts
import { hydrateConfigAsync } from '@camunda8/orchestration-cluster/dist/runtime/unifiedConfiguration';
const { config } = await hydrateConfigAsync({ fetch: () => fetch('/sdk-config.json').then(r=>r.json()) });
```

Regenerate the reference after spec changes:

```bash
npm run docs
```


## Cancellation

All operations return a `CancelablePromise<T>` supporting:
```ts
const p = camunda.createProcessInstance({...});
p.cancel(); // signals cancellation (best effort) and rejects with a CancelError
```
Use this to abort long‑running awaits (e.g. large searches with awaitCompletion semantics elsewhere).

## Authentication

Simplest (static token):
```ts
camunda.OpenAPI.TOKEN = 'Bearer <token>';
```

Dynamic per‑request headers:
```ts
camunda.OpenAPI.HEADERS = () => ({ Authorization: `Bearer ${getToken()}` });
```

## Error Handling

Throwing conditions:
* Network / fetch errors.
* Non‑2xx responses (status & body exposed in error). Note: typed success schemas apply only to documented 2xx paths.
* Validation errors in `strict` mode.
* Cancellation via `.cancel()` produces a `CancelError` (check `err.isCancelled`).

In `warn` mode, validation errors log (console.warn) and the unparsed data is returned.

## Pagination

Many search endpoints accept a `page` property supporting offset or cursor strategies. The SDK exposes only typed models; it does not yet auto‑iterate pages. Provide the desired pagination shape in the `requestBody.page` object.

## Branded IDs & Keys

System-assigned resource keys are exposed as branded string types (e.g. `ProcessDefinitionKey`). At runtime they are plain strings. Use the `.assumeExists()` helper to lift a raw id you already obtained from the cluster, or assign from existing branded values. This catches accidental mixups at compile time without runtime overhead.

Example:

```typescript
import { ProcessDefinitionKey } from '@camunda8/orchestration-cluster';

const processDefinitionKey = ProcessDefinitionKey.assumeExists('2251799813686749')
```

## Tree Shaking

Import only what you use with named operation exports to minimize bundle size in front‑end builds. The default export remains convenient for back‑end scripts.

## Migrating From Raw REST Calls

1. Replace manual fetch with corresponding `camunda.<operationId>` call.
2. Move request JSON into `{ requestBody: {...} }` shape.
3. (Optional) Enable validation in development: `CAMUNDA_SDK_VALIDATION=res:strict`.
4. Adopt branded types progressively (wrap raw keys using helper `.assumeExists`).

## FAQ

**Q: Does the SDK auto‑refresh tokens?**  No, supply updated tokens via `OpenAPI.TOKEN` or `HEADERS` callback.

**Q: How do I disable validation warnings in warn mode?**  Set mode to `none` or redirect console.warn.

**Q: Can I supply my own fetch implementation?**  Assign `camunda.OpenAPI.FETCH` to a compatible function `(url, init) => Promise<Response>`.

**Q: Where are the raw service classes?**  All exported under the root; e.g. `import { ProcessInstanceService } from '@camunda8/orchestration-cluster';`.

## Contributing / Internal Details

For code generation & maintainer notes see `MAINTAINER.md` in this package.

---

Released under the Apache 2.0 License.

