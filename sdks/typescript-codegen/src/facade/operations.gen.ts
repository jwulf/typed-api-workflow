// @generated ergonomic operation wrappers
// DO NOT EDIT MANUALLY – run npm run generate
import { /* underlying */ activateAdHocSubProcessActivities as _activateAdHocSubProcessActivities, activateJobs as _activateJobs, assignClientToGroup as _assignClientToGroup, assignClientToTenant as _assignClientToTenant, assignGroupToTenant as _assignGroupToTenant, assignMappingRuleToGroup as _assignMappingRuleToGroup, assignMappingRuleToTenant as _assignMappingRuleToTenant, assignRoleToClient as _assignRoleToClient, assignRoleToGroup as _assignRoleToGroup, assignRoleToMappingRule as _assignRoleToMappingRule, assignRoleToTenant as _assignRoleToTenant, assignRoleToUser as _assignRoleToUser, assignUserTask as _assignUserTask, assignUserToGroup as _assignUserToGroup, assignUserToTenant as _assignUserToTenant, broadcastSignal as _broadcastSignal, cancelBatchOperation as _cancelBatchOperation, cancelProcessInstance as _cancelProcessInstance, cancelProcessInstancesBatchOperation as _cancelProcessInstancesBatchOperation, completeJob as _completeJob, completeUserTask as _completeUserTask, correlateMessage as _correlateMessage, createAdminUser as _createAdminUser, createAuthorization as _createAuthorization, createDeployment as _createDeployment, createDocument as _createDocument, createDocumentLink as _createDocumentLink, createDocuments as _createDocuments, createElementInstanceVariables as _createElementInstanceVariables, createGroup as _createGroup, createMappingRule as _createMappingRule, createProcessInstance as _createProcessInstance, createRole as _createRole, createTenant as _createTenant, createUser as _createUser, deleteAuthorization as _deleteAuthorization, deleteDocument as _deleteDocument, deleteGroup as _deleteGroup, deleteMappingRule as _deleteMappingRule, deleteResource as _deleteResource, deleteRole as _deleteRole, deleteTenant as _deleteTenant, deleteUser as _deleteUser, evaluateDecision as _evaluateDecision, failJob as _failJob, getAuthentication as _getAuthentication, getAuthorization as _getAuthorization, getBatchOperation as _getBatchOperation, getDecisionDefinition as _getDecisionDefinition, getDecisionDefinitionXML as _getDecisionDefinitionXML, getDecisionInstance as _getDecisionInstance, getDecisionRequirements as _getDecisionRequirements, getDecisionRequirementsXML as _getDecisionRequirementsXML, getDocument as _getDocument, getElementInstance as _getElementInstance, getGroup as _getGroup, getIncident as _getIncident, getLicense as _getLicense, getMappingRule as _getMappingRule, getProcessDefinition as _getProcessDefinition, getProcessDefinitionStatistics as _getProcessDefinitionStatistics, getProcessDefinitionXML as _getProcessDefinitionXML, getProcessInstance as _getProcessInstance, getProcessInstanceCallHierarchy as _getProcessInstanceCallHierarchy, getProcessInstanceSequenceFlows as _getProcessInstanceSequenceFlows, getProcessInstanceStatistics as _getProcessInstanceStatistics, getResource as _getResource, getResourceContent as _getResourceContent, getRole as _getRole, getStartProcessForm as _getStartProcessForm, getTenant as _getTenant, getTopology as _getTopology, getUsageMetrics as _getUsageMetrics, getUser as _getUser, getUserTask as _getUserTask, getUserTaskForm as _getUserTaskForm, getVariable as _getVariable, migrateProcessInstance as _migrateProcessInstance, migrateProcessInstancesBatchOperation as _migrateProcessInstancesBatchOperation, modifyProcessInstance as _modifyProcessInstance, modifyProcessInstancesBatchOperation as _modifyProcessInstancesBatchOperation, pinClock as _pinClock, publishMessage as _publishMessage, resetClock as _resetClock, resolveIncident as _resolveIncident, resolveIncidentsBatchOperation as _resolveIncidentsBatchOperation, resumeBatchOperation as _resumeBatchOperation, searchAuthorizations as _searchAuthorizations, searchBatchOperationItems as _searchBatchOperationItems, searchBatchOperations as _searchBatchOperations, searchClientsForGroup as _searchClientsForGroup, searchClientsForRole as _searchClientsForRole, searchClientsForTenant as _searchClientsForTenant, searchDecisionDefinitions as _searchDecisionDefinitions, searchDecisionInstances as _searchDecisionInstances, searchDecisionRequirements as _searchDecisionRequirements, searchElementInstances as _searchElementInstances, searchGroupIdsForTenant as _searchGroupIdsForTenant, searchGroups as _searchGroups, searchGroupsForRole as _searchGroupsForRole, searchIncidents as _searchIncidents, searchJobs as _searchJobs, searchMappingRule as _searchMappingRule, searchMappingRulesForGroup as _searchMappingRulesForGroup, searchMappingRulesForRole as _searchMappingRulesForRole, searchMappingsForTenant as _searchMappingsForTenant, searchMessageSubscriptions as _searchMessageSubscriptions, searchProcessDefinitions as _searchProcessDefinitions, searchProcessInstanceIncidents as _searchProcessInstanceIncidents, searchProcessInstances as _searchProcessInstances, searchRoles as _searchRoles, searchRolesForGroup as _searchRolesForGroup, searchRolesForTenant as _searchRolesForTenant, searchTenants as _searchTenants, searchUsers as _searchUsers, searchUsersForGroup as _searchUsersForGroup, searchUsersForRole as _searchUsersForRole, searchUsersForTenant as _searchUsersForTenant, searchUserTasks as _searchUserTasks, searchUserTaskVariables as _searchUserTaskVariables, searchVariables as _searchVariables, suspendBatchOperation as _suspendBatchOperation, throwJobError as _throwJobError, unassignClientFromGroup as _unassignClientFromGroup, unassignClientFromTenant as _unassignClientFromTenant, unassignGroupFromTenant as _unassignGroupFromTenant, unassignMappingRuleFromGroup as _unassignMappingRuleFromGroup, unassignMappingRuleFromTenant as _unassignMappingRuleFromTenant, unassignRoleFromClient as _unassignRoleFromClient, unassignRoleFromGroup as _unassignRoleFromGroup, unassignRoleFromMappingRule as _unassignRoleFromMappingRule, unassignRoleFromTenant as _unassignRoleFromTenant, unassignRoleFromUser as _unassignRoleFromUser, unassignUserFromGroup as _unassignUserFromGroup, unassignUserFromTenant as _unassignUserFromTenant, unassignUserTask as _unassignUserTask, updateAuthorization as _updateAuthorization, updateGroup as _updateGroup, updateJob as _updateJob, updateMappingRule as _updateMappingRule, updateRole as _updateRole, updateTenant as _updateTenant, updateUser as _updateUser, updateUserTask as _updateUserTask } from '../gen/sdk.gen';

// Lightweight CancelablePromise implementation (local to facade)
export class CancelError extends Error { constructor(){ super("Cancelled"); this.name = "CancelError"; } }
export interface CancelablePromise<T> extends Promise<T> { cancel(): void }
export function toCancelable<T>(factory:(signal:AbortSignal)=>Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  let inner = factory(ac.signal);
  const wrapped: any = new Promise<T>((resolve, reject) => {
    inner.then(resolve, reject);
  });
  wrapped.cancel = () => { ac.abort(); };
  return wrapped as CancelablePromise<T>;
}

