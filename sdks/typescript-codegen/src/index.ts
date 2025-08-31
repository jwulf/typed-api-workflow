/** Stable SDK entrypoint (manual). The generated exports now live in ./gen/public-index.ts */
import * as Generated from './gen/public-index';
import * as Ops from './gen/wrappers/flatExports';
import { auth } from './runtime/auth';
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
const { OpenAPI: __OpenAPI } = Generated as any;

// Protective facade preventing direct HEADERS reassignment while still allowing BASE etc.
const OpenAPI = new Proxy(__OpenAPI, {
	set(target, prop, value) {
		if (prop === 'HEADERS') {
			throw new Error('Do not set OpenAPI.HEADERS directly; use registerHeadersHook via auth facade.');
		}
		// allow overriding BASE, TOKEN etc for advanced scenarios
		// @ts-ignore
		target[prop] = value; return true;
	},
	get(target, prop, receiver) {
		if (prop === 'HEADERS') {
			return async () => await auth.getAuthHeaders();
		}
		// @ts-ignore
		return Reflect.get(target, prop, receiver);
	}
});

// Default export: OpenAPI plus all flat operation wrapper functions and auth facade.
const camunda = { OpenAPI, auth, ...Ops };
export default camunda;
