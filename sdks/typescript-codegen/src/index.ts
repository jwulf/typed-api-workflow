// Minimal entrypoint: export Camunda8 class & generated types (and errors) only.
import { Camunda8 } from './Camunda8';
export * from './gen/types.gen';
export { CamundaValidationError, EventualConsistencyTimeoutError } from './runtime/errors';
export { Camunda8 };
export default Camunda8;