// Helper conditional types to derive the success payload of the underlying call
type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;
// Exclude undefined so success payload types are always concrete (errors throw)
type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;

/**
 * activateJobs
 * Activate jobs
 * Iterate through all known partitions and activate jobs up to the requested maximum.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function activateJobs(body: any): CancelablePromise<_DataOf<typeof _activateJobs>>;
export function activateJobs(options: Parameters<typeof _activateJobs>[0]): CancelablePromise<_DataOf<typeof _activateJobs>>;
export function activateJobs(arg: any): CancelablePromise<_DataOf<typeof _activateJobs>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _activateJobs( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _activateJobs({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * broadcastSignal
 * Broadcast signal
 * Broadcasts a signal.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function broadcastSignal(body: any): CancelablePromise<_DataOf<typeof _broadcastSignal>>;
export function broadcastSignal(options: Parameters<typeof _broadcastSignal>[0]): CancelablePromise<_DataOf<typeof _broadcastSignal>>;
export function broadcastSignal(arg: any): CancelablePromise<_DataOf<typeof _broadcastSignal>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _broadcastSignal( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _broadcastSignal({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * cancelProcessInstancesBatchOperation
 * Create a batch operation to cancel process instances
 * Cancels multiple running process instances.
 * Since only ACTIVE root instances can be cancelled, any given filters for state and
 * parentProcessInstanceKey are ignored and overridden during this batch operation.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function cancelProcessInstancesBatchOperation(body: any): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>>;
export function cancelProcessInstancesBatchOperation(options: Parameters<typeof _cancelProcessInstancesBatchOperation>[0]): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>>;
export function cancelProcessInstancesBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _cancelProcessInstancesBatchOperation( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _cancelProcessInstancesBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * correlateMessage
 * Correlate message
 * Publishes a message and correlates it to a subscription.
 * If correlation is successful it will return the first process instance key the message correlated with.
 * The message is not buffered.
 * Use the publish message endpoint to send messages that can be buffered.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function correlateMessage(body: any): CancelablePromise<_DataOf<typeof _correlateMessage>>;
export function correlateMessage(options: Parameters<typeof _correlateMessage>[0]): CancelablePromise<_DataOf<typeof _correlateMessage>>;
export function correlateMessage(arg: any): CancelablePromise<_DataOf<typeof _correlateMessage>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _correlateMessage( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _correlateMessage({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createAdminUser
 * Create admin user
 * Creates a new user and assign the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createAdminUser(body: any): CancelablePromise<_DataOf<typeof _createAdminUser>>;
export function createAdminUser(options: Parameters<typeof _createAdminUser>[0]): CancelablePromise<_DataOf<typeof _createAdminUser>>;
export function createAdminUser(arg: any): CancelablePromise<_DataOf<typeof _createAdminUser>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createAdminUser( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createAdminUser({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createAuthorization
 * Create authorization
 * Create the authorization.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createAuthorization(body: any): CancelablePromise<_DataOf<typeof _createAuthorization>>;
export function createAuthorization(options: Parameters<typeof _createAuthorization>[0]): CancelablePromise<_DataOf<typeof _createAuthorization>>;
export function createAuthorization(arg: any): CancelablePromise<_DataOf<typeof _createAuthorization>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createAuthorization( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createAuthorization({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createDeployment
 * Deploy resources
 * Deploys one or more resources (e.g. processes, decision models, or forms).
 * This is an atomic call, i.e. either all resources are deployed or none of them are.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createDeployment(body: any): CancelablePromise<_DataOf<typeof _createDeployment>>;
export function createDeployment(options: Parameters<typeof _createDeployment>[0]): CancelablePromise<_DataOf<typeof _createDeployment>>;
export function createDeployment(arg: any): CancelablePromise<_DataOf<typeof _createDeployment>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createDeployment( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createDeployment({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createGroup
 * Create group
 * Create a new group.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createGroup(body: any): CancelablePromise<_DataOf<typeof _createGroup>>;
export function createGroup(options: Parameters<typeof _createGroup>[0]): CancelablePromise<_DataOf<typeof _createGroup>>;
export function createGroup(arg: any): CancelablePromise<_DataOf<typeof _createGroup>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createGroup( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createGroup({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createMappingRule
 * Create mapping rule
 * Create a new mapping rule
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createMappingRule(body: any): CancelablePromise<_DataOf<typeof _createMappingRule>>;
export function createMappingRule(options: Parameters<typeof _createMappingRule>[0]): CancelablePromise<_DataOf<typeof _createMappingRule>>;
export function createMappingRule(arg: any): CancelablePromise<_DataOf<typeof _createMappingRule>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createMappingRule( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createMappingRule({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createProcessInstance
 * Create process instance
 * Creates and starts an instance of the specified process.
 * The process definition to use to create the instance can be specified either using its unique key
 * (as returned by Deploy resources), or using the BPMN process ID and a version.
 * 
 * Waits for the completion of the process instance before returning a result
 * when awaitCompletion is enabled.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createProcessInstance(body: any): CancelablePromise<_DataOf<typeof _createProcessInstance>>;
export function createProcessInstance(options: Parameters<typeof _createProcessInstance>[0]): CancelablePromise<_DataOf<typeof _createProcessInstance>>;
export function createProcessInstance(arg: any): CancelablePromise<_DataOf<typeof _createProcessInstance>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createProcessInstance( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createProcessInstance({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createRole
 * Create role
 * Create a new role.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createRole(body: any): CancelablePromise<_DataOf<typeof _createRole>>;
export function createRole(options: Parameters<typeof _createRole>[0]): CancelablePromise<_DataOf<typeof _createRole>>;
export function createRole(arg: any): CancelablePromise<_DataOf<typeof _createRole>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createRole( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createRole({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createTenant
 * Create tenant
 * Creates a new tenant.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createTenant(body: any): CancelablePromise<_DataOf<typeof _createTenant>>;
export function createTenant(options: Parameters<typeof _createTenant>[0]): CancelablePromise<_DataOf<typeof _createTenant>>;
export function createTenant(arg: any): CancelablePromise<_DataOf<typeof _createTenant>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createTenant( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createTenant({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * createUser
 * Create user
 * Create a new user.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function createUser(body: any): CancelablePromise<_DataOf<typeof _createUser>>;
export function createUser(options: Parameters<typeof _createUser>[0]): CancelablePromise<_DataOf<typeof _createUser>>;
export function createUser(arg: any): CancelablePromise<_DataOf<typeof _createUser>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _createUser( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _createUser({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * evaluateDecision
 * Evaluate decision
 * Evaluates a decision.
 * You specify the decision to evaluate either by using its unique key (as returned by
 * DeployResource), or using the decision ID. When using the decision ID, the latest deployed
 * version of the decision is used.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function evaluateDecision(body: any): CancelablePromise<_DataOf<typeof _evaluateDecision>>;
export function evaluateDecision(options: Parameters<typeof _evaluateDecision>[0]): CancelablePromise<_DataOf<typeof _evaluateDecision>>;
export function evaluateDecision(arg: any): CancelablePromise<_DataOf<typeof _evaluateDecision>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _evaluateDecision( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _evaluateDecision({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * migrateProcessInstancesBatchOperation
 * Create a batch operation to migrate process instances
 * Migrate multiple instances of process instances.
 * Since only process instances with ACTIVE state can be migrated, any given
 * filters for state are ignored and overridden during this batch operation.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function migrateProcessInstancesBatchOperation(body: any): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>>;
export function migrateProcessInstancesBatchOperation(options: Parameters<typeof _migrateProcessInstancesBatchOperation>[0]): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>>;
export function migrateProcessInstancesBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _migrateProcessInstancesBatchOperation( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _migrateProcessInstancesBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * modifyProcessInstancesBatchOperation
 * Create a batch operation to modify process instances
 * Modify multiple process instances.
 * Since only process instances with ACTIVE state can be modified, any given
 * filters for state are ignored and overridden during this batch operation.
 * In contrast to single modification operation, it is not possible to add variable instructions or modify by element key.
 * It is only possible to use the element id of the source and target.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function modifyProcessInstancesBatchOperation(body: any): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>>;
export function modifyProcessInstancesBatchOperation(options: Parameters<typeof _modifyProcessInstancesBatchOperation>[0]): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>>;
export function modifyProcessInstancesBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _modifyProcessInstancesBatchOperation( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _modifyProcessInstancesBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * pinClock
 * Pin internal clock (alpha)
 * Set a precise, static time for the Zeebe engine’s internal clock.
 * When the clock is pinned, it remains at the specified time and does not advance.
 * To change the time, the clock must be pinned again with a new timestamp.
 * 
 * This endpoint is an alpha feature and may be subject to change
 * in future releases.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function pinClock(body: any): CancelablePromise<_DataOf<typeof _pinClock>>;
export function pinClock(options: Parameters<typeof _pinClock>[0]): CancelablePromise<_DataOf<typeof _pinClock>>;
export function pinClock(arg: any): CancelablePromise<_DataOf<typeof _pinClock>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _pinClock( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _pinClock({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * publishMessage
 * Publish message
 * Publishes a single message.
 * Messages are published to specific partitions computed from their correlation keys.
 * Messages can be buffered.
 * The endpoint does not wait for a correlation result.
 * Use the message correlation endpoint for such use cases.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function publishMessage(body: any): CancelablePromise<_DataOf<typeof _publishMessage>>;
export function publishMessage(options: Parameters<typeof _publishMessage>[0]): CancelablePromise<_DataOf<typeof _publishMessage>>;
export function publishMessage(arg: any): CancelablePromise<_DataOf<typeof _publishMessage>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _publishMessage( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _publishMessage({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * resolveIncidentsBatchOperation
 * Create a batch operation to resolve incidents of process instances
 * Resolves multiple instances of process instances.
 * Since only process instances with ACTIVE state can have unresolved incidents, any given
 * filters for state are ignored and overridden during this batch operation.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function resolveIncidentsBatchOperation(body: any): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>>;
export function resolveIncidentsBatchOperation(options: Parameters<typeof _resolveIncidentsBatchOperation>[0]): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>>;
export function resolveIncidentsBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _resolveIncidentsBatchOperation( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _resolveIncidentsBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchAuthorizations
 * Search authorizations
 * Search for authorizations based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchAuthorizations(body: any): CancelablePromise<_DataOf<typeof _searchAuthorizations>>;
export function searchAuthorizations(options: Parameters<typeof _searchAuthorizations>[0]): CancelablePromise<_DataOf<typeof _searchAuthorizations>>;
export function searchAuthorizations(arg: any): CancelablePromise<_DataOf<typeof _searchAuthorizations>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchAuthorizations( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchAuthorizations({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchBatchOperationItems
 * Search batch operation items
 * Search for batch operation items based on given criteria.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchBatchOperationItems(body: any): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>>;
export function searchBatchOperationItems(options: Parameters<typeof _searchBatchOperationItems>[0]): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>>;
export function searchBatchOperationItems(arg: any): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchBatchOperationItems( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchBatchOperationItems({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchBatchOperations
 * Search batch operations
 * Search for batch operations based on given criteria.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchBatchOperations(body: any): CancelablePromise<_DataOf<typeof _searchBatchOperations>>;
export function searchBatchOperations(options: Parameters<typeof _searchBatchOperations>[0]): CancelablePromise<_DataOf<typeof _searchBatchOperations>>;
export function searchBatchOperations(arg: any): CancelablePromise<_DataOf<typeof _searchBatchOperations>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchBatchOperations( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchBatchOperations({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchDecisionDefinitions
 * Search decision definitions
 * Search for decision definitions based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchDecisionDefinitions(body: any): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>>;
export function searchDecisionDefinitions(options: Parameters<typeof _searchDecisionDefinitions>[0]): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>>;
export function searchDecisionDefinitions(arg: any): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchDecisionDefinitions( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchDecisionDefinitions({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchDecisionInstances
 * Search decision instances
 * Search for decision instances based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchDecisionInstances(body: any): CancelablePromise<_DataOf<typeof _searchDecisionInstances>>;
export function searchDecisionInstances(options: Parameters<typeof _searchDecisionInstances>[0]): CancelablePromise<_DataOf<typeof _searchDecisionInstances>>;
export function searchDecisionInstances(arg: any): CancelablePromise<_DataOf<typeof _searchDecisionInstances>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchDecisionInstances( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchDecisionInstances({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchDecisionRequirements
 * Search decision requirements
 * Search for decision requirements based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchDecisionRequirements(body: any): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>>;
export function searchDecisionRequirements(options: Parameters<typeof _searchDecisionRequirements>[0]): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>>;
export function searchDecisionRequirements(arg: any): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchDecisionRequirements( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchDecisionRequirements({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchElementInstances
 * Search element instances
 * Search for element instances based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchElementInstances(body: any): CancelablePromise<_DataOf<typeof _searchElementInstances>>;
export function searchElementInstances(options: Parameters<typeof _searchElementInstances>[0]): CancelablePromise<_DataOf<typeof _searchElementInstances>>;
export function searchElementInstances(arg: any): CancelablePromise<_DataOf<typeof _searchElementInstances>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchElementInstances( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchElementInstances({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchGroups
 * Search groups
 * Search for groups based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchGroups(body: any): CancelablePromise<_DataOf<typeof _searchGroups>>;
export function searchGroups(options: Parameters<typeof _searchGroups>[0]): CancelablePromise<_DataOf<typeof _searchGroups>>;
export function searchGroups(arg: any): CancelablePromise<_DataOf<typeof _searchGroups>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchGroups( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchGroups({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchIncidents
 * Search incidents
 * Search for incidents based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchIncidents(body: any): CancelablePromise<_DataOf<typeof _searchIncidents>>;
export function searchIncidents(options: Parameters<typeof _searchIncidents>[0]): CancelablePromise<_DataOf<typeof _searchIncidents>>;
export function searchIncidents(arg: any): CancelablePromise<_DataOf<typeof _searchIncidents>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchIncidents( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchIncidents({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchJobs
 * Search jobs
 * Search for jobs based on given criteria.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchJobs(body: any): CancelablePromise<_DataOf<typeof _searchJobs>>;
export function searchJobs(options: Parameters<typeof _searchJobs>[0]): CancelablePromise<_DataOf<typeof _searchJobs>>;
export function searchJobs(arg: any): CancelablePromise<_DataOf<typeof _searchJobs>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchJobs( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchJobs({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchMappingRule
 * Search mapping rules
 * Search for mapping rules based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchMappingRule(body: any): CancelablePromise<_DataOf<typeof _searchMappingRule>>;
export function searchMappingRule(options: Parameters<typeof _searchMappingRule>[0]): CancelablePromise<_DataOf<typeof _searchMappingRule>>;
export function searchMappingRule(arg: any): CancelablePromise<_DataOf<typeof _searchMappingRule>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchMappingRule( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchMappingRule({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchMessageSubscriptions
 * Search message subscriptions
 * Search for message subscriptions based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchMessageSubscriptions(body: any): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>>;
export function searchMessageSubscriptions(options: Parameters<typeof _searchMessageSubscriptions>[0]): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>>;
export function searchMessageSubscriptions(arg: any): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchMessageSubscriptions( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchMessageSubscriptions({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchProcessDefinitions
 * Search process definitions
 * Search for process definitions based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchProcessDefinitions(body: any): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>>;
export function searchProcessDefinitions(options: Parameters<typeof _searchProcessDefinitions>[0]): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>>;
export function searchProcessDefinitions(arg: any): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchProcessDefinitions( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchProcessDefinitions({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchProcessInstances
 * Search process instances
 * Search for process instances based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchProcessInstances(body: any): CancelablePromise<_DataOf<typeof _searchProcessInstances>>;
export function searchProcessInstances(options: Parameters<typeof _searchProcessInstances>[0]): CancelablePromise<_DataOf<typeof _searchProcessInstances>>;
export function searchProcessInstances(arg: any): CancelablePromise<_DataOf<typeof _searchProcessInstances>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchProcessInstances( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchProcessInstances({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchRoles
 * Search roles
 * Search for roles based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchRoles(body: any): CancelablePromise<_DataOf<typeof _searchRoles>>;
export function searchRoles(options: Parameters<typeof _searchRoles>[0]): CancelablePromise<_DataOf<typeof _searchRoles>>;
export function searchRoles(arg: any): CancelablePromise<_DataOf<typeof _searchRoles>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchRoles( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchRoles({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchTenants
 * Search tenants
 * Retrieves a filtered and sorted list of tenants.
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchTenants(body: any): CancelablePromise<_DataOf<typeof _searchTenants>>;
export function searchTenants(options: Parameters<typeof _searchTenants>[0]): CancelablePromise<_DataOf<typeof _searchTenants>>;
export function searchTenants(arg: any): CancelablePromise<_DataOf<typeof _searchTenants>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchTenants( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchTenants({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchUsers
 * Search users
 * Search for users based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchUsers(body: any): CancelablePromise<_DataOf<typeof _searchUsers>>;
export function searchUsers(options: Parameters<typeof _searchUsers>[0]): CancelablePromise<_DataOf<typeof _searchUsers>>;
export function searchUsers(arg: any): CancelablePromise<_DataOf<typeof _searchUsers>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchUsers( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchUsers({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchUserTasks
 * Search user tasks
 * Search for user tasks based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchUserTasks(body: any): CancelablePromise<_DataOf<typeof _searchUserTasks>>;
export function searchUserTasks(options: Parameters<typeof _searchUserTasks>[0]): CancelablePromise<_DataOf<typeof _searchUserTasks>>;
export function searchUserTasks(arg: any): CancelablePromise<_DataOf<typeof _searchUserTasks>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchUserTasks( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchUserTasks({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * searchVariables
 * Search variables
 * Search for process and local variables based on given criteria.
 * 
 * Ergonomic wrapper: accepts raw body OR full options object; returns CancelablePromise<SuccessPayload>.
 */
