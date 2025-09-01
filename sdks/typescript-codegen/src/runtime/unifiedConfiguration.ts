/**
 * Unified configuration hydration for Camunda TypeScript SDK.
 * Single declarative spec -> typed config object (pure DI, no global mutation).
 *
 * Design highlights implemented here (see configuration-coalescing.md):
 *  - Precedence (Node): defaults < process.env < explicit overrides object.
 *  - Browser (scaffolding): explicit overrides <fetch>/<window.CAMUNDA_CONFIG> < defaults (async variant provided).
 *  - Conditional requirements (requiredWhen { key, equals }).
 *  - Secrets redaction: keep length, mask all but last 4 (<=4 => all *).
 *  - Empty string trimmed -> missing.
 *  - Values equal to default are treated as explicitly provided (appear in provided map).
 *  - Boolean accepted literals: true/false/yes/no/1/0/on/off (case-insensitive). Invalid => fatal.
 *  - Integers only for number type (no + sign, no hex, no scientific). Invalid => fatal.
 *  - Enum normalization to canonical uppercase (silent).
 *  - Validation mini-language (req|res):(none|warn|strict) list or single global mode.
 *  - Aggregated errors with stable machine codes & sorted ordering.
 *  - Warnings structured { key, code, message, details? }.
 *  - Deep freeze returned config.
 *  - Serialization helpers: provided, effective, redacted, display string.
 */

export type AuthStrategy = 'NONE' | 'OAUTH' | 'BASIC';
export type ValidationMode = 'none' | 'warn' | 'strict';

export interface Warning {
  key?: string;
  code: WarningCode;
  message: string;
  details?: any; // future-proof details for machine processing
}

export enum WarningCode {
  DEPRECATED = 'DEPRECATED'
}

export interface ConfigErrorDetail {
  key?: string;
  code: ConfigErrorCode;
  message: string;
  details?: any;
}

export enum ConfigErrorCode {
  CONFIG_MISSING_REQUIRED = 'CONFIG_MISSING_REQUIRED',
  CONFIG_INVALID_ENUM = 'CONFIG_INVALID_ENUM',
  CONFIG_INVALID_BOOLEAN = 'CONFIG_INVALID_BOOLEAN',
  CONFIG_INVALID_INTEGER = 'CONFIG_INVALID_INTEGER',
  CONFIG_INVALID_VALIDATION_SYNTAX = 'CONFIG_INVALID_VALIDATION_SYNTAX'
}

export class CamundaConfigurationError extends Error {
  public readonly errors: ConfigErrorDetail[];
  constructor(errors: ConfigErrorDetail[]) {
    const msg = errors.map(e => `${e.code}${e.key ? `(${e.key})` : ''}: ${e.message}`).join('\n');
    super(msg);
    this.name = 'CamundaConfigurationError';
    this.errors = errors;
  }
}

interface ConditionalRequirement { key: string; equals: string; }

type VarType = 'string' | 'enum' | 'boolean' | 'int';

interface BaseSpecEntry {
  key: string;                       // Environment variable name
  doc: string;                       // Description for TypeDoc extraction
  type: VarType;
  default?: string;                  // Default (raw string form)
  deprecated?: boolean;
  sinceVersion?: string;
  replacement?: string;
  internalTag?: string;
  requiredWhen?: ConditionalRequirement; // Conditional requirement
  enumValues?: string[];             // For enum type (canonical uppercase forms)
  secret?: boolean;                  // Secret for redaction
}

