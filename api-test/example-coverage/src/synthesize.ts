import { FieldRecord } from './types.js';

export function applySyntheticCoverage(records: FieldRecord[]) {
  for (const r of records) {
    if (r.hasExample || r.inheritedExample) continue; // already covered
    // Decide if we can synthesize
    const sample = synthesizeValue(r);
    if (sample !== undefined) {
      r.synthetic = true;
      if (!r.coverageSources) r.coverageSources = [];
      if (!r.coverageSources.includes('synthetic')) r.coverageSources.push('synthetic');
    }
  }
}

function synthesizeValue(r: FieldRecord): any {
  switch (r.schemaType) {
    case 'boolean':
      return true;
    case 'string':
      return synthesizeString(r.format, r.enum);
    case 'integer':
    case 'number':
      return 1; // simple heuristic; could use minimum if available later if we retain numeric constraints
    case 'array':
      return []; // empty array is a valid placeholder; we don't currently treat arrays as leafs unless misclassified
    case 'object':
      return {}; // similarly for objects (should not appear as leaf due to traversal logic)
    default:
      if (r.enum && r.enum.length) return r.enum[0];
      return undefined;
  }
}

function synthesizeString(format?: string, enumeration?: string[]): string | undefined {
  if (enumeration && enumeration.length) return enumeration[0];
  switch (format) {
    case 'date-time':
      return '2024-01-01T00:00:00.000Z';
    case 'date':
      return '2024-01-01';
    case 'uuid':
      return '00000000-0000-0000-0000-000000000000';
    case 'email':
      return 'user@example.com';
    case 'hostname':
      return 'example.com';
    default:
      return 'example';
  }
}
