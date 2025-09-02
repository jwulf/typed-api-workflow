// Entry point: export Camunda class, key types, and errors.
import { CamundaClient } from './CamundaClient';
export * from './gen/types.gen';
export { CamundaValidationError, EventualConsistencyTimeoutError } from './runtime/errors';
export { CamundaClient, CamundaClient as Camunda }; // Camunda alias for backward compatibility
// Legacy helper expected in tests: hydrate from process.env (no-op wrapper around hydrateConfig for discoverability)
// export { hydrateConfig as configureFromEnv } from './runtime/unifiedConfiguration';
export default CamundaClient;