// Declarative spec. Order stable for deterministic serialization.
const SPEC: BaseSpecEntry[] = [
  { key: 'CAMUNDA_REST_ADDRESS', doc: 'Base REST endpoint address.', type: 'string', default: 'http://localhost:8080' },
  { key: 'CAMUNDA_TOKEN_AUDIENCE', doc: 'Token audience for OAuth flows.', type: 'string', default: 'zeebe.camunda.io' },
  { key: 'CAMUNDA_CLIENT_ID', doc: 'OAuth client id (required when CAMUNDA_AUTH_STRATEGY=OAUTH).', type: 'string', requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'OAUTH' } },
  { key: 'CAMUNDA_CLIENT_SECRET', doc: 'OAuth client secret (required when CAMUNDA_AUTH_STRATEGY=OAUTH).', type: 'string', secret: true, requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'OAUTH' } },
  { key: 'CAMUNDA_OAUTH_URL', doc: 'OAuth token URL.', type: 'string', default: 'https://login.cloud.camunda.io/oauth/token' },
  { key: 'CAMUNDA_OAUTH_GRANT_TYPE', doc: 'OAuth grant type (currently client_credentials only).', type: 'string', default: 'client_credentials' },
  { key: 'CAMUNDA_OAUTH_SCOPE', doc: 'Optional OAuth scope (space-separated).', type: 'string' },
  { key: 'CAMUNDA_OAUTH_TIMEOUT_MS', doc: 'Timeout in ms for OAuth token fetch.', type: 'int', default: '5000' },
  { key: 'CAMUNDA_OAUTH_RETRY_MAX', doc: 'Maximum OAuth token fetch attempts (including initial).', type: 'int', default: '5' },
  { key: 'CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS', doc: 'Base delay (ms) for first retry (exponential backoff).', type: 'int', default: '1000' },
  { key: 'CAMUNDA_OAUTH_CACHE_DIR', doc: 'Directory for disk caching OAuth tokens (Node only).', type: 'string' },
  { key: 'CAMUNDA_AUTH_STRATEGY', doc: 'Authentication strategy.', type: 'enum', enumValues: ['NONE','OAUTH','BASIC'], default: 'NONE' },
  { key: 'CAMUNDA_BASIC_AUTH_USERNAME', doc: 'Basic auth username (required when CAMUNDA_AUTH_STRATEGY=BASIC).', type: 'string', requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'BASIC' } },
  { key: 'CAMUNDA_BASIC_AUTH_PASSWORD', doc: 'Basic auth password (required when CAMUNDA_AUTH_STRATEGY=BASIC).', type: 'string', secret: true, requiredWhen: { key: 'CAMUNDA_AUTH_STRATEGY', equals: 'BASIC' } },
  { key: 'CAMUNDA_SDK_VALIDATION', doc: 'Validation mini-language controlling req/res modes.', type: 'string', default: 'req:none,res:none' },
  { key: 'CAMUNDA_SDK_VALIDATION_VERBOSE', doc: 'Verbose validation output flag.', type: 'boolean' },
  { key: 'CAMUNDA_SDK_LOG_LEVEL', doc: 'SDK log level (silent|error|warn|info|debug|trace).', type: 'string', default: 'error' },
  { key: 'CAMUNDA_MTLS_CERT_PATH', doc: 'Path to client certificate (PEM) for mTLS.', type: 'string' },
  { key: 'CAMUNDA_MTLS_KEY_PATH', doc: 'Path to client private key (PEM) for mTLS.', type: 'string' },
  { key: 'CAMUNDA_MTLS_CA_PATH', doc: 'Path to CA certificate bundle (PEM) for mTLS.', type: 'string' },
  { key: 'CAMUNDA_MTLS_KEY_PASSPHRASE', doc: 'Optional passphrase for encrypted private key.', type: 'string', secret: true },
  { key: 'CAMUNDA_MTLS_CERT', doc: 'Inline PEM client certificate.', type: 'string' },
  { key: 'CAMUNDA_MTLS_KEY', doc: 'Inline PEM client private key.', type: 'string', secret: true },
  { key: 'CAMUNDA_MTLS_CA', doc: 'Inline PEM CA bundle.', type: 'string' },
  { key: 'CAMUNDA_SDK_EVENTUAL_POLL_DEFAULT_MS', doc: 'Default poll interval (ms) for eventually consistent endpoint polling (overridden per-call).', type: 'int', default: '500' }
];

// Public type helpers for constructing flat env-style override objects
export type CamundaEnvVarKey = typeof SPEC[number]['key'];
export type CamundaFlatConfig = Partial<Record<CamundaEnvVarKey, string>>;

// Resulting strongly typed config
export interface CamundaConfig {
  restAddress: string;
  tokenAudience: string;
  oauth: {
    clientId?: string;
    clientSecret?: string;
    oauthUrl: string;
    grantType: string;
    scope?: string;
    timeoutMs: number;
    retry: { max: number; baseDelayMs: number };
    cacheDir?: string;
  };
  auth: {
    strategy: AuthStrategy;
    basic?: { username?: string; password?: string };
  };
  validation: {
    req: ValidationMode;
    res: ValidationMode;
    verbose: boolean;
    raw: string; // normalized raw spec for reproducibility
  };
  logLevel: 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  eventual?: { pollDefaultMs: number };
  // authVerbose removed (pre-release cleanup)
  mtls?: {
  cert?: string; key?: string; ca?: string; keyPassphrase?: string;
  certPath?: string; keyPath?: string; caPath?: string;
  };
  // Raw access (canonical uppercase enums applied) keyed by env var (internal/debug)
  __raw: Record<string,string|undefined>;
}

