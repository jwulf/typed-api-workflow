// Canonical Camunda8 class template (manually maintained)
// DO NOT add generated operation methods here; generator will produce Camunda8.ts from this template.

import { createClient } from './gen/client/client.gen';
import type { Client } from './gen/client/types.gen';
import { createAuthFacade } from './runtime/auth';
import type { CamundaConfig, CamundaFlatConfig } from './runtime/unifiedConfiguration';
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

export type Camunda8InputConfig = (Partial<CamundaConfig> & { fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>; }) | (CamundaFlatConfig & { fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>; });

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
    // Accept three input shapes:
    //  1. Fully shaped CamundaConfig (detected via auth + validation props) -> use directly
    //  2. Flat env-style overrides object containing CAMUNDA_* keys -> hydrate with those as overrides
    //  3. Nothing / partial shaped overrides -> hydrate from process.env then shallow merge explicit shaped fields
    let hydrated: { config: CamundaConfig };
    if (cfg && (cfg as any).auth && (cfg as any).validation) {
      hydrated = { config: cfg as CamundaConfig };
    } else if (cfg && Object.keys(cfg).some(k => k.startsWith('CAMUNDA_'))) {
      const overrides = Object.fromEntries(Object.entries(cfg).filter(([k,v]) => k.startsWith('CAMUNDA_') && typeof v === 'string')) as Record<string,string>;
      hydrated = hydrateConfig({ overrides });
    } else {
      hydrated = hydrateConfig();
    }
    // Merge in any shaped fields (restAddress, auth, validation, etc.) that were explicitly provided (non CAMUNDA_* keys)
    const merged: CamundaConfig = { ...hydrated.config };
    if (cfg) {
      for (const [k,v] of Object.entries(cfg)) {
        if (k === 'fetch') continue;
        if (k.startsWith('CAMUNDA_')) continue; // already applied via overrides hydration
        (merged as any)[k] = v;
      }
    }
    this._config = merged;
    this._fetch = (cfg as any)?.fetch;
    this._client = createClient({ baseUrl: merged.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(merged, { fetch: this._fetch });
  }

  get config() { return this._config; }

  configure(next: Camunda8InputConfig) {
    if (Object.keys(next || {}).some(k => k.startsWith('CAMUNDA_'))) {
      // Re-hydrate with new overrides
      const overrides = Object.fromEntries(Object.entries(next).filter(([k,v]) => k.startsWith('CAMUNDA_') && typeof v === 'string')) as Record<string,string>;
      const hydrated = hydrateConfig({ overrides });
      const merged: CamundaConfig = { ...this._config, ...hydrated.config };
      for (const [k,v] of Object.entries(next)) {
        if (k === 'fetch' || k.startsWith('CAMUNDA_')) continue;
        (merged as any)[k] = v;
      }
      this._config = merged;
    } else {
      this._config = { ...this._config, ...(next as any) };
    }
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
