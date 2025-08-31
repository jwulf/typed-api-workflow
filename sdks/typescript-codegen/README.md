<!--
End‑user documentation for the Camunda 8 Orchestration Cluster TypeScript SDK.
Internal/generation details live in MAINTAINER.md.
-->

# Camunda 8 Orchestration Cluster TypeScript SDK

Type‑safe, promise‑based client for the Camunda 8 Orchestration Cluster REST API.

Focus points:
* First‑class TypeScript types – request/response models, semantic branded IDs/keys.
* Optional request & response validation (Zod) via a single environment variable.
* Built‑in OAuth (client_credentials) & Basic auth management (token caching, retry with jitter, early refresh, singleflight) + header hook composition.
* Optional mTLS (client cert) support for Node (inline PEM or *_PATH env vars; automatic https.Agent wiring).
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

## Authentication & mTLS

### Strategies
Select via `CAMUNDA_AUTH_STRATEGY` (`NONE` | `BASIC` | `OAUTH`).

Hydrate config & build the auth facade (recommended):
```ts
import camunda from '@camunda8/orchestration-cluster';
import { hydrateConfig } from '@camunda8/orchestration-cluster/dist/runtime/unifiedConfiguration';
import { createAuthFacade } from '@camunda8/orchestration-cluster/dist/runtime/auth';

const { config } = hydrateConfig();
camunda.OpenAPI.BASE = config.restAddress;
const auth = createAuthFacade(config);

// Optional: custom header hook (runs after Authorization header – can override it)
auth.registerHeadersHook(async headers => ({ ...headers, 'X-Trace': 'sdk-demo' }));

await camunda.getTopology(); // headers resolved lazily per request
```

### OAuth Features
* client_credentials only.
* Disk & in‑memory token cache (dir: `CAMUNDA_OAUTH_CACHE_DIR`, default `~/.camunda-sdk`).
* Early refresh (5s lead, skew buffer: max(30s,5% lifetime)).
* Exponential backoff (base `CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS`, max attempts `CAMUNDA_OAUTH_RETRY_MAX`) with ±20% jitter.
* Singleflight concurrent refresh suppression.
* `auth.forceRefresh()` and `auth.clearCache()` helpers.
* Adjustable log level via `CAMUNDA_SDK_LOG_LEVEL` (error by default).

### Basic Auth
Provide `CAMUNDA_BASIC_AUTH_USERNAME` & `CAMUNDA_BASIC_AUTH_PASSWORD` when strategy=BASIC.

### mTLS (Node)
Provide any of:
```
CAMUNDA_MTLS_CERT / CAMUNDA_MTLS_CERT_PATH
CAMUNDA_MTLS_KEY / CAMUNDA_MTLS_KEY_PATH
CAMUNDA_MTLS_CA / CAMUNDA_MTLS_CA_PATH (optional)
CAMUNDA_MTLS_KEY_PASSPHRASE (optional)
```
Inline values override *_PATH. If cert/key both present an https.Agent is created & reused for all requests (including token fetch). Browser builds ignore mTLS vars.

### Manual Static Token (bypass facade)
Still possible for bespoke flows:
```ts
camunda.OpenAPI.TOKEN = 'Bearer <token>'; // or
camunda.OpenAPI.HEADERS = () => ({ Authorization: 'Bearer ' + getToken() });
```

### Overriding Authorization
Use a headers hook (runs last):
```ts
auth.registerHeadersHook(async h => ({ ...h, Authorization: 'Custom ' + build() }));
```

### FAQ Snippets
Force refresh: `await auth.forceRefresh?.();`
Clear token cache: `auth.clearCache?.({ disk: true });`
Add tracing: `auth.registerHeadersHook(h => ({ ...h, 'X-Trace-Id': traceId }))`.

## Logging & Custom Transport
Set `CAMUNDA_SDK_LOG_LEVEL` to control verbosity (`silent|error|warn|info|debug|trace`).

Inject a custom transport (e.g. to forward into pino / winston) before making SDK calls. Import from the optional subpath (kept out of primary surface):
```ts
import { setTransport, getLogger, LogEvent } from '@camunda8/orchestration-cluster/logger';

// Avoid serializing huge objects to console; args may contain request bodies – pino and winston will handle this for you.
function smartTruncateRequest(obj, maxLength = 500) {
  const full = JSON.stringify(obj, null, 2);
  
  if (full.length <= maxLength) {
    return full;
  }
  
  // Try truncating individual string values first
  const withTruncatedStrings = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'string' && value.length > 100) {
      return value.slice(0, 100) + '...[truncated]';
    }
    return value;
  }, 2);
  
  if (withTruncatedStrings.length <= maxLength) {
    return withTruncatedStrings;
  }
  
  // Last resort: truncate but ensure valid JSON
  return JSON.stringify({
    ...obj,
    _truncated: true,
    _originalSize: full.length,
    _note: "Request body truncated for logging"
  });
}

// Example: route to console in structured JSON (or use pino.logger.info(evt))
setTransport((evt: LogEvent) => {
   const safeArgs = evt.args.map(a => typeof a === 'string' ? a : smartTruncateRequest(a));
   console.log(JSON.stringify({ ts: evt.ts, level: evt.level, scope: evt.scope, msg: safeArgs }));
});

// Optional manual logger usage
const log = getLogger('app');
log.info('SDK logging initialized');
```
Change level at runtime (tests / dynamic config):
```ts
process.env.CAMUNDA_SDK_LOG_LEVEL = 'debug';
// Next emitted log auto-detects new level.
```

Pino transport example: 

```typescript
import pino from 'pino';
import { setTransport, getLogger, LogEvent } from '@camunda8/orchestration-cluster/logger';

const base = pino({ level: 'info', messageKey: 'msg', timestamp: pino.stdTimeFunctions.isoTime });
const levelMap: Record<LogEvent['level'], pino.LevelWithSilent> = { silent:'silent', error:'error', warn:'warn', info:'info', debug:'debug', trace:'trace' };
setTransport(evt => {
  const logger = evt.scope ? base.child({ scope: evt.scope }) : base;
  const msg = evt.args.map(a => typeof a === 'string' ? a : (a instanceof Error ? (a.stack||a.message) : JSON.stringify(a))).join(' ');
  logger[levelMap[evt.level] || 'info']({ sdkTs: evt.ts }, msg);
});
getLogger('bootstrap').info('Pino transport active');
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

**Q: Does the SDK auto‑refresh tokens?**  Yes for OAuth when using the auth facade (early refresh with skew). For manual static token mode, you manage rotation yourself.

**Q: How do I disable validation warnings in warn mode?**  Set mode to `none` or redirect console.warn.

**Q: Can I supply my own fetch implementation?**  Assign `camunda.OpenAPI.FETCH` (and pass custom fetch into `createAuthFacade(config, { fetch })` so token fetch uses it too).

**Q: Where are the raw service classes?**  All exported under the root; e.g. `import { ProcessInstanceService } from '@camunda8/orchestration-cluster';`.
**Q: How do I enable mTLS?**  Set cert/key (inline or path). Example:
```bash
export CAMUNDA_MTLS_CERT_PATH=/etc/ssl/client.crt
export CAMUNDA_MTLS_KEY_PATH=/etc/ssl/client.key
```
Provide inline values to override path versions.

## Contributing / Internal Details

For code generation & maintainer notes see `MAINTAINER.md` in this package.

---

Released under the Apache 2.0 License.

