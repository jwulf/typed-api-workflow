import { ZodError, ZodTypeAny } from 'zod';
import { formatValidationError, logFormattedValidation } from './formatValidation';
import { CamundaValidationError } from './errors';

export type ValidationMode = 'strict' | 'warn' | 'none';

export interface ValidationSettings {
  req: ValidationMode;
  res: ValidationMode;
  verbose: boolean;
}

export class ValidationManager {
  private _settings: ValidationSettings;
  constructor(settings: ValidationSettings) { this._settings = { ...settings }; }
  update(settings: ValidationSettings) { this._settings = { ...settings }; }
  get settings() { return this._settings; }

  requestMode() { return this._settings.req; }
  responseMode() { return this._settings.res; }
  verbose() { return this._settings.verbose; }

  async gateRequest(opId: string, schema: ZodTypeAny | undefined, data: any) {
    return this._gate('request', opId, this._settings.req, schema, data);
  }
  async gateResponse(opId: string, schema: ZodTypeAny | undefined, data: any) {
    return this._gate('response', opId, this._settings.res, schema, data);
  }

  private async _gate(side: 'request'|'response', opId: string, mode: ValidationMode, schema: ZodTypeAny | undefined, value: any) {
    if (mode === 'none' || !schema?.parseAsync) return value;
    try {
      // Prefer async parse when available; fall back to sync parse for simple schemas
      const parsed = schema.parseAsync ? await schema.parseAsync(value) : (schema as any).parse ? (schema as any).parse(value) : value;
      return mode === 'warn' ? value : parsed;
    } catch (err: any) {
      if (err instanceof ZodError) {
        const formatted = formatValidationError({ side, operationId: opId, schema, value, error: err });
        if (mode === 'warn') { logFormattedValidation('warn', formatted); return value; }
        throw new CamundaValidationError({ side, operationId: opId, message: formatted.message, summary: formatted.summary, issues: formatted.issues });
      }
      throw err;
    }
  }
}
