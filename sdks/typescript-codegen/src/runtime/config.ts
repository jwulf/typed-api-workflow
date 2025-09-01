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
// This file now delegates to unified configuration hydration logic for backward compatibility.
// Public API signatures preserved so existing imports continue working.
// Import via a single resolved path; some tests load this module before others set globals.
import { hydrateConfig, CamundaConfig, getConfig } from './unifiedConfiguration';

// Helper that prefers the most recently hydrated configuration (which may have been produced via
// hydrateConfigAsync with a supplied env/fetch map) while still allowing process.env mutations to
// take effect when callers rely on the legacy "set env var then read" pattern. We re-hydrate only
// if no prior config exists OR the caller has changed CAMUNDA_SDK_VALIDATION in process.env since
// the last hydration. This preserves the smoke test expectation that an async hydration with a
// provided env map is immediately visible to validationConfig()/requestValidationMode()/etc.
function ensure(): ReturnType<typeof hydrateConfig> {
  const existing = getConfig();
  const liveEnvVal = typeof process !== 'undefined' ? process.env.CAMUNDA_SDK_VALIDATION : undefined;
  if (!existing) {
    return hydrateConfig({ env: (typeof process !== 'undefined' ? (process.env as any) : {}) });
  }
  // If process.env explicitly specifies a value different from the normalized raw in the existing config, rehydrate.
  // existing.config.validation.raw is always normalized as req:<mode>,res:<mode>.
  if (liveEnvVal && liveEnvVal.trim() && liveEnvVal !== existing.config.validation.raw) {
    return hydrateConfig({ env: (typeof process !== 'undefined' ? (process.env as any) : {}) });
  }
  return existing as any; // already a HydratedConfiguration
}

function v(): CamundaConfig['validation'] { return ensure().config.validation; }

export function requestValidationMode(): ValidationMode { return v().req; }
export function responseValidationMode(): ValidationMode { return v().res; }
export function currentValidationMode(): ValidationMode { return v().res; }
export function responseValidationEnabled(): boolean { return v().res !== 'none'; }
export function validationConfig(): { req: ValidationMode; res: ValidationMode } { return { req: v().req, res: v().res }; }
export function validationVerbose(): boolean { return v().verbose; }

// Internal helper for tests wanting fresh parse.
export function __resetValidationCacheForTests() { /* no caching retained; function kept for API compatibility */ }
