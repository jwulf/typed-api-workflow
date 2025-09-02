#!/usr/bin/env tsx
/**
 * Post-generation transform: STRIP inline request/response validators from sdk.gen.ts.
 * Rationale: Validation is now performed in CamundaClient instance methods via ValidationManager.
 * We neutralize (set to undefined) any requestValidator/responseValidator entries produced by the
 * underlying generator (or previously gated variants) to avoid double validation cost.
 * Idempotent & non-invasive: safe to run multiple times.
 */
import fs from 'fs';
import path from 'path';

const sdkPath = path.resolve(process.cwd(), 'src/gen/sdk.gen.ts');
if (!fs.existsSync(sdkPath)) {
  console.error('[strip-validation] sdk.gen.ts not found, skipping');
  process.exit(0);
}
let code = fs.readFileSync(sdkPath, 'utf8');

// Remove any legacy gatedValidation import.
code = code.replace(/\nimport { gateRequest, gateResponse } from '..\/runtime\/gatedValidation';?\n/, '\n');

// Normalize opId constants (legacy gating inserted them); keep them (harmless) or ensure presence? We leave untouched.

// Replace any gated request/response validator wrappers with undefined.
code = code.replace(/requestValidator:\s*async\s*\(data\)\s*=>\s*{[^}]*?}\s*,/g, 'requestValidator: undefined,');
code = code.replace(/responseValidator:\s*async\s*\(data\)\s*=>\s*{[^}]*?}\s*,/g, 'responseValidator: undefined,');

// Also replace direct parseAsync validators (original generator form) with undefined.
code = code.replace(/requestValidator:\s*async\s*\(data\)\s*=>\s*{\s*return await z[A-Za-z0-9_]+Data\.parseAsync\(data\);\s*}\s*,/g, 'requestValidator: undefined,');
code = code.replace(/responseValidator:\s*async\s*\(data\)\s*=>\s*{\s*return await z[A-Za-z0-9_]+Response\.parseAsync\(data\);\s*}\s*,/g, 'responseValidator: undefined,');

// Ensure at least one Options export still follows imports (no change expected) – no action.

fs.writeFileSync(sdkPath, code, 'utf8');
console.log('[strip-validation] Neutralized validators in sdk.gen.ts');