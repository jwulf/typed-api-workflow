#!/usr/bin/env tsx
/**
 * Post-generation transform: inject request/response validation gating into sdk.gen.ts
 * (Non-invasive string surgery; re-runnable and idempotent.)
 */
import fs from 'fs';
import path from 'path';

const sdkPath = path.resolve(process.cwd(), 'src/gen/sdk.gen.ts');
if (!fs.existsSync(sdkPath)) {
  console.error('[gate-validation] sdk.gen.ts not found, skipping');
  process.exit(0);
}
let code = fs.readFileSync(sdkPath, 'utf8');
if (code.includes('from ../runtime/gatedValidation')) {
  console.log('[gate-validation] Already gated – skip');
  process.exit(0);
}

// Insert import after first block of imports.
code = code.replace(/(import[^;]+;\s*)+(?=export type Options)/, match => match + "import { gateRequest, gateResponse } from '../runtime/gatedValidation';\n");

// Replace requestValidator/responseValidator bodies.
// Pattern: requestValidator: async (data) => { return await zXxxData.parseAsync(data); },
code = code.replace(/requestValidator:\s*async\s*\(data\)\s*=>\s*{\s*return await (z[A-Za-z0-9_]+Data)\.parseAsync\(data\);\s*},/g,
  (_m, schema) => `requestValidator: async (data) => { return await gateRequest(opId, ${schema}, data); },`);

// Provide operationId context: Prepend const opId='foo' after each jsdoc block before first return line.
// Find exported const <name> = ... occurrences.
code = code.replace(/(\/\*\*[\s\S]*?\*\/\nexport const (\w+) = <[^>]*>\([^)]*\) => {)/g, (_m, head, op) => `${head}\n    const opId = '${op}';`);

code = code.replace(/responseValidator:\s*async\s*\(data\)\s*=>\s*{\s*return await (z[A-Za-z0-9_]+Response)\.parseAsync\(data\);\s*},/g,
  (_m, schema) => `responseValidator: async (data) => { return await gateResponse(opId, ${schema}, data); },`);

fs.writeFileSync(sdkPath, code, 'utf8');
console.log('[gate-validation] Injected gating into sdk.gen.ts');