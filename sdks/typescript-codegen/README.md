<!-- Greenfield public README for the Camunda 8 Orchestration Cluster TypeScript SDK -->

# Camunda 8 Orchestration Cluster TypeScript SDK (Pre‑release)

Type‑safe, promise‑based client for the Camunda 8 Orchestration Cluster REST API.

## Highlights
* Strong TypeScript models (requests, responses, discriminated unions)
* Branded key types to prevent mixing IDs at compile time
* Optional request/response schema validation (Zod) via a single env variable
* OAuth2 client‑credentials & Basic auth (token cache, early refresh, jittered retry, singleflight)
* Optional mTLS (Node) with inline or *_PATH environment variables
* Cancelable promises for all operations
* Eventual consistency helper for polling endpoints
* Immutable, deep‑frozen configuration accessible through a factory‑created client instance

## Install
```bash
npm install @camunda8/orchestration-cluster
```
Requires Node 18+ (native fetch). Provide a fetch ponyfill if targeting older runtimes.

## Quick Start (Zero‑Config – Recommended)
Keep configuration out of application code. Let the factory read `CAMUNDA_*` variables from the environment (12‑factor style). This makes rotation, secret management, and environment promotion safer & simpler.

```ts
import createCamundaClient from '@camunda8/orchestration-cluster';

// Zero‑config construction: reads CAMUNDA_* from process.env once.
const camunda = createCamundaClient();

const topology = await camunda.getTopology();
console.log('Brokers:', topology.brokers?.length ?? 0);
```

Typical `.env` (example):
```bash
CAMUNDA_REST_ADDRESS=https://cluster.example
CAMUNDA_AUTH_STRATEGY=OAUTH
CAMUNDA_CLIENT_ID=***
CAMUNDA_CLIENT_SECRET=***
```

> Prefer environment / secret manager injection over hard‑coding values in source. Treat the SDK like a leaf dependency: construct once near process start, pass the instance where needed.

> **Why zero‑config?**  
> * Separation of concerns: business code depends on an interface, not on secret/constants wiring.  
> * 12‑Factor alignment: config lives in the environment → simpler promotion (dev → staging → prod).  
> * Secret rotation & incident response: rotate credentials without a code change or redeploy of application containers built with baked‑in values.  
> * Immutable start: single hydration pass prevents drift / mid‑request mutations.  
> * Test ergonomics: swap an `.env.test` (or injected vars) without touching source; create multiple clients for multi‑tenant tests.  
> * Security review: fewer code paths handling secrets; scanners & vault tooling work at the boundary.  
> * Deploy portability: same artifact runs everywhere; only the environment differs.  
> * Observability clarity: configuration diffing is an ops concern, not an application code diff.

### Advanced: Programmatic Overrides
Use only when you must supply or mutate configuration dynamically (e.g. multi‑tenant routing, tests, ephemeral preview environments). Keys mirror their `CAMUNDA_*` env names.

```ts
const camunda = createCamundaClient({
  config: {
    CAMUNDA_REST_ADDRESS: 'https://cluster.example',
    CAMUNDA_AUTH_STRATEGY: 'BASIC',
    CAMUNDA_BASIC_AUTH_USERNAME: 'alice',
    CAMUNDA_BASIC_AUTH_PASSWORD: 'secret'
  }
});
```

### Advanced: Custom Fetch Implementation
Inject a custom `fetch` to add tracing, mock responses, instrumentation, circuit breakers, etc.
```ts
const camunda = createCamundaClient({ fetch: (input, init) => {
  // inspect / modify request here
  return fetch(input, init);
}});
```

### Reconfiguration At Runtime (Rare)
You can call `client.configure({ config: { ... } })` to re‑hydrate. The exposed `client.getConfig()` stays `Readonly` and deep‑frozen. Prefer creating a new client instead of mutating a shared one in long‑lived services.

## Validation
Controlled by `CAMUNDA_SDK_VALIDATION` (or `config` override). Grammar:
```
none | warn | strict | req:<mode>[,res:<mode>] | res:<mode>[,req:<mode>]
<mode> = none|warn|strict
```
Examples:
```bash
CAMUNDA_SDK_VALIDATION=warn           # warn on both
CAMUNDA_SDK_VALIDATION=req:strict,res:warn
CAMUNDA_SDK_VALIDATION=none
```
Behavior:
* `request` side: validate JSON body (if schema) before sending
* `response` side: validate documented JSON 2xx payloads
* `warn` logs and returns original data; `strict` throws; `none` skips

## Authentication
Set `CAMUNDA_AUTH_STRATEGY` to `NONE` (default), `BASIC`, or `OAUTH`.

