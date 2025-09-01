#!/usr/bin/env tsx
/**
 * Generates Markdown documentation for the SDK including configuration table.
 * Output: docs/SDK_REFERENCE.md
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { configurationSpec } from '../src/runtime/unifiedConfiguration';

function genConfigSection(): string {
  const rows = configurationSpec().map(e => {
    const required = e.requiredWhen ? `Required when ${e.requiredWhen.key}=${e.requiredWhen.equals}` : (e.default === undefined ? 'Yes* (no default)' : 'No');
    const def = e.default !== undefined ? `\`${e.default}\`` : '—';
    const enumVals = e.enumValues ? e.enumValues.join(' | ') : '';
    const type = e.enumValues ? `enum(${enumVals})` : e.type;
    const deprecated = e.deprecated ? `Deprecated${e.replacement ? ` → use ${e.replacement}` : ''}` : '';
    return `| \`${e.key}\` | ${type} | ${def} | ${required} | ${e.secret ? 'secret' : ''} | ${deprecated} | ${e.doc} |`;
  }).join('\n');
  return `## Configuration\n\n| Key | Type | Default | Required | Flags | Status | Description |\n|-----|------|---------|----------|-------|--------|-------------|\n${rows}\n\n`;
}

function main() {
  const parts: string[] = [];
  parts.push('# Camunda TypeScript SDK Reference');
  parts.push('\nGenerated: ' + new Date().toISOString());
  parts.push(genConfigSection());
  const outDir = 'docs';
  mkdirSync(outDir, { recursive: true });
  const outFile = `${outDir}/SDK_REFERENCE.md`;
  writeFileSync(outFile, parts.join('\n'));
  console.log(`Generated ${outFile}`);
}

main();
