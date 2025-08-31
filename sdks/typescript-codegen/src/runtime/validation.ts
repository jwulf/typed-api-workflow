import { ZodError, ZodTypeAny } from 'zod';
import { currentValidationMode, responseValidationEnabled } from './config';
import { formatValidationError, logFormattedValidation } from './formatValidation';
import { CamundaValidationError } from './errors';

export function validateData<T>(schema: ZodTypeAny, data: unknown): T {
  const mode = currentValidationMode();
  if (mode === 'none') return data as T;
  try {
    return schema.parse(data) as T;
  } catch (err: any) {
    if (err instanceof ZodError) {
      const formatted = formatValidationError({ side: 'request', error: err, schema, value: data });
  if (mode === 'warn') { logFormattedValidation('warn', formatted); return data as T; }
  throw new CamundaValidationError({ side: 'request', operationId: undefined, message: formatted.message, summary: formatted.summary, issues: formatted.issues });
    }
    throw err;
  }
}

export async function parseJson<T = any>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try { return JSON.parse(text); } catch { return text as any; }
}

export async function parseAndMaybeValidate<T>(res: Response, schema?: ZodTypeAny): Promise<T> {
  const json = await parseJson<T>(res);
  if (!schema || !responseValidationEnabled()) return json as T;
  try {
    return validateData<T>(schema, json);
  } catch (err: any) {
    if (err instanceof ZodError) {
      const mode = currentValidationMode();
      const formatted = formatValidationError({ side: 'response', error: err, schema, value: json });
  if (mode === 'warn') { logFormattedValidation('warn', formatted); return json as T; }
  throw new CamundaValidationError({ side: 'response', operationId: undefined, message: formatted.message, summary: formatted.summary, issues: formatted.issues });
    }
    throw err;
  }
}