Basic:
```
CAMUNDA_AUTH_STRATEGY=BASIC
CAMUNDA_BASIC_AUTH_USERNAME=alice
CAMUNDA_BASIC_AUTH_PASSWORD=supersecret
```
OAuth (client credentials):
```
CAMUNDA_AUTH_STRATEGY=OAUTH
CAMUNDA_CLIENT_ID=yourClientId
CAMUNDA_CLIENT_SECRET=yourSecret
CAMUNDA_OAUTH_URL=https://idp.example/oauth/token   # if required by your deployment
```
Optional audience / retry / timeout vars are also read if present (see generated config reference).

Auth helper features (automatic inside the client):
* Disk + memory token cache
* Early refresh with skew handling
* Exponential backoff & jitter
* Singleflight suppression of concurrent refreshes
* Hook: `client.onAuthHeaders(h => ({ ...h, 'X-Trace': 'abc' }))`
* Force refresh: `await client.forceAuthRefresh()`
* Clear caches: `client.clearAuthCache({ disk: true, memory: true })`

### Token Caching & Persistence

The SDK always keeps the active OAuth access token in memory. Optional disk persistence (Node only) is enabled by setting:

```bash
CAMUNDA_OAUTH_CACHE_DIR=/path/to/cache
```

When present and running under Node, each distinct credential context (combination of `oauthUrl | clientId | audience | scope`) is hashed to a filename:

```
<CAMUNDA_OAUTH_CACHE_DIR>/camunda_oauth_token_cache_<hash>.json
```

Writes are atomic (`.tmp` + rename) and use file mode `0600` (owner read/write). On process start the SDK attempts to load the persisted file to avoid an unnecessary token fetch; if the token is near expiry it will still perform an early refresh (5s skew window plus additional safety buffer based on 5% or 30s minimum).

Clearing / refreshing:
* Programmatic clear: `client.clearAuthCache({ disk: true, memory: true })`
* Memory only: `client.clearAuthCache({ memory: true, disk: false })`
* Force new token (ignores freshness): `await client.forceAuthRefresh()`

Disable disk persistence by simply omitting `CAMUNDA_OAUTH_CACHE_DIR` (memory cache still applies). For short‑lived or serverless functions you may prefer no disk cache to minimize I/O; for long‑running workers disk caching reduces cold‑start latency and load on the identity provider across restarts / rolling deploys.

Security considerations:
* Ensure the directory has restrictive ownership/permissions; the SDK creates files with `0600` but will not alter parent directory permissions.
* Tokens are bearer credentials; treat the directory like a secrets store and avoid including it in container image layers or backups.
* If you rotate credentials (client secret) the filename hash changes; old cache files become unused and can be pruned safely.

Browser usage: There is no disk concept—if executed in a browser the SDK (when strategy OAUTH) attempts to store the token in `sessionStorage` (tab‑scoped). Closing the tab clears the cache; a new tab will fetch a fresh token.

If you need a custom persistence strategy (e.g. Redis / encrypted keychain), wrap the client and periodically call `client.forceAuthRefresh()` while storing and re‑injecting the token via a headers hook; first measure whether the built‑in disk cache already meets your needs.

## mTLS (Node only)
Provide inline or path variables (inline wins):
```
CAMUNDA_MTLS_CERT / CAMUNDA_MTLS_CERT_PATH
CAMUNDA_MTLS_KEY  / CAMUNDA_MTLS_KEY_PATH
CAMUNDA_MTLS_CA   / CAMUNDA_MTLS_CA_PATH (optional)
CAMUNDA_MTLS_KEY_PASSPHRASE (optional)
```
If both cert & key are available an https.Agent is attached to all outbound calls (including token fetches).

## Branded Keys
Import branded key helpers directly:
```ts
import { ProcessDefinitionKey, ProcessInstanceKey } from '@camunda8/orchestration-cluster';

const defKey = ProcessDefinitionKey.assumeExists('2251799813686749');
// @ts-expect-error – cannot assign def key to instance key
const bad: ProcessInstanceKey = defKey;
```
They are zero‑cost runtime strings with compile‑time separation.

## Cancelable Operations
All methods return a `CancelablePromise<T>`:
```ts
const p = camunda.searchProcessInstances({ filter: { processDefinitionKey: defKey } });
setTimeout(()=> p.cancel(), 100); // best‑effort cancel
await p; // rejects with CancelError if aborted
```

## Eventual Consistency Polling
Some endpoints accept consistency management options. Pass a `consistency` block (where supported) with `waitUpToMs` and optional `pollIntervalMs` (default 500). If the condition is not met within timeout an `EventualConsistencyTimeoutError` is thrown.