export interface HydratedConfiguration {
  config: CamundaConfig;
  warnings: Warning[];
  provided: Record<string,string>;      // User provided (including explicit defaults, excluding empty strings)
  effective: Record<string,string>;     // All keys with effective values (defaults filled)
  redacted: Record<string,string>;      // Redacted effective
  toProvidedObject(): Record<string,string>;
  toEffectiveObject(): Record<string,string>;
  toRedactedObject(): Record<string,string>;
  toDisplayString(): string;
}

export interface HydrateOptions {
  env?: Record<string, string | undefined>;      // Injected env map (defaults to process.env in Node)
  overrides?: Record<string, string | undefined>; // Explicit object (highest precedence)
}

// Utility: deep freeze
function deepFreeze<T>(o: T): T {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const k of Object.keys(o as any)) {
      // @ts-ignore
      deepFreeze((o as any)[k]);
    }
  }
  return o;
}

// Secrets redaction (keep length, mask all but last 4; <=4 => all masked)
function redactSecret(v: string): string {
  const len = v.length;
  if (len <= 4) return '*'.repeat(len);
  const tail = v.slice(-4);
  return '*'.repeat(len - 4) + tail;
}

// Boolean parser
function parseBoolean(raw: string, key: string, errors: ConfigErrorDetail[]): boolean | undefined {
  const v = raw.trim().toLowerCase();
  if (v === '') return undefined; // missing
  if (['true','yes','1','on'].includes(v)) return true;
  if (['false','no','0','off'].includes(v)) return false;
  errors.push({ code: ConfigErrorCode.CONFIG_INVALID_BOOLEAN, key, message: `Invalid boolean value '${raw}'. Expected one of true,false,yes,no,1,0,on,off.` });
  return undefined;
}

// Integer parser
function parseInteger(raw: string, key: string, errors: ConfigErrorDetail[]): number | undefined {
  const v = raw.trim();
  if (v === '') return undefined;
  if (/^[0-9]+$/.test(v)) return parseInt(v, 10);
  errors.push({ code: ConfigErrorCode.CONFIG_INVALID_INTEGER, key, message: `Invalid integer '${raw}'. Only unsigned base-10 integers allowed.` });
  return undefined;
}

