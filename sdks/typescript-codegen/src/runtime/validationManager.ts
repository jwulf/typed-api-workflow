import { ZodTypeAny } from 'zod';
import { applySchemaValidation } from './validationCore';
import { detectExtrasAndMaybeThrow, ExtrasPolicy } from './validationExtras';
import type { Logger } from './logger';

export type ValidationMode = 'strict' | 'warn' | 'none' | 'fanatical';

export interface ValidationSettings {
  req: ValidationMode;
  res: ValidationMode;
  extras?: {
    policy: ExtrasPolicy; // how to handle extra properties
    deep: boolean;        // recurse into nested objects
    captureDir?: string;  // directory for sample capture
  };
}

export class ValidationManager {
  private _settings: ValidationSettings;
  constructor(settings: ValidationSettings, private _logger?: Logger) { this._settings = { ...settings }; }
  update(settings: ValidationSettings) { this._settings = { ...settings }; }
  attachLogger(logger: Logger) { this._logger = logger; }
  get settings() { return this._settings; }
  requestMode() { return this._settings.req; }
  responseMode() { return this._settings.res; }

  async gateRequest(opId: string, schema: ZodTypeAny | undefined, data: any) {
    return this._gate('request', opId, this._settings.req, schema, data);
  }
  async gateResponse(opId: string, schema: ZodTypeAny | undefined, data: any) {
    return this._gate('response', opId, this._settings.res, schema, data);
  }

  private async _gate(side: 'request'|'response', opId: string, mode: ValidationMode, schema: ZodTypeAny | undefined, value: any) {
    // fanatical piggybacks on strict for core parse semantics
    const effectiveMode = (mode === 'fanatical') ? 'strict' : mode;
    const validated = await applySchemaValidation({ side, operationId: opId, mode: effectiveMode as any, schema, value, logger: this._logger });
    if (side === 'response' && this._settings.extras && this._settings.extras.policy !== 'ignore' && (mode === 'fanatical' || effectiveMode !== 'none')) {
      try {
        detectExtrasAndMaybeThrow({
          operationId: opId,
          value,
          schema,
          settings: this._settings.extras,
          logger: this._logger,
          fanatical: mode === 'fanatical'
        });
      } catch (e) {
        if (mode === 'fanatical' || this._settings.extras.policy === 'error') throw e;
      }
    }
    return validated;
  }
}
