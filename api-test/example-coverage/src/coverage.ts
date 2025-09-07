import { FieldRecord, CoverageStats } from './types.js';

export function computeCoverage(records: FieldRecord[]): CoverageStats {
  const leafs = records.filter(r => !r.skip);
  const total = leafs.length;
  const covered = leafs.filter(r => r.hasExample || r.inheritedExample).length;
  const uncovered = total - covered;
  const coveragePercent = total === 0 ? 100 : +( (covered / total) * 100 ).toFixed(2);
  const origin: Record<string, { total: number; covered: number }> = {};
  let direct = 0, inherited = 0;
  for (const r of leafs) {
    origin[r.origin] ||= { total: 0, covered: 0 };
    origin[r.origin].total++;
    if (r.hasExample || r.inheritedExample) {
      origin[r.origin].covered++;
      if (r.hasExample) direct++; else inherited++;
    }
  }
  return {
    total,
    covered,
    uncovered,
    coveragePercent,
    breakdown: { origin, inheritance: { direct, inherited } }
  };
}