// Validation mini-language parser (strict per design)
function parseValidation(raw: string, errors: ConfigErrorDetail[]): { req: ValidationMode; res: ValidationMode; raw: string } {
  const original = raw;
  const val = raw.trim();
  if (val === '') return { req: 'none', res: 'none', raw: 'req:none,res:none' };
  const lower = val.toLowerCase();
  if (['none','warn','strict'].includes(lower)) {
    return { req: lower as ValidationMode, res: lower as ValidationMode, raw: `req:${lower},res:${lower}` };
  }
  const parts = val.split(',').map(p => p.trim()).filter(Boolean);
  const seen: Record<string,boolean> = {};
  let req: ValidationMode = 'none';
  let res: ValidationMode = 'none';
  for (const part of parts) {
    const [lhs, rhs] = part.split(':').map(s => s?.trim().toLowerCase());
    if (!lhs || !rhs) {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Malformed segment '${part}'` });
      continue;
    }
    if (lhs !== 'req' && lhs !== 'res') {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Unknown scope '${lhs}'` });
      continue;
    }
    if (!['none','warn','strict'].includes(rhs)) {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Unknown mode '${rhs}'` });
      continue;
    }
    if (seen[lhs]) {
      errors.push({ code: ConfigErrorCode.CONFIG_INVALID_VALIDATION_SYNTAX, key: 'CAMUNDA_SDK_VALIDATION', message: `Duplicate scope '${lhs}'` });
      continue;
    }
    seen[lhs] = true;
    if (lhs === 'req') req = rhs as ValidationMode; else res = rhs as ValidationMode;
  }
  return { req, res, raw: `req:${req},res:${res}` };
}

export function hydrateConfig(options: HydrateOptions = {}): HydratedConfiguration {
  const env = options.env || (typeof process !== 'undefined' ? (process.env as Record<string,string|undefined>) : {});
  const overrides = options.overrides || {};
  const errors: ConfigErrorDetail[] = [];
  const warnings: Warning[] = [];
  const provided: Record<string,string> = {};
  const effective: Record<string,string> = {};
  const rawMap: Record<string,string|undefined> = {};

  // First pass: determine raw effective value per spec entry (precedence: default < env < overrides)
  for (const entry of SPEC) {
    const fromEnv = env[entry.key];
    const fromOverride = overrides[entry.key];
    let value: string | undefined = undefined;
    if (fromEnv !== undefined) value = fromEnv; // env precedence over default
    if (fromOverride !== undefined) value = fromOverride; // override highest
    if ((value === undefined || value.trim() === '') && entry.default !== undefined) value = entry.default; // apply default
    rawMap[entry.key] = value;
    // Track provided (user intent): if user supplied a non-empty string via env or override
    const origin = fromOverride !== undefined ? fromOverride : fromEnv;
    if (origin !== undefined) {
      const trimmed = origin.trim();
      if (trimmed !== '') {
        // treat explicit default as provided
        provided[entry.key] = trimmed;
      }
    }
  }

  // Second pass: parse & validate
  const authStrategyRaw = (rawMap['CAMUNDA_AUTH_STRATEGY'] || 'NONE').toString();
  const authStrategy = authStrategyRaw.trim().toUpperCase();
  if (!['NONE','OAUTH','BASIC'].includes(authStrategy)) {
    errors.push({ code: ConfigErrorCode.CONFIG_INVALID_ENUM, key: 'CAMUNDA_AUTH_STRATEGY', message: `Invalid auth strategy '${authStrategyRaw}'. Expected NONE|OAUTH|BASIC.` });
  }

  // Collect conditional missing keys by strategy for merged error messages
  const missingByCondition: Record<string,string[]> = {};

  for (const entry of SPEC) {
    const raw = rawMap[entry.key];
    if (entry.type === 'enum' && raw !== undefined) {
      const norm = raw.trim().toUpperCase();
      if (!entry.enumValues!.includes(norm)) {
        errors.push({ code: ConfigErrorCode.CONFIG_INVALID_ENUM, key: entry.key, message: `Invalid value '${raw}' (expected one of ${entry.enumValues!.join('|')}).` });
      } else {
        rawMap[entry.key] = norm; // canonical
      }
    }
    else if (entry.type === 'boolean' && raw !== undefined) {
      const parsed = parseBoolean(raw, entry.key, errors);
      if (parsed !== undefined) rawMap[entry.key] = parsed ? 'true' : 'false'; else if (!errors.find(e => e.key === entry.key)) delete rawMap[entry.key];
    }
    else if (entry.type === 'int' && raw !== undefined) {
      const parsed = parseInteger(raw, entry.key, errors);
      if (parsed !== undefined) rawMap[entry.key] = String(parsed); else if (!errors.find(e => e.key === entry.key)) delete rawMap[entry.key];
    }

    // Conditional requirement evaluation (after parsing & normalization)
    if (entry.requiredWhen) {
      const condValue = rawMap[entry.requiredWhen.key]?.trim().toUpperCase();
      if (condValue === entry.requiredWhen.equals) {
        const currentVal = (env[entry.key] ?? overrides[entry.key] ?? '').trim();
        if (currentVal === '') { // missing (empty) OR not provided at all
          const list = missingByCondition[entry.requiredWhen.equals] || (missingByCondition[entry.requiredWhen.equals] = []);
            list.push(entry.key);
        }
      }
    }

    if (entry.deprecated && (env[entry.key] !== undefined || overrides[entry.key] !== undefined)) {
      warnings.push({ key: entry.key, code: WarningCode.DEPRECATED, message: `${entry.key} is deprecated${entry.replacement ? `; use ${entry.replacement}` : ''}.`, details: { since: entry.sinceVersion, replacement: entry.replacement } });
    }
  }

  // Aggregate missing condition keys into single error per condition (strategy)
  for (const cond of Object.keys(missingByCondition)) {
    const keys = Array.from(new Set(missingByCondition[cond])).sort();
    errors.push({ code: ConfigErrorCode.CONFIG_MISSING_REQUIRED, message: `Missing required configuration for ${cond}: ${keys.join(', ')}`, details: { strategy: cond, keys } });
  }

  // mTLS completeness validation: if any cert/key indicator present require both sides
  const mtlsCertProvided = !!(rawMap['CAMUNDA_MTLS_CERT'] || rawMap['CAMUNDA_MTLS_CERT_PATH']);
  const mtlsKeyProvided = !!(rawMap['CAMUNDA_MTLS_KEY'] || rawMap['CAMUNDA_MTLS_KEY_PATH']);
  const mtlsAny = mtlsCertProvided || mtlsKeyProvided || rawMap['CAMUNDA_MTLS_CA'] || rawMap['CAMUNDA_MTLS_CA_PATH'] || rawMap['CAMUNDA_MTLS_KEY_PASSPHRASE'];
  if (mtlsAny && (!mtlsCertProvided || !mtlsKeyProvided)) {
    errors.push({ code: ConfigErrorCode.CONFIG_MISSING_REQUIRED, message: 'Incomplete mTLS configuration; both certificate (CAMUNDA_MTLS_CERT|_PATH) and key (CAMUNDA_MTLS_KEY|_PATH) must be provided.' });
  }

  // Parse validation config after potential errors so we gather full set
  const validationRaw = rawMap['CAMUNDA_SDK_VALIDATION'] || 'req:none,res:none';
  const validation = parseValidation(validationRaw, errors);
  const verbose = rawMap['CAMUNDA_SDK_VALIDATION_VERBOSE'] === 'true';

  // If any errors, throw aggregated (sorted by key then code for determinism)
  if (errors.length) {
    errors.sort((a,b) => (a.key || '').localeCompare(b.key || '') || a.code.localeCompare(b.code));
    throw new CamundaConfigurationError(errors);
  }

  // Build effective map (string values) & redacted
  for (const entry of SPEC) {
    const val = rawMap[entry.key];
    if (val !== undefined) effective[entry.key] = val;
  }
  // Redacted copy
  const redacted: Record<string,string> = {};
  for (const [k,v] of Object.entries(effective)) {
    const spec = SPEC.find(s => s.key === k)!;
    if (spec.secret && v) redacted[k] = redactSecret(v); else redacted[k] = v;
  }

  const config: CamundaConfig = {
    restAddress: rawMap['CAMUNDA_REST_ADDRESS']!,
    tokenAudience: rawMap['CAMUNDA_TOKEN_AUDIENCE']!,
    oauth: {
      clientId: env['CAMUNDA_CLIENT_ID']?.trim() || overrides['CAMUNDA_CLIENT_ID']?.trim() || undefined,
      clientSecret: env['CAMUNDA_CLIENT_SECRET']?.trim() || overrides['CAMUNDA_CLIENT_SECRET']?.trim() || undefined,
      oauthUrl: rawMap['CAMUNDA_OAUTH_URL']!,
      grantType: rawMap['CAMUNDA_OAUTH_GRANT_TYPE']!,
      scope: (env['CAMUNDA_OAUTH_SCOPE'] ?? overrides['CAMUNDA_OAUTH_SCOPE'])?.trim() || undefined,
      timeoutMs: parseInt(rawMap['CAMUNDA_OAUTH_TIMEOUT_MS']!, 10),
      retry: { max: parseInt(rawMap['CAMUNDA_OAUTH_RETRY_MAX']!, 10), baseDelayMs: parseInt(rawMap['CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS']!, 10) },
      cacheDir: (env['CAMUNDA_OAUTH_CACHE_DIR'] ?? overrides['CAMUNDA_OAUTH_CACHE_DIR'])?.trim() || undefined
    },
    auth: {
      strategy: authStrategy as AuthStrategy,
      basic: (authStrategy === 'BASIC') ? {
        username: env['CAMUNDA_BASIC_AUTH_USERNAME']?.trim() || overrides['CAMUNDA_BASIC_AUTH_USERNAME']?.trim(),
        password: env['CAMUNDA_BASIC_AUTH_PASSWORD']?.trim() || overrides['CAMUNDA_BASIC_AUTH_PASSWORD']?.trim()
      } : undefined
    },
  validation: { req: validation.req, res: validation.res, verbose, raw: validation.raw },
  logLevel: (rawMap['CAMUNDA_SDK_LOG_LEVEL'] as any) as CamundaConfig['logLevel'] || 'error',
  eventual: { pollDefaultMs: parseInt(rawMap['CAMUNDA_SDK_EVENTUAL_POLL_DEFAULT_MS'] || '500', 10) },
    mtls: (env['CAMUNDA_MTLS_CERT_PATH'] || env['CAMUNDA_MTLS_KEY_PATH'] || env['CAMUNDA_MTLS_CA_PATH'] || env['CAMUNDA_MTLS_CERT'] || env['CAMUNDA_MTLS_KEY'] || env['CAMUNDA_MTLS_CA'] || overrides['CAMUNDA_MTLS_CERT'] || overrides['CAMUNDA_MTLS_KEY']) ? {
      cert: (env['CAMUNDA_MTLS_CERT'] ?? overrides['CAMUNDA_MTLS_CERT']) || undefined,
      key: (env['CAMUNDA_MTLS_KEY'] ?? overrides['CAMUNDA_MTLS_KEY']) || undefined,
      ca: (env['CAMUNDA_MTLS_CA'] ?? overrides['CAMUNDA_MTLS_CA']) || undefined,
      keyPassphrase: (env['CAMUNDA_MTLS_KEY_PASSPHRASE'] ?? overrides['CAMUNDA_MTLS_KEY_PASSPHRASE']) || undefined,
      certPath: env['CAMUNDA_MTLS_CERT_PATH'] || undefined,
      keyPath: env['CAMUNDA_MTLS_KEY_PATH'] || undefined,
      caPath: env['CAMUNDA_MTLS_CA_PATH'] || undefined
    } : undefined,
    __raw: { ...rawMap }
  };

  deepFreeze(config);

  const api: HydratedConfiguration = {
    config,
    warnings,
    provided: Object.keys(provided).sort().reduce<Record<string,string>>((acc,k) => { acc[k]=provided[k]; return acc; }, {}),
    effective: Object.keys(effective).sort().reduce<Record<string,string>>((acc,k)=>{acc[k]=effective[k];return acc;},{}),
    redacted: Object.keys(redacted).sort().reduce<Record<string,string>>((acc,k)=>{acc[k]=redacted[k];return acc;},{}),
    toProvidedObject() { return { ...this.provided }; },
    toEffectiveObject() { return { ...this.effective }; },
    toRedactedObject() { return { ...this.redacted }; },
    toDisplayString() { return Object.entries(this.redacted).map(([k,v]) => `${k}=${v}`).join('\n'); }
  };
  // Record last hydrated configuration for runtime consumers (e.g., validation gating) that
  // call convenience helpers without explicit DI. This preserves test semantics where
  // hydrateConfig({ env: { ... } }) is invoked directly without also calling a higher-level
  // apply function. (Greenfield simplification: single source of truth here.)
  try {
    (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG = api;
  } catch { /* ignore (SSR edge) */ }
  return api;
}

// Async variant scaffolding (supports fetch + timeout + window global). Implementation minimal until browser integration.
export interface HydrateAsyncOptions extends HydrateOptions { fetch?: () => Promise<Record<string,string|undefined>>; timeoutMs?: number; }
export async function hydrateConfigAsync(options: HydrateAsyncOptions = {}): Promise<HydratedConfiguration> {
  const { fetch, timeoutMs } = options;
  let fetched: Record<string,string|undefined> = {};
  if (fetch) {
    fetched = await (timeoutMs ? withTimeout(fetch(), timeoutMs) : fetch());
  } else if (typeof window !== 'undefined' && (window as any).CAMUNDA_CONFIG) {
    fetched = (window as any).CAMUNDA_CONFIG;
  }
  return hydrateConfig({ env: { ...(options.env||{}), ...fetched }, overrides: options.overrides });
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let to: any; // eslint-disable-line
  return await Promise.race([
    p.then(v => { clearTimeout(to); return v; }),
    new Promise<T>((_,rej)=> { to = setTimeout(()=> rej(new CamundaConfigurationError([{ code: ConfigErrorCode.CONFIG_INVALID_ENUM, message: `Configuration fetch timed out after ${ms}ms` }] as any)), ms); })
  ]);
}

// Export spec for TypeDoc extraction tooling
export function configurationSpec(): ReadonlyArray<BaseSpecEntry> { return SPEC.slice(); }

/**
 * Non-mutating accessor for the most recently hydrated configuration.
 * Returns the same HydratedConfiguration object that the last call to
 * hydrateConfig / hydrateConfigAsync produced, or undefined if hydration
 * has not occurred yet in this process. This function NEVER performs
 * hydration itself (no environment reads / parsing side-effects).
 */
export function getConfig(): HydratedConfiguration | undefined {
  try {
    return (globalThis as any).__CAMUNDA_SDK_LAST_CONFIG as HydratedConfiguration | undefined;
  } catch {
    return undefined;
  }
}
