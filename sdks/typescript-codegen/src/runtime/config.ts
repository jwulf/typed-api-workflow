/**
 * Validation severity levels used for both request (future) and response validation.
 *  - strict: throw on first validation error
 *  - warn:   log a warning and return unparsed data
 *  - none:   skip validation entirely
 */
export type ValidationMode = 'strict' | 'warn' | 'none';

/**
 * Single environment variable driving BOTH request & response validation behavior.
 * Grammar (case-insensitive):
 *   CAMUNDA_SDK_VALIDATION=
 *     (none|warn|strict)                    // global mode applied to req + res
 *     | (<side>:<mode>)(,<side>:<mode>)*    // side-specific list
 *
 * <side> ::= req | res
 * <mode> ::= none | warn | strict
 *
 * Semantics:
 *  - Global form (e.g. "warn") sets BOTH request & response modes to that value.
 *  - Pair-list form sets only the mentioned sides; any omitted side defaults to 'none'.
 *  - If the variable is unset or unparsable, default is req:none, res:none (opt-in model).
 *
 * Examples:
 *  CAMUNDA_SDK_VALIDATION=strict              => { req: 'strict', res: 'strict' }
 *  CAMUNDA_SDK_VALIDATION=warn                => { req: 'warn',   res: 'warn' }
 *  CAMUNDA_SDK_VALIDATION=none                => { req: 'none',   res: 'none' }
 *  CAMUNDA_SDK_VALIDATION=req:strict          => { req: 'strict', res: 'none' }
 *  CAMUNDA_SDK_VALIDATION=res:warn            => { req: 'none',   res: 'warn' }
 *  CAMUNDA_SDK_VALIDATION=req:warn,res:strict => { req: 'warn',   res: 'strict' }
 *
 * Legacy: Previously response validation required a separate flag CAMUNDA_SDK_VALIDATE_RESPONSES.
 * That variable has been removed; simply set a non-'none' response mode to enable response validation.
 */
const VALIDATION_ENV = 'CAMUNDA_SDK_VALIDATION';

interface ValidationConfig { req: ValidationMode; res: ValidationMode; }

let cachedEnv: string | undefined;
let cachedConfig: ValidationConfig | undefined;

function parseValidationEnv(raw: string | undefined): ValidationConfig {
  if (!raw) return { req: 'none', res: 'none' };
  const val = raw.trim().toLowerCase();
  if (val === 'none' || val === 'warn' || val === 'strict') {
    return { req: val, res: val } as ValidationConfig;
  }
  const parts = val.split(',').map(p => p.trim()).filter(Boolean);
  const cfg: Partial<ValidationConfig> = {};
  for (const part of parts) {
    const [sideRaw, modeRaw] = part.split(':').map(s => s?.trim());
    if (!sideRaw || !modeRaw) continue;
    if (modeRaw !== 'none' && modeRaw !== 'warn' && modeRaw !== 'strict') continue;
    if (sideRaw === 'req' || sideRaw === 'res') {
      (cfg as any)[sideRaw] = modeRaw;
    }
  }
  return { req: cfg.req || 'none', res: cfg.res || 'none' };
}

function getConfig(): ValidationConfig {
  const current = process.env[VALIDATION_ENV];
  if (cachedConfig && cachedEnv === current) return cachedConfig;
  cachedEnv = current;
  cachedConfig = parseValidationEnv(current);
  return cachedConfig;
}

/** Return the request-side validation mode (currently not yet used by runtime). */
export function requestValidationMode(): ValidationMode { return getConfig().req; }

/** Return the response-side validation mode used by wrappers. */
export function responseValidationMode(): ValidationMode { return getConfig().res; }

/** Back-compat: existing wrapper code expects this for response severity. */
export function currentValidationMode(): ValidationMode { return responseValidationMode(); }

/** Back-compat: existing wrapper code checks this before parsing. */
export function responseValidationEnabled(): boolean { return responseValidationMode() !== 'none'; }

/** Expose full parsed config (diagnostics / advanced tooling). */
export function validationConfig(): { req: ValidationMode; res: ValidationMode } { return getConfig(); }

/** Verbose formatting toggle for validation (include all issues, raw variant details). */
export function validationVerbose(): boolean { return process.env.CAMUNDA_SDK_VALIDATION_VERBOSE === '1' || process.env.CAMUNDA_SDK_VALIDATION_VERBOSE === 'true'; }
