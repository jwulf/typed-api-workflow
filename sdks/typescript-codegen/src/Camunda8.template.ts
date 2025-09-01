// Canonical Camunda8 class template (manually maintained)
// DO NOT add generated operation methods here; generator will produce Camunda8.ts from this template.

import { createClient } from './gen/client/client.gen';
import type { Client } from './gen/client/types.gen';
import { createAuthFacade } from './runtime/auth';
import type { CamundaConfig } from './runtime/unifiedConfiguration';
import { hydrateConfig } from './runtime/unifiedConfiguration';
import * as Sdk from './gen/sdk.gen';

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

export interface Camunda8InputConfig extends Partial<CamundaConfig> {
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

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

  constructor(cfg?: Camunda8InputConfig) {
    const hydrated = cfg && (cfg as any).auth && (cfg as any).validation ? { config: cfg as CamundaConfig } : hydrateConfig();
    const merged: CamundaConfig = { ...(hydrated.config), ...(cfg as any) };
    this._config = merged;
    this._fetch = cfg?.fetch;
    this._client = createClient({ baseUrl: merged.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(merged, { fetch: this._fetch });
  }

  get config() { return this._config; }

  configure(next: Camunda8InputConfig) {
    this._config = { ...this._config, ...(next as any) };
    if (next.fetch) this._fetch = next.fetch;
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
