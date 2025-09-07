import chalk from 'chalk';
import { CoverageStats, FieldRecord } from '../types.js';

export function printConsole(stats: CoverageStats, records: FieldRecord[], limit = 50) {
  const missing = records.filter(r => !r.skip && !(r.hasExample || r.inheritedExample || r.synthetic));
  console.log(chalk.bold(`Example Coverage: ${stats.coveragePercent}% (${stats.covered}/${stats.total})`));
  console.log(chalk.gray(`Direct: ${stats.breakdown.inheritance.direct}  Inherited: ${stats.breakdown.inheritance.inherited}  Synthetic: ${stats.breakdown.synthetic}`));
  console.log('By origin:');
  for (const [o, v] of Object.entries(stats.breakdown.origin)) {
    const pct = v.total === 0 ? 100 : ((v.covered / v.total) * 100).toFixed(1);
    console.log(`  - ${o}: ${pct}% (${v.covered}/${v.total})`);
  }
  console.log();
  console.log(chalk.bold(`Missing (${missing.length}):`));
  for (const r of missing.slice(0, limit)) {
    console.log('  ' + chalk.red(r.path) + chalk.gray(r.schemaType ? ` (${r.schemaType})` : ''));
  }
  if (missing.length > limit) {
    console.log(chalk.gray(`  ... ${missing.length - limit} more`));
  }
}
