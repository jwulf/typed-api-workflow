// Runtime helpers for generated request/response validation gating.
import { ZodError, ZodTypeAny } from 'zod';
import { requestValidationMode, responseValidationMode, validationVerbose } from './config';
import { formatValidationError, logFormattedValidation } from './formatValidation';
import { CamundaValidationError } from './errors';

type Side = 'request' | 'response';

async function runParse(opId: string, side: Side, schema: ZodTypeAny, data: any, mode: 'none'|'warn'|'strict') {
  if (mode === 'none') return data; // skip entirely
  try {
    // In warn mode we still attempt parse to surface issues; but return raw data unchanged for stability
    const parsed = await schema.parseAsync?.(data);
    return mode === 'warn' ? data : parsed;
  } catch (err: any) {
    if (err instanceof ZodError) {
      const formatted = formatValidationError({ side, operationId: opId, schema, value: data, error: err });
      if (mode === 'warn') { logFormattedValidation('warn', formatted); return data; }
      throw new CamundaValidationError({ side, operationId: opId, message: formatted.message, summary: formatted.summary, issues: formatted.issues });
    }
    throw err;
  }
}

let warned = false;
async function legacyGate(kind:'request'|'response', opId: string, schema: ZodTypeAny, data: any) {
  if (!warned) {
    // eslint-disable-next-line no-console
    console.warn('[camunda-sdk] Deprecation: free validation gating helpers are legacy; prefer instance.gateRequest / instance.gateResponse.');
    warned = true;
  }
  return runParse(opId, kind, schema, data, kind==='request' ? requestValidationMode() : responseValidationMode());
}
export async function gateRequest(opId: string, schema: ZodTypeAny, data: any) { return legacyGate('request', opId, schema, data); }
export async function gateResponse(opId: string, schema: ZodTypeAny, data: any) { return legacyGate('response', opId, schema, data); }

// Expose for potential advanced instrumentation / tests
export const __validationVerbose = validationVerbose;