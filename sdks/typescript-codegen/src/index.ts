/** Stable SDK entrypoint (manual). The generated exports now live in ./gen/public-index.ts */
import * as Generated from './gen/public-index';

// Re-export all generated named exports
export * from './gen/public-index';

// Provide default aggregate for `import camunda from '@camunda8/orchestration-cluster'`.
const camunda = { ...Generated } as typeof Generated & { };
export default camunda;
