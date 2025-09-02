// Canonical Camunda class template (manually maintained)
// DO NOT add generated operation methods here; generator will produce CamundaClient.ts from this template.

import { createClient } from './gen/client/client.gen';
import type { Client } from './gen/client/types.gen';
import { createAuthFacade } from './runtime/auth';
import type { CamundaConfig } from './runtime/unifiedConfiguration';
import type { EnvOverrides } from './runtime/configSchema';
import { hydrateConfig } from './runtime/unifiedConfiguration';
import * as Sdk from './gen/sdk.gen';
import { ConsistencyOptions, eventualPoll } from './runtime/eventual'
import * as Schemas from './gen/zod.gen';
import { ValidationManager } from './runtime/validationManager';
import { createLogger, Logger, LogLevel, LogTransport } from './runtime/logger';

// Internal deep-freeze to make exposed config immutable for consumers.
function deepFreeze<T>(obj: T): T {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj as any);
    for (const v of Object.values(obj as any)) {
      if (v && typeof v === 'object') deepFreeze(v as any);
    }
  }
  return obj;
}

// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===
// (generation inserts helper & per-operation option/body types here)
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===

// Cancelable primitive (kept lightweight & local)
export class CancelError extends Error { constructor() { super('Cancelled'); this.name = 'CancelError'; } }
export interface CancelablePromise<T> extends Promise<T> { cancel(): void }
function toCancelable<T>(factory: (signal: AbortSignal) => Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  const p: any = new Promise<T>((resolve, reject) => { factory(ac.signal).then(resolve, reject); });
  p.cancel = () => ac.abort();
  return p as CancelablePromise<T>;
}

// New simplified input: we only accept an already hydrated CamundaConfig. Users wanting env
// overrides or partials should call hydrateConfig first (single source of truth) and pass
// the resulting config.
export interface CamundaOptions {
  // Strongly typed env-style overrides (CAMUNDA_* keys). Optional.
  config?: EnvOverrides;
  // Custom fetch implementation.
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  // Provide a custom env map (mainly for tests). Defaults to process.env.
  env?: Record<string, string | undefined>;
  // Per-client logging options
  log?: { level?: LogLevel; transport?: LogTransport };
}

export function createCamundaClient(options?: CamundaOptions) { return new CamundaClient(options); }

export class CamundaClient {
  private _client: Client;
  private _config: Readonly<CamundaConfig>;
  private _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', raw: 'req:none,res:none' } as any,
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: ''
  } as any);
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  private _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none' });
  private _log: Logger = createLogger();

  private _overrides: EnvOverrides = {};

  constructor(opts: CamundaOptions = {}) {
    if (opts.config) this._overrides = { ...opts.config };
    const { config } = hydrateConfig({ overrides: this._overrides, env: opts.env });
  this._config = deepFreeze(config) as Readonly<CamundaConfig>;
  // Initialize per-client logger
  this._log = createLogger({ level: opts.log?.level || this._config.logLevel, transport: opts.log?.transport });
    this._fetch = opts.fetch;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
  this._auth = createAuthFacade(this._config, { fetch: this._fetch, logger: this._log });
  this._validation.update(this._config.validation);
  this._validation.attachLogger(this._log);
  }

  get config(): Readonly<CamundaConfig> { return this._config; }
  /**
   * Read-only snapshot of current hydrated configuration (do not mutate directly).
   * Use configure(...) to apply changes.
   */
  getConfig(): Readonly<CamundaConfig> { return this._config; }

  // Merge new overrides and re-hydrate.
  configure(next: CamundaOptions) {
    if (next.config) this._overrides = { ...this._overrides, ...next.config };
    if (next.fetch) this._fetch = next.fetch;
    const { config } = hydrateConfig({ overrides: this._overrides, env: next.env });
    this._config = deepFreeze(config) as Readonly<CamundaConfig>;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
  // Update logger level / transport if provided, else apply config log level
  if (next.log?.level) this._log.setLevel(next.log.level); else this._log.setLevel(this._config.logLevel);
  if (next.log?.transport !== undefined) this._log.setTransport(next.log.transport);
  this._auth = createAuthFacade(this._config, { fetch: this._fetch, logger: this._log });
  this._validation.update(this._config.validation);
  this._validation.attachLogger(this._log);
  }

  // Auth helpers
  async getAuthHeaders() { return this._auth.getAuthHeaders(); }
  async forceAuthRefresh() { return this._auth.forceRefresh(); }
  clearAuthCache(opts?: { disk?: boolean; memory?: boolean }) { this._auth.clearCache(opts); }
  onAuthHeaders(h: (headers: Record<string, string>) => Record<string, string> | Promise<Record<string, string>>) { this._auth.registerHeadersHook(h); }

  /** @internal ValidationManager is internal; tests may reach via (client as any)._validation */
  /** Access a scoped logger (internal & future user emission). */
  logger(scope?: string) { return scope ? this._log.scope(scope) : this._log; }

  // === AUTO-GENERATED CAMUNDA METHODS START ===
  // === AUTO-GENERATED CAMUNDA METHODS END ===
}
