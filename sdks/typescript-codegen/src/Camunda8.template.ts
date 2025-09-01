// Canonical Camunda8 class template (manually maintained)
// DO NOT add generated operation methods here; generator will produce Camunda8.ts from this template.

import { createClient } from './gen/client/client.gen';
import type { Client } from './gen/client/types.gen';
import { createAuthFacade } from './runtime/auth';
import type { CamundaConfig } from './runtime/unifiedConfiguration';
import type { EnvOverrides } from './runtime/configSchema';
import { hydrateConfig } from './runtime/unifiedConfiguration';
import * as Sdk from './gen/sdk.gen';
import { ConsistencyOptions, eventualPoll } from './runtime/eventual'

// === AUTO-GENERATED CAMUNDA8 SUPPORT TYPES START ===
// (generation inserts helper & per-operation option/body types here)
// === AUTO-GENERATED CAMUNDA8 SUPPORT TYPES END ===

// Cancelable primitive (kept lightweight & local)
export class CancelError extends Error { constructor(){ super('Cancelled'); this.name='CancelError'; } }
export interface CancelablePromise<T> extends Promise<T> { cancel(): void }
function toCancelable<T>(factory:(signal:AbortSignal)=>Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  const p: any = new Promise<T>((resolve,reject)=> { factory(ac.signal).then(resolve,reject); });
  p.cancel = ()=> ac.abort();
  return p as CancelablePromise<T>;
}

// New simplified input: we only accept an already hydrated CamundaConfig. Users wanting env
// overrides or partials should call hydrateConfig first (single source of truth) and pass
// the resulting config.
export interface Camunda8Options {
  // Strongly typed env-style overrides (CAMUNDA_* keys). Optional.
  config?: EnvOverrides;
  // Custom fetch implementation.
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  // Provide a custom env map (mainly for tests). Defaults to process.env.
  env?: Record<string,string|undefined>;
}

export function createCamunda8(options?: Camunda8Options) { return new Camunda8(options); }

export class Camunda8 {
  private _client: Client;
  private _config: CamundaConfig;
  private _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', verbose: false },
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: ''
  } as any);
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit)=>Promise<Response>;

  private _overrides: EnvOverrides = {};

  constructor(opts: Camunda8Options = {}) {
    if (opts.config) this._overrides = { ...opts.config };
    const { config } = hydrateConfig({ overrides: this._overrides, env: opts.env });
    this._config = config;
    this._fetch = opts.fetch;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(this._config, { fetch: this._fetch });
  }

  get config() { return this._config; }

  // Merge new overrides and re-hydrate.
  configure(next: Camunda8Options) {
    if (next.config) this._overrides = { ...this._overrides, ...next.config };
    if (next.fetch) this._fetch = next.fetch;
    const { config } = hydrateConfig({ overrides: this._overrides, env: next.env });
    this._config = config;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(this._config, { fetch: this._fetch });
  }

  // Auth helpers
  async getAuthHeaders() { return this._auth.getAuthHeaders(); }
  async forceAuthRefresh() { return this._auth.forceRefresh(); }
  clearAuthCache(opts?: { disk?: boolean; memory?: boolean }) { this._auth.clearCache(opts); }
  onAuthHeaders(h: (headers: Record<string,string>) => Record<string,string>|Promise<Record<string,string>>) { this._auth.registerHeadersHook(h); }

  // === AUTO-GENERATED CAMUNDA8 METHODS START ===
  // === AUTO-GENERATED CAMUNDA8 METHODS END ===
}
