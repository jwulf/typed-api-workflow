/** Stable SDK entrypoint (manual). The generated exports now live in ./gen/index.ts */
import * as Generated from './gen';
import { auth } from './runtime/auth';
import * as Facade from './gen/facade.gen';
// Re-export facade barrel (operations + key types) plus raw generated types
export * from './gen/facade.gen';
export * from './gen/types.gen';
export { CamundaValidationError, EventualConsistencyTimeoutError } from './runtime/errors';

// Curated namespaces for clarity (optional to import)
// Schemas: all exported Zod schemas (they are already individually exported)
// Keys: all branded key helpers/types (re-exported from semantic camundaKeys)
// Key namespace shim (branding helpers)
import * as KeysNS from './gen/semantic/camundaKeys';
export const Schemas = {} as Record<string, unknown>;
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

// Build default export object exposing:
//  - OpenAPI config proxy
//  - auth facade
//  - all ergonomic operation functions (from facade.gen)
//  - Keys namespace (runtime helper namespaces for branded keys)
// Note: Type exports (CamundaKey<...>) remain as separate named exports – they don't exist at runtime.
const camunda = {...Facade, ...Keys, OpenAPI}

export { camunda };
export default camunda;
