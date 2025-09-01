// Entry point: export Camunda8 class, key types, and errors.
import { Camunda8 } from './Camunda8';
export * from './gen/types.gen';
export { CamundaValidationError, EventualConsistencyTimeoutError } from './runtime/errors';
export { Camunda8 };
// Legacy helper expected in tests: hydrate from process.env (no-op wrapper around hydrateConfig for discoverability)
// export { hydrateConfig as configureFromEnv } from './runtime/unifiedConfiguration';
export default Camunda8;
