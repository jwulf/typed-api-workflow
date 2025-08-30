import { ZodTypeAny } from 'zod';
import { currentValidationMode, responseValidationEnabled } from './config';

export function validateData<T>(schema: ZodTypeAny, data: unknown): T {
  const mode = currentValidationMode();
  if (mode === 'none') return data as T;
  try {
    return schema.parse(data) as T;
  } catch (err: any) {
    if (mode === 'warn') {
      // eslint-disable-next-line no-console
      console.warn('[camunda-sdk] validation warning', err?.errors || err?.message || err);
      return data as T;
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
  return validateData<T>(schema, json);
}
