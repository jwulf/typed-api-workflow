/**
 * Factory function to enhance API classes with eventually consistent method types
 * This provides compile-time type safety for the .eventually() methods that are added at runtime by decorators
 */

// Import the enhanced type definitions
import type * as EventualityTypes from '../EventualityTypes';

// Union type of all supported API classes
type SupportedApiClass = 
  | import('../api/processInstanceApi').ProcessInstanceApi
  | import('../api/jobApi').JobApi
  | import('../api/elementInstanceApi').ElementInstanceApi
  | import('../api/incidentApi').IncidentApi
  | import('../api/variableApi').VariableApi
  | import('../api/userTaskApi').UserTaskApi
  | import('../api/decisionInstanceApi').DecisionInstanceApi
  | import('../api/decisionDefinitionApi').DecisionDefinitionApi
  | import('../api/processDefinitionApi').ProcessDefinitionApi;

// Type mapping from API classes to their enhanced versions
type EnhancedVersion<T> = 
  T extends import('../api/processInstanceApi').ProcessInstanceApi ? EventualityTypes.ProcessInstanceApiWithEventuality :
  T extends import('../api/jobApi').JobApi ? EventualityTypes.JobApiWithEventuality :
  T extends import('../api/elementInstanceApi').ElementInstanceApi ? EventualityTypes.ElementInstanceApiWithEventuality :
  T extends import('../api/incidentApi').IncidentApi ? EventualityTypes.IncidentApiWithEventuality :
  T extends import('../api/variableApi').VariableApi ? EventualityTypes.VariableApiWithEventuality :
  T extends import('../api/userTaskApi').UserTaskApi ? EventualityTypes.UserTaskApiWithEventuality :
  T extends import('../api/decisionInstanceApi').DecisionInstanceApi ? EventualityTypes.DecisionInstanceApiWithEventuality :
  T extends import('../api/decisionDefinitionApi').DecisionDefinitionApi ? EventualityTypes.DecisionDefinitionApiWithEventuality :
  T extends import('../api/processDefinitionApi').ProcessDefinitionApi ? EventualityTypes.ProcessDefinitionApiWithEventuality :
  never;

/**
 * Enhances an API class instance with eventually consistent method types
 * 
 * This is a zero-cost type assertion that tells TypeScript about the .eventually() methods
 * that are added to decorated methods at runtime. The actual runtime behavior is provided
 * by the @eventuallyconsistent decorators.
 * 
 * @param api - An instance of an API class from the generated SDK
 * @returns The same instance, but with enhanced type information for eventually consistent methods
 * 
 * @example
 * ```typescript
 * import { ProcessInstanceApi } from './api/processInstanceApi';
 * import { WithEventuality } from './ergonomics/WithEventuality';
 * 
 * const api = new ProcessInstanceApi();
 * const enhancedApi = WithEventuality(api);
 * 
 * // Both methods work with full type safety
 * const result1 = await enhancedApi.searchProcessInstances(query);
 * const result2 = await enhancedApi.searchProcessInstances.eventually(query, { timeout: 5000 });
 * ```
 */
export function WithEventuality<T extends SupportedApiClass>(api: T): EnhancedVersion<T> {
  // This is purely a type assertion - no runtime changes needed
  // The @eventuallyconsistent decorators have already added the .eventually() methods
  return api as unknown as EnhancedVersion<T>;
}
