#!/usr/bin/env node
import { loadAndDeref } from './loadSpec.js';
import { collectFromDoc } from './traverse.js';
import { computeCoverage } from './coverage.js';
import { printConsole } from './report/toConsole.js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: example-coverage <specPath> [--format json|console] [--out file] [--fail-under N]');
    process.exit(1);
  }
  const specPath = findSpecPathArg(args);
  if (!specPath) {
    console.error('Spec path not provided or placed after flags.');
    process.exit(1);
  }
  const format = getArg('--format', args) || 'console';
  const out = getArg('--out', args);
  const failUnderRaw = getArg('--fail-under', args);
  const failUnder = failUnderRaw ? parseFloat(failUnderRaw) : undefined;

  const { deref } = await loadAndDeref(specPath);
  const records = collectFromDoc(deref);
  const stats = computeCoverage(records);

  if (format === 'console') {
    printConsole(stats, records);
  } else if (format === 'json') {
    const payload = { stats, missing: records.filter(r => !(r.hasExample || r.inheritedExample)).map(r => r.path) };
    if (out) {
      await fs.mkdir(path.dirname(out), { recursive: true });
      await fs.writeFile(out, JSON.stringify(payload, null, 2));
      console.log('Wrote', out);
    } else {
      console.log(JSON.stringify(payload, null, 2));
    }
  }

  // Always output a concise summary line
  console.log(`Summary: ${stats.coveragePercent}% (${stats.covered}/${stats.total}) fields with examples.`);

  if (failUnder !== undefined && stats.coveragePercent < failUnder) {
    console.error(`Coverage ${stats.coveragePercent}% below threshold ${failUnder}%`);
    process.exit(2);
  }
}

function getArg(flag: string, args: string[]): string | undefined {
  const i = args.indexOf(flag);
  if (i >= 0) return args[i + 1];
  return undefined;
}

function findSpecPathArg(args: string[]): string | undefined {
  const flagSet = new Set(['--format', '--out', '--fail-under']);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      if (flagSet.has(a)) i++; // skip value
      continue;
    }
    return a; // first non-flag token considered spec path
  }
  return undefined;
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
