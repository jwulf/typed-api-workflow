export interface FieldRecord {
  path: string;
  schemaType?: string;
  format?: string;
  origin: 'request' | 'response' | 'component' | 'parameter';
  viaRef?: string;
  refPointer?: string; // original $ref pointer if present
  hasExample: boolean;
  inheritedExample: boolean;
  exampleSourceRef?: string;
  enum?: string[];
  suggestions?: string[];
  skip?: boolean;
}

export interface CoverageStats {
  total: number;
  covered: number;
  uncovered: number;
  coveragePercent: number;
  breakdown: {
    origin: Record<string, { total: number; covered: number }>;
    inheritance: { direct: number; inherited: number };
  };
}

export interface AnalysisOptions {
  includeOrphans?: boolean;
  failUnder?: number;
  format?: 'console' | 'json' | 'markdown';
  out?: string;
  ignoreOrigins?: string[];
}
