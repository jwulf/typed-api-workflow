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
import { hydrateConfig, CamundaConfig } from './unifiedConfiguration';

// No caching: design calls for pure DI; legacy helpers should reflect current process.env each call (especially in tests).
function ensure(): ReturnType<typeof hydrateConfig> {
  return hydrateConfig({});
}

function v(): CamundaConfig['validation'] { return ensure().config.validation; }

export function requestValidationMode(): ValidationMode { return v().req; }
export function responseValidationMode(): ValidationMode { return v().res; }
export function currentValidationMode(): ValidationMode { return v().res; }
export function responseValidationEnabled(): boolean { return v().res !== 'none'; }
export function validationConfig(): { req: ValidationMode; res: ValidationMode } { return { req: v().req, res: v().res }; }
export function validationVerbose(): boolean { return v().verbose; }

// Internal helper for tests wanting fresh parse.
export function __resetValidationCacheForTests() { /* no-op now; kept for backward compatibility */ }
