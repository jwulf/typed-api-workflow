/** Stable SDK entrypoint (manual). The generated exports now live in ./gen/public-index.ts */
import * as Generated from './gen/public-index';
import * as Ops from './gen/wrappers/flatExports';
// Re-export generated named symbols (schemas, keys, config, wrappers, operations)
export * from './gen/public-index';
export { CamundaValidationError } from './runtime/errors';

// Curated namespaces for clarity (optional to import)
// Schemas: all exported Zod schemas (they are already individually exported)
// Keys: all branded key helpers/types (re-exported from semantic camundaKeys)
import * as SchemasNS from './gen/semantic/zodModels';
import * as KeysNS from './gen/semantic/camundaKeys';
export const Schemas = SchemasNS;
export const Keys = KeysNS;

// Build minimal default export containing only callable API methods (wrapped)
// and flat operation exports; exclude schemas & keys for tree-shaking.
const { OpenAPI } = Generated as any;
// Default export: OpenAPI plus all flat operation wrapper functions.
const camunda = { OpenAPI, ...Ops };
export default camunda;
