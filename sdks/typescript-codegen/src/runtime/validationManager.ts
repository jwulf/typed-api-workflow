import { ZodTypeAny } from 'zod';
import { applySchemaValidation } from './validationCore';

export type ValidationMode = 'strict' | 'warn' | 'none';

export interface ValidationSettings {
  req: ValidationMode;
  res: ValidationMode;
}

export class ValidationManager {
  private _settings: ValidationSettings;
  constructor(settings: ValidationSettings) { this._settings = { ...settings }; }
  update(settings: ValidationSettings) { this._settings = { ...settings }; }
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
    return applySchemaValidation({ side, operationId: opId, mode, schema, value });
  }
}
