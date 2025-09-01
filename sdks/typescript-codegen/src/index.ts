// Entry point: export Camunda8 class, facade operations, key types, and errors.
import { Camunda8 } from './Camunda8';
import * as Facade from './facade/operations.gen';
export * from './gen/types.gen';
export { CamundaValidationError, EventualConsistencyTimeoutError } from './runtime/errors';
export { Camunda8 };
// Back-compat: named facade instance (stateless wrappers rely on global config hydration under the hood)
export const camunda = Facade;
// Legacy helper expected in tests: hydrate from process.env (no-op wrapper around hydrateConfig for discoverability)
export { hydrateConfig as configureFromEnv } from './runtime/unifiedConfiguration';
export * from './facade/operations.gen';
export default Camunda8;
