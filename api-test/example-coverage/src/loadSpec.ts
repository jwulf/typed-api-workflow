import fs from 'fs/promises';
import { parse } from 'yaml';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';

export interface LoadedSpec {
  raw: any;
  deref: any;
}

export async function loadAndDeref(path: string): Promise<LoadedSpec> {
  const rawText = await fs.readFile(path, 'utf8');
  const raw = parse(rawText);
  const deref = await SwaggerParser.dereference(raw as any) as OpenAPI.Document;
  return { raw, deref };
}