## Logging
Per‑client logger; no global singleton. The level defaults from `CAMUNDA_SDK_LOG_LEVEL` (default `error`).

```ts
const client = createCamundaClient({
  log: {
    level: 'info',
    transport: evt => {
      // evt: { level, scope, ts, args, code?, data? }
      console.log(JSON.stringify(evt));
    }
  }
});

const log = client.logger('worker');
log.debug(() => ['expensive detail only if enabled', { meta: 1 }]);
log.code('info', 'WORK_START', 'Starting work loop', { pid: process.pid });
```

Lazy args (functions with zero arity) are only invoked if the level is enabled.

Update log level / transport at runtime via `client.configure({ log: { level: 'debug' } })`.

### Default Behaviour
Without any explicit `log` option:
* Level = `error` (unless `CAMUNDA_SDK_LOG_LEVEL` is set)
* Transport = console (`console.error` / `console.warn` / `console.log`)
* Only `error` level internal events are emitted (e.g. strict validation failure summaries, fatal auth issues)
* No info/debug/trace noise by default

To silence everything set level to `silent`:
```bash
CAMUNDA_SDK_LOG_LEVEL=silent
```

To enable debug logs via env:
```bash
CAMUNDA_SDK_LOG_LEVEL=debug
```

### Bring Your Own Logger
Provide a `transport` function to forward structured `LogEvent` objects into any logging library.

#### Pino
```ts
import pino from 'pino';
import createCamundaClient from '@camunda8/orchestration-cluster';

const p = pino();
const client = createCamundaClient({
  log: {
    level: 'info',
    transport: e => {
      const lvl = e.level === 'trace' ? 'debug' : e.level; // map trace
      p.child({ scope: e.scope, code: e.code }).[lvl]({ ts: e.ts, data: e.data, args: e.args }, e.args.filter(a=>typeof a==='string').join(' '));
    }
  }
});
```

#### Winston
```ts
import winston from 'winston';
import createCamundaClient from '@camunda8/orchestration-cluster';

const w = winston.createLogger({ transports: [ new winston.transports.Console() ] });
const client = createCamundaClient({
  log: {
    level: 'debug',
    transport: e => {
      const lvl = e.level === 'trace' ? 'silly' : e.level; // winston has 'silly'
      w.log({
        level: lvl,
        message: e.args.filter(a=>typeof a==='string').join(' '),
        scope: e.scope,
        code: e.code,
        data: e.data,
        ts: e.ts
      });
    }
  }
});
```

#### loglevel
```ts
import log from 'loglevel';
import createCamundaClient from '@camunda8/orchestration-cluster';

log.setLevel('info'); // host app level
const client = createCamundaClient({
  log: {
    level: 'info',
    transport: e => {
      if (e.level === 'silent') return;
      const method = (['error','warn','info','debug'].includes(e.level) ? e.level : 'debug') as 'error'|'warn'|'info'|'debug';
      (log as any)[method](`[${e.scope}]`, e.code ? `${e.code}:` : '', ...e.args);
    }
  }
});
```

#### Notes
* Map `trace` to the nearest available level if your logger lacks it.
* Use `log.code(level, code, msg, data)` for machine-parsable events.
* Redact secrets before logging if you add token contents to custom messages.
* Reconfigure later: `client.configure({ log: { level: 'warn' } })` updates only that client.
* When the effective level is `debug` (or `trace`), the client emits a lazy `config.hydrated` event on construction and `config.reconfigured` on `configure()`, each containing the redacted effective configuration `{ config: { CAMUNDA_... } }`. Secrets are already masked using the SDK's redaction rules.

## Errors
May throw:
* Network / fetch failures
* Non‑2xx HTTP responses
* Validation errors (strict mode)
* `EventualConsistencyTimeoutError`
* `CancelError` on cancellation

## Pagination
Search endpoints expose typed request bodies that include pagination fields. Provide the desired page object; auto‑pagination is not (yet) bundled.

## Configuration Reference
Generated doc enumerating all supported environment variables (types, defaults, conditional requirements, redaction rules) is produced at build time:
```
./docs/CONFIG_REFERENCE.md
```

## Testing Patterns
Create isolated clients per test file:
```ts
const client = createCamundaClient({ config: { CAMUNDA_REST_ADDRESS: 'http://localhost:8080', CAMUNDA_AUTH_STRATEGY: 'NONE' } });
```
Inject a mock fetch:
```ts
const client = createCamundaClient({ fetch: async (input, init) => new Response(JSON.stringify({ ok: true }), { status: 200 }) });
```

## License
Apache 2.0