export function searchVariables(body: any): CancelablePromise<_DataOf<typeof _searchVariables>>;
export function searchVariables(options: Parameters<typeof _searchVariables>[0]): CancelablePromise<_DataOf<typeof _searchVariables>>;
export function searchVariables(arg: any): CancelablePromise<_DataOf<typeof _searchVariables>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && (('body' in arg) || ('path' in arg) || ('query' in arg) || ('headers' in arg))) {
      return _searchVariables( { ...arg, signal } as any ).then((r:any)=> r?.data ?? r);
    }
    return _searchVariables({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * activateAdHocSubProcessActivities
 * Activate activities within an ad-hoc sub-process
 * Activates selected activities within an ad-hoc sub-process identified by element ID.
 * The provided element IDs must exist within the ad-hoc sub-process instance identified by the
 * provided adHocSubProcessInstanceKey.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function activateAdHocSubProcessActivities(options?: Parameters<typeof _activateAdHocSubProcessActivities>[0]): CancelablePromise<_DataOf<typeof _activateAdHocSubProcessActivities>> {
  return toCancelable(signal => _activateAdHocSubProcessActivities({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignClientToGroup
 * Assign a client to a group
 * Assigns a client to a group, making it a member of the group. Members of the group inherit the group authorizations, roles, and tenant assignments.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignClientToGroup(options?: Parameters<typeof _assignClientToGroup>[0]): CancelablePromise<_DataOf<typeof _assignClientToGroup>> {
  return toCancelable(signal => _assignClientToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignClientToTenant
 * Assign a client to a tenant
 * Assign the client to the specified tenant. The client can then access tenant data and perform authorized actions.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignClientToTenant(options?: Parameters<typeof _assignClientToTenant>[0]): CancelablePromise<_DataOf<typeof _assignClientToTenant>> {
  return toCancelable(signal => _assignClientToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignGroupToTenant
 * Assign a group to a tenant
 * Assigns a group to a specified tenant. Group members (users, clients) can then access tenant data and perform authorized actions.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignGroupToTenant(options?: Parameters<typeof _assignGroupToTenant>[0]): CancelablePromise<_DataOf<typeof _assignGroupToTenant>> {
  return toCancelable(signal => _assignGroupToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignMappingRuleToGroup
 * Assign a mapping rule to a group
 * Assigns a mapping rule to a group.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignMappingRuleToGroup(options?: Parameters<typeof _assignMappingRuleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToGroup>> {
  return toCancelable(signal => _assignMappingRuleToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignMappingRuleToTenant
 * Assign a mapping rule to a tenant
 * Assign a single mapping rule to a specified tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignMappingRuleToTenant(options?: Parameters<typeof _assignMappingRuleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToTenant>> {
  return toCancelable(signal => _assignMappingRuleToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignRoleToClient
 * Assign a role to a client
 * Assigns the specified role to the client.
 *  The client will inherit the authorizations associated with this role.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignRoleToClient(options?: Parameters<typeof _assignRoleToClient>[0]): CancelablePromise<_DataOf<typeof _assignRoleToClient>> {
  return toCancelable(signal => _assignRoleToClient({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignRoleToGroup
 * Assign a role to a group
 *  Assigns the specified role to the group.  Every member of the group (user or client) will inherit the authorizations associated with this role.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignRoleToGroup(options?: Parameters<typeof _assignRoleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignRoleToGroup>> {
  return toCancelable(signal => _assignRoleToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignRoleToMappingRule
 * Assign a role to a mapping rule
 * Assigns a role to a mapping rule.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignRoleToMappingRule(options?: Parameters<typeof _assignRoleToMappingRule>[0]): CancelablePromise<_DataOf<typeof _assignRoleToMappingRule>> {
  return toCancelable(signal => _assignRoleToMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignRoleToTenant
 * Assign a role to a tenant
 * Assigns a role to a specified tenant. Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignRoleToTenant(options?: Parameters<typeof _assignRoleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignRoleToTenant>> {
  return toCancelable(signal => _assignRoleToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignRoleToUser
 * Assign a role to a user
 * Assigns the specified role to the user. The user will inherit the authorizations associated with this role.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignRoleToUser(options?: Parameters<typeof _assignRoleToUser>[0]): CancelablePromise<_DataOf<typeof _assignRoleToUser>> {
  return toCancelable(signal => _assignRoleToUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignUserTask
 * Assign user task
 * Assigns a user task with the given key to the given assignee.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignUserTask(options?: Parameters<typeof _assignUserTask>[0]): CancelablePromise<_DataOf<typeof _assignUserTask>> {
  return toCancelable(signal => _assignUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignUserToGroup
 * Assign a user to a group
 * Assigns a user to a group, making the user a member of the group. Group members inherit the group authorizations, roles, and tenant assignments.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignUserToGroup(options?: Parameters<typeof _assignUserToGroup>[0]): CancelablePromise<_DataOf<typeof _assignUserToGroup>> {
  return toCancelable(signal => _assignUserToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * assignUserToTenant
 * Assign a user to a tenant
 * Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function assignUserToTenant(options?: Parameters<typeof _assignUserToTenant>[0]): CancelablePromise<_DataOf<typeof _assignUserToTenant>> {
  return toCancelable(signal => _assignUserToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * cancelBatchOperation
 * Cancel Batch operation
 * Cancels a running batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function cancelBatchOperation(options?: Parameters<typeof _cancelBatchOperation>[0]): CancelablePromise<_DataOf<typeof _cancelBatchOperation>> {
  return toCancelable(signal => _cancelBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * cancelProcessInstance
 * Cancel process instance
 * Cancels a running process instance. As a cancelation includes more than just the removal of the process instance resource, the cancelation resource must be posted.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function cancelProcessInstance(options?: Parameters<typeof _cancelProcessInstance>[0]): CancelablePromise<_DataOf<typeof _cancelProcessInstance>> {
  return toCancelable(signal => _cancelProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * completeJob
 * Complete job
 * Complete a job with the given payload, which allows completing the associated service task.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function completeJob(options?: Parameters<typeof _completeJob>[0]): CancelablePromise<_DataOf<typeof _completeJob>> {
  return toCancelable(signal => _completeJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * completeUserTask
 * Complete user task
 * Completes a user task with the given key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function completeUserTask(options?: Parameters<typeof _completeUserTask>[0]): CancelablePromise<_DataOf<typeof _completeUserTask>> {
  return toCancelable(signal => _completeUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * createDocument
 * Upload document
 * Upload a document to the Camunda 8 cluster.
 * 
 * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function createDocument(options?: Parameters<typeof _createDocument>[0]): CancelablePromise<_DataOf<typeof _createDocument>> {
  return toCancelable(signal => _createDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * createDocumentLink
 * Create document link
 * Create a link to a document in the Camunda 8 cluster.
 * 
 * Note that this is currently supported for document stores of type: AWS, GCP
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function createDocumentLink(options?: Parameters<typeof _createDocumentLink>[0]): CancelablePromise<_DataOf<typeof _createDocumentLink>> {
  return toCancelable(signal => _createDocumentLink({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * createDocuments
 * Upload multiple documents
 * Upload multiple documents to the Camunda 8 cluster.
 * 
 * The caller must provide a file name for each document, which will be used in case of a multi-status response
 * to identify which documents failed to upload. The file name can be provided in the `Content-Disposition` header
 * of the file part or in the `fileName` field of the metadata, which can be configured with
 * the `X-Document-Metadata` header for each file part. If both are provided, the `fileName` metadata field
 * takes precedence. For example, given the following headers for a file:
 * ```
 * Content-Disposition: form-data; name="files"; filename="bill.pdf"
 * X-Document-Metadata: {"fileName": "invoice.pdf", "size": 1234567}
 * ```
 * 
 * The filename will be `invoice.pdf`, but in the following example:
 * ```
 * Content-Disposition: form-data; name="files"; filename="bill.pdf"
 * X-Document-Metadata: {"size": 1234567}
 * ```
 * 
 * it would be `bill.pdf`.
 * 
 * In case of a multi-status response, the response body will contain a list of `DocumentBatchProblemDetail` objects,
 * each of which contains the file name of the document that failed to upload and the reason for the failure.
 * The client can choose to retry the whole batch or individual documents based on the response.
 * 
 * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function createDocuments(options?: Parameters<typeof _createDocuments>[0]): CancelablePromise<_DataOf<typeof _createDocuments>> {
  return toCancelable(signal => _createDocuments({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * createElementInstanceVariables
 * Update element instance variables
 * Updates all the variables of a particular scope (for example, process instance, element instance) with the given variable data.
 * Specify the element instance in the `elementInstanceKey` parameter.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function createElementInstanceVariables(options?: Parameters<typeof _createElementInstanceVariables>[0]): CancelablePromise<_DataOf<typeof _createElementInstanceVariables>> {
  return toCancelable(signal => _createElementInstanceVariables({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteAuthorization
 * Delete authorization
 * Deletes the authorization with the given key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteAuthorization(options?: Parameters<typeof _deleteAuthorization>[0]): CancelablePromise<_DataOf<typeof _deleteAuthorization>> {
  return toCancelable(signal => _deleteAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteDocument
 * Delete document
 * Delete a document from the Camunda 8 cluster.
 * 
 * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteDocument(options?: Parameters<typeof _deleteDocument>[0]): CancelablePromise<_DataOf<typeof _deleteDocument>> {
  return toCancelable(signal => _deleteDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteGroup
 * Delete group
 * Deletes the group with the given ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteGroup(options?: Parameters<typeof _deleteGroup>[0]): CancelablePromise<_DataOf<typeof _deleteGroup>> {
  return toCancelable(signal => _deleteGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteMappingRule
 * Delete a mapping rule
 * Deletes the mapping rule with the given ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteMappingRule(options?: Parameters<typeof _deleteMappingRule>[0]): CancelablePromise<_DataOf<typeof _deleteMappingRule>> {
  return toCancelable(signal => _deleteMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteResource
 * Delete resource
 * Deletes a deployed resource.
 * This can be a process definition, decision requirements definition, or form definition
 * deployed using the deploy resources endpoint. Specify the resource you want to delete in the `resourceKey` parameter.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteResource(options?: Parameters<typeof _deleteResource>[0]): CancelablePromise<_DataOf<typeof _deleteResource>> {
  return toCancelable(signal => _deleteResource({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteRole
 * Delete role
 * Deletes the role with the given ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteRole(options?: Parameters<typeof _deleteRole>[0]): CancelablePromise<_DataOf<typeof _deleteRole>> {
  return toCancelable(signal => _deleteRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteTenant
 * Delete tenant
 * Deletes an existing tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteTenant(options?: Parameters<typeof _deleteTenant>[0]): CancelablePromise<_DataOf<typeof _deleteTenant>> {
  return toCancelable(signal => _deleteTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * deleteUser
 * Delete user
 * Deletes a user.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function deleteUser(options?: Parameters<typeof _deleteUser>[0]): CancelablePromise<_DataOf<typeof _deleteUser>> {
  return toCancelable(signal => _deleteUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * failJob
 * Fail job
 * Mark the job as failed
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function failJob(options?: Parameters<typeof _failJob>[0]): CancelablePromise<_DataOf<typeof _failJob>> {
  return toCancelable(signal => _failJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getAuthentication
 * Get current user
 * Retrieves the current authenticated user.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getAuthentication(options?: Parameters<typeof _getAuthentication>[0]): CancelablePromise<_DataOf<typeof _getAuthentication>> {
  return toCancelable(signal => _getAuthentication({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getAuthorization
 * Get authorization
 * Get authorization by the given key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getAuthorization(options?: Parameters<typeof _getAuthorization>[0]): CancelablePromise<_DataOf<typeof _getAuthorization>> {
  return toCancelable(signal => _getAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getBatchOperation
 * Get batch operation
 * Get batch operation by key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getBatchOperation(options?: Parameters<typeof _getBatchOperation>[0]): CancelablePromise<_DataOf<typeof _getBatchOperation>> {
  return toCancelable(signal => _getBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getDecisionDefinition
 * Get decision definition
 * Returns a decision definition by key.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getDecisionDefinition(options?: Parameters<typeof _getDecisionDefinition>[0]): CancelablePromise<_DataOf<typeof _getDecisionDefinition>> {
  return toCancelable(signal => _getDecisionDefinition({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getDecisionDefinitionXML
 * Get decision definition XML
 * Returns decision definition as XML.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getDecisionDefinitionXML(options?: Parameters<typeof _getDecisionDefinitionXML>[0]): CancelablePromise<_DataOf<typeof _getDecisionDefinitionXML>> {
  return toCancelable(signal => _getDecisionDefinitionXML({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getDecisionInstance
 * Get decision instance
 * Returns a decision instance.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getDecisionInstance(options?: Parameters<typeof _getDecisionInstance>[0]): CancelablePromise<_DataOf<typeof _getDecisionInstance>> {
  return toCancelable(signal => _getDecisionInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getDecisionRequirements
 * Get decision requirements
 * Returns Decision Requirements as JSON.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getDecisionRequirements(options?: Parameters<typeof _getDecisionRequirements>[0]): CancelablePromise<_DataOf<typeof _getDecisionRequirements>> {
  return toCancelable(signal => _getDecisionRequirements({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getDecisionRequirementsXML
 * Get decision requirements XML
 * Returns decision requirements as XML.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getDecisionRequirementsXML(options?: Parameters<typeof _getDecisionRequirementsXML>[0]): CancelablePromise<_DataOf<typeof _getDecisionRequirementsXML>> {
  return toCancelable(signal => _getDecisionRequirementsXML({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getDocument
 * Download document
 * Download a document from the Camunda 8 cluster.
 * 
 * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getDocument(options?: Parameters<typeof _getDocument>[0]): CancelablePromise<_DataOf<typeof _getDocument>> {
  return toCancelable(signal => _getDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getElementInstance
 * Get element instance
 * Returns element instance as JSON.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getElementInstance(options?: Parameters<typeof _getElementInstance>[0]): CancelablePromise<_DataOf<typeof _getElementInstance>> {
  return toCancelable(signal => _getElementInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getGroup
 * Get group
 * Get a group by its ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getGroup(options?: Parameters<typeof _getGroup>[0]): CancelablePromise<_DataOf<typeof _getGroup>> {
  return toCancelable(signal => _getGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getIncident
 * Get incident
 * Returns incident as JSON.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getIncident(options?: Parameters<typeof _getIncident>[0]): CancelablePromise<_DataOf<typeof _getIncident>> {
  return toCancelable(signal => _getIncident({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getLicense
 * Get license status
 * Obtains the status of the current Camunda license.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getLicense(options?: Parameters<typeof _getLicense>[0]): CancelablePromise<_DataOf<typeof _getLicense>> {
  return toCancelable(signal => _getLicense({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getMappingRule
 * Get a mapping rule
 * Gets the mapping rule with the given ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getMappingRule(options?: Parameters<typeof _getMappingRule>[0]): CancelablePromise<_DataOf<typeof _getMappingRule>> {
  return toCancelable(signal => _getMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getProcessDefinition
 * Get process definition
 * Returns process definition as JSON.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getProcessDefinition(options?: Parameters<typeof _getProcessDefinition>[0]): CancelablePromise<_DataOf<typeof _getProcessDefinition>> {
  return toCancelable(signal => _getProcessDefinition({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getProcessDefinitionStatistics
 * Get process definition statistics
 * Get statistics about elements in currently running process instances by process definition key and search filter.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getProcessDefinitionStatistics(options?: Parameters<typeof _getProcessDefinitionStatistics>[0]): CancelablePromise<_DataOf<typeof _getProcessDefinitionStatistics>> {
  return toCancelable(signal => _getProcessDefinitionStatistics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getProcessDefinitionXML
 * Get process definition XML
 * Returns process definition as XML.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getProcessDefinitionXML(options?: Parameters<typeof _getProcessDefinitionXML>[0]): CancelablePromise<_DataOf<typeof _getProcessDefinitionXML>> {
  return toCancelable(signal => _getProcessDefinitionXML({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getProcessInstance
 * Get process instance
 * Get the process instance by the process instance key.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getProcessInstance(options?: Parameters<typeof _getProcessInstance>[0]): CancelablePromise<_DataOf<typeof _getProcessInstance>> {
  return toCancelable(signal => _getProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getProcessInstanceCallHierarchy
 * Get call hierarchy for process instance
 * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getProcessInstanceCallHierarchy(options?: Parameters<typeof _getProcessInstanceCallHierarchy>[0]): CancelablePromise<_DataOf<typeof _getProcessInstanceCallHierarchy>> {
  return toCancelable(signal => _getProcessInstanceCallHierarchy({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getProcessInstanceSequenceFlows
 * Get process instance sequence flows
 * Get sequence flows taken by the process instance.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getProcessInstanceSequenceFlows(options?: Parameters<typeof _getProcessInstanceSequenceFlows>[0]): CancelablePromise<_DataOf<typeof _getProcessInstanceSequenceFlows>> {
  return toCancelable(signal => _getProcessInstanceSequenceFlows({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getProcessInstanceStatistics
 * Get process instance statistics
 * Get statistics about elements by the process instance key.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getProcessInstanceStatistics(options?: Parameters<typeof _getProcessInstanceStatistics>[0]): CancelablePromise<_DataOf<typeof _getProcessInstanceStatistics>> {
  return toCancelable(signal => _getProcessInstanceStatistics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getResource
 * Get resource
 * Returns a deployed resource.
 * :::info
 * Currently, this endpoint only supports RPA resources.
 * :::
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getResource(options?: Parameters<typeof _getResource>[0]): CancelablePromise<_DataOf<typeof _getResource>> {
  return toCancelable(signal => _getResource({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getResourceContent
 * Get resource content
 * Returns the content of a deployed resource.
 * :::info
 * Currently, this endpoint only supports RPA resources.
 * :::
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getResourceContent(options?: Parameters<typeof _getResourceContent>[0]): CancelablePromise<_DataOf<typeof _getResourceContent>> {
  return toCancelable(signal => _getResourceContent({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getRole
 * Get role
 * Get a role by its ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getRole(options?: Parameters<typeof _getRole>[0]): CancelablePromise<_DataOf<typeof _getRole>> {
  return toCancelable(signal => _getRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getStartProcessForm
 * Get process start form
 * Get the start form of a process.
 * 
 * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getStartProcessForm(options?: Parameters<typeof _getStartProcessForm>[0]): CancelablePromise<_DataOf<typeof _getStartProcessForm>> {
  return toCancelable(signal => _getStartProcessForm({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getTenant
 * Get tenant
 * Retrieves a single tenant by tenant ID.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getTenant(options?: Parameters<typeof _getTenant>[0]): CancelablePromise<_DataOf<typeof _getTenant>> {
  return toCancelable(signal => _getTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getTopology
 * Get cluster topology
 * Obtains the current topology of the cluster the gateway is part of.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getTopology(options?: Parameters<typeof _getTopology>[0]): CancelablePromise<_DataOf<typeof _getTopology>> {
  return toCancelable(signal => _getTopology({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getUsageMetrics
 * Get usage metrics
 * Retrieve the usage metrics based on given criteria.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getUsageMetrics(options?: Parameters<typeof _getUsageMetrics>[0]): CancelablePromise<_DataOf<typeof _getUsageMetrics>> {
  return toCancelable(signal => _getUsageMetrics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getUser
 * Get user
 * Get a user by its username.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getUser(options?: Parameters<typeof _getUser>[0]): CancelablePromise<_DataOf<typeof _getUser>> {
  return toCancelable(signal => _getUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getUserTask
 * Get user task
 * Get the user task by the user task key.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getUserTask(options?: Parameters<typeof _getUserTask>[0]): CancelablePromise<_DataOf<typeof _getUserTask>> {
  return toCancelable(signal => _getUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getUserTaskForm
 * Get user task form
 * Get the form of a user task.
 * 
 * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getUserTaskForm(options?: Parameters<typeof _getUserTaskForm>[0]): CancelablePromise<_DataOf<typeof _getUserTaskForm>> {
  return toCancelable(signal => _getUserTaskForm({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * getVariable
 * Get variable
 * Get the variable by the variable key.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function getVariable(options?: Parameters<typeof _getVariable>[0]): CancelablePromise<_DataOf<typeof _getVariable>> {
  return toCancelable(signal => _getVariable({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * migrateProcessInstance
 * Migrate process instance
 * Migrates a process instance to a new process definition.
 * This request can contain multiple mapping instructions to define mapping between the active
 * process instance's elements and target process definition elements.
 * 
 * Use this to upgrade a process instance to a new version of a process or to
 * a different process definition, e.g. to keep your running instances up-to-date with the
 * latest process improvements.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function migrateProcessInstance(options?: Parameters<typeof _migrateProcessInstance>[0]): CancelablePromise<_DataOf<typeof _migrateProcessInstance>> {
  return toCancelable(signal => _migrateProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * modifyProcessInstance
 * Modify process instance
 * Modifies a running process instance.
 * This request can contain multiple instructions to activate an element of the process or
 * to terminate an active instance of an element.
 * 
 * Use this to repair a process instance that is stuck on an element or took an unintended path.
 * For example, because an external system is not available or doesn't respond as expected.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function modifyProcessInstance(options?: Parameters<typeof _modifyProcessInstance>[0]): CancelablePromise<_DataOf<typeof _modifyProcessInstance>> {
  return toCancelable(signal => _modifyProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * resetClock
 * Reset internal clock (alpha)
 * Resets the Zeebe engine’s internal clock to the current system time, enabling it to tick in real-time.
 * This operation is useful for returning the clock to
 * normal behavior after it has been pinned to a specific time.
 * 
 * This endpoint is an alpha feature and may be subject to change
 * in future releases.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function resetClock(options?: Parameters<typeof _resetClock>[0]): CancelablePromise<_DataOf<typeof _resetClock>> {
  return toCancelable(signal => _resetClock({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * resolveIncident
 * Resolve incident
 * Marks the incident as resolved; most likely a call to Update job will be necessary to reset the job’s retries, followed by this call.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function resolveIncident(options?: Parameters<typeof _resolveIncident>[0]): CancelablePromise<_DataOf<typeof _resolveIncident>> {
  return toCancelable(signal => _resolveIncident({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * resumeBatchOperation
 * Resume Batch operation
 * Resumes a suspended batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function resumeBatchOperation(options?: Parameters<typeof _resumeBatchOperation>[0]): CancelablePromise<_DataOf<typeof _resumeBatchOperation>> {
  return toCancelable(signal => _resumeBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchClientsForGroup
 * Search group clients
 * Search clients assigned to a group.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchClientsForGroup(options?: Parameters<typeof _searchClientsForGroup>[0]): CancelablePromise<_DataOf<typeof _searchClientsForGroup>> {
  return toCancelable(signal => _searchClientsForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchClientsForRole
 * Search role clients
 * Search clients with assigned role.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchClientsForRole(options?: Parameters<typeof _searchClientsForRole>[0]): CancelablePromise<_DataOf<typeof _searchClientsForRole>> {
  return toCancelable(signal => _searchClientsForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchClientsForTenant
 * Search clients for tenant
 * Retrieves a filtered and sorted list of clients for a specified tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchClientsForTenant(options?: Parameters<typeof _searchClientsForTenant>[0]): CancelablePromise<_DataOf<typeof _searchClientsForTenant>> {
  return toCancelable(signal => _searchClientsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchGroupIdsForTenant
 * Search groups for tenant
 * Retrieves a filtered and sorted list of groups for a specified tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchGroupIdsForTenant(options?: Parameters<typeof _searchGroupIdsForTenant>[0]): CancelablePromise<_DataOf<typeof _searchGroupIdsForTenant>> {
  return toCancelable(signal => _searchGroupIdsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchGroupsForRole
 * Search role groups
 * Search groups with assigned role.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchGroupsForRole(options?: Parameters<typeof _searchGroupsForRole>[0]): CancelablePromise<_DataOf<typeof _searchGroupsForRole>> {
  return toCancelable(signal => _searchGroupsForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchMappingRulesForGroup
 * Search group mapping rules
 * Search mapping rules assigned to a group.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchMappingRulesForGroup(options?: Parameters<typeof _searchMappingRulesForGroup>[0]): CancelablePromise<_DataOf<typeof _searchMappingRulesForGroup>> {
  return toCancelable(signal => _searchMappingRulesForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchMappingRulesForRole
 * Search role mapping rules
 * Search mapping rules with assigned role.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchMappingRulesForRole(options?: Parameters<typeof _searchMappingRulesForRole>[0]): CancelablePromise<_DataOf<typeof _searchMappingRulesForRole>> {
  return toCancelable(signal => _searchMappingRulesForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchMappingsForTenant
 * Search mapping rules for tenant
 * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchMappingsForTenant(options?: Parameters<typeof _searchMappingsForTenant>[0]): CancelablePromise<_DataOf<typeof _searchMappingsForTenant>> {
  return toCancelable(signal => _searchMappingsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchProcessInstanceIncidents
 * Search for incidents associated with a process instance
 * Search for incidents caused by the process instance or any of its called process or decision instances.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchProcessInstanceIncidents(options?: Parameters<typeof _searchProcessInstanceIncidents>[0]): CancelablePromise<_DataOf<typeof _searchProcessInstanceIncidents>> {
  return toCancelable(signal => _searchProcessInstanceIncidents({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchRolesForGroup
 * Search group roles
 * Search roles assigned to a group.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchRolesForGroup(options?: Parameters<typeof _searchRolesForGroup>[0]): CancelablePromise<_DataOf<typeof _searchRolesForGroup>> {
  return toCancelable(signal => _searchRolesForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchRolesForTenant
 * Search roles for tenant
 * Retrieves a filtered and sorted list of roles for a specified tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchRolesForTenant(options?: Parameters<typeof _searchRolesForTenant>[0]): CancelablePromise<_DataOf<typeof _searchRolesForTenant>> {
  return toCancelable(signal => _searchRolesForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchUsersForGroup
 * Search group users
 * Search users assigned to a group.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchUsersForGroup(options?: Parameters<typeof _searchUsersForGroup>[0]): CancelablePromise<_DataOf<typeof _searchUsersForGroup>> {
  return toCancelable(signal => _searchUsersForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchUsersForRole
 * Search role users
 * Search users with assigned role.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchUsersForRole(options?: Parameters<typeof _searchUsersForRole>[0]): CancelablePromise<_DataOf<typeof _searchUsersForRole>> {
  return toCancelable(signal => _searchUsersForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchUsersForTenant
 * Search users for tenant
 * Retrieves a filtered and sorted list of users for a specified tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchUsersForTenant(options?: Parameters<typeof _searchUsersForTenant>[0]): CancelablePromise<_DataOf<typeof _searchUsersForTenant>> {
  return toCancelable(signal => _searchUsersForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * searchUserTaskVariables
 * Search user task variables
 * Search for user task variables based on given criteria.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function searchUserTaskVariables(options?: Parameters<typeof _searchUserTaskVariables>[0]): CancelablePromise<_DataOf<typeof _searchUserTaskVariables>> {
  return toCancelable(signal => _searchUserTaskVariables({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * suspendBatchOperation
 * Suspend Batch operation
 * Suspends a running batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function suspendBatchOperation(options?: Parameters<typeof _suspendBatchOperation>[0]): CancelablePromise<_DataOf<typeof _suspendBatchOperation>> {
  return toCancelable(signal => _suspendBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * throwJobError
 * Throw error for job
 * Reports a business error (i.e. non-technical) that occurs while processing a job.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function throwJobError(options?: Parameters<typeof _throwJobError>[0]): CancelablePromise<_DataOf<typeof _throwJobError>> {
  return toCancelable(signal => _throwJobError({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignClientFromGroup
 * Unassign a client from a group
 * Unassigns a client from a group.
 *  The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignClientFromGroup(options?: Parameters<typeof _unassignClientFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromGroup>> {
  return toCancelable(signal => _unassignClientFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignClientFromTenant
 * Unassign a client from a tenant
 * Unassigns the client from the specified tenant. The client can no longer access tenant data.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignClientFromTenant(options?: Parameters<typeof _unassignClientFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromTenant>> {
  return toCancelable(signal => _unassignClientFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignGroupFromTenant
 * Unassign a group from a tenant
 * Unassigns a group from a specified tenant. Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignGroupFromTenant(options?: Parameters<typeof _unassignGroupFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignGroupFromTenant>> {
  return toCancelable(signal => _unassignGroupFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignMappingRuleFromGroup
 * Unassign a mapping rule from a group
 * Unassigns a mapping rule from a group.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignMappingRuleFromGroup(options?: Parameters<typeof _unassignMappingRuleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromGroup>> {
  return toCancelable(signal => _unassignMappingRuleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignMappingRuleFromTenant
 * Unassign a mapping rule from a tenant
 * Unassigns a single mapping rule from a specified tenant without deleting the rule.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignMappingRuleFromTenant(options?: Parameters<typeof _unassignMappingRuleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromTenant>> {
  return toCancelable(signal => _unassignMappingRuleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignRoleFromClient
 * Unassign a role from a client
 *  Unassigns the specified role from the client.  The client will no longer inherit the authorizations associated with this role.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignRoleFromClient(options?: Parameters<typeof _unassignRoleFromClient>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromClient>> {
  return toCancelable(signal => _unassignRoleFromClient({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignRoleFromGroup
 * Unassign a role from a group
 * Unassigns the specified role from the group. All group members (user or client) no longer inherit the authorizations associated with this role.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignRoleFromGroup(options?: Parameters<typeof _unassignRoleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromGroup>> {
  return toCancelable(signal => _unassignRoleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignRoleFromMappingRule
 * Unassign a role from a mapping rule
 * Unassigns a role from a mapping rule.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignRoleFromMappingRule(options?: Parameters<typeof _unassignRoleFromMappingRule>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromMappingRule>> {
  return toCancelable(signal => _unassignRoleFromMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignRoleFromTenant
 * Unassign a role from a tenant
 * Unassigns a role from a specified tenant. Users, Clients or Groups, that have the role assigned, will no longer have access to the tenant's data - unless they are assigned directly to the tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignRoleFromTenant(options?: Parameters<typeof _unassignRoleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromTenant>> {
  return toCancelable(signal => _unassignRoleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignRoleFromUser
 * Unassign a role from a user
 * Unassigns a role from a user.
 *  The user will no longer inherit the authorizations associated with this role.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignRoleFromUser(options?: Parameters<typeof _unassignRoleFromUser>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromUser>> {
  return toCancelable(signal => _unassignRoleFromUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignUserFromGroup
 * Unassign a user from a group
 * Unassigns a user from a group.
 *  The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignUserFromGroup(options?: Parameters<typeof _unassignUserFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromGroup>> {
  return toCancelable(signal => _unassignUserFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignUserFromTenant
 * Unassign a user from a tenant
 * Unassigns the user from the specified tenant. The user can no longer access tenant data.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignUserFromTenant(options?: Parameters<typeof _unassignUserFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromTenant>> {
  return toCancelable(signal => _unassignUserFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * unassignUserTask
 * Unassign user task
 * Removes the assignee of a task with the given key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function unassignUserTask(options?: Parameters<typeof _unassignUserTask>[0]): CancelablePromise<_DataOf<typeof _unassignUserTask>> {
  return toCancelable(signal => _unassignUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateAuthorization
 * Update authorization
 * Update the authorization with the given key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateAuthorization(options?: Parameters<typeof _updateAuthorization>[0]): CancelablePromise<_DataOf<typeof _updateAuthorization>> {
  return toCancelable(signal => _updateAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateGroup
 * Update group
 * Update a group with the given ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateGroup(options?: Parameters<typeof _updateGroup>[0]): CancelablePromise<_DataOf<typeof _updateGroup>> {
  return toCancelable(signal => _updateGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateJob
 * Update job
 * Update a job with the given key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateJob(options?: Parameters<typeof _updateJob>[0]): CancelablePromise<_DataOf<typeof _updateJob>> {
  return toCancelable(signal => _updateJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateMappingRule
 * Update mapping rule
 * Update a mapping rule.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateMappingRule(options?: Parameters<typeof _updateMappingRule>[0]): CancelablePromise<_DataOf<typeof _updateMappingRule>> {
  return toCancelable(signal => _updateMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateRole
 * Update role
 * Update a role with the given ID.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateRole(options?: Parameters<typeof _updateRole>[0]): CancelablePromise<_DataOf<typeof _updateRole>> {
  return toCancelable(signal => _updateRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateTenant
 * Update tenant
 * Updates an existing tenant.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateTenant(options?: Parameters<typeof _updateTenant>[0]): CancelablePromise<_DataOf<typeof _updateTenant>> {
  return toCancelable(signal => _updateTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateUser
 * Update user
 * Updates a user.
 * 
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateUser(options?: Parameters<typeof _updateUser>[0]): CancelablePromise<_DataOf<typeof _updateUser>> {
  return toCancelable(signal => _updateUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * updateUserTask
 * Update user task
 * Update a user task with the given key.
 * Passthrough wrapper: options only; returns CancelablePromise<SuccessPayload>.
 */
export function updateUserTask(options?: Parameters<typeof _updateUserTask>[0]): CancelablePromise<_DataOf<typeof _updateUserTask>> {
  return toCancelable(signal => _updateUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}
