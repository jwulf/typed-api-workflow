// @generated ergonomic operation wrappers
// DO NOT EDIT MANUALLY – run npm run generate
import { /* underlying */ activateAdHocSubProcessActivities as _activateAdHocSubProcessActivities, activateJobs as _activateJobs, assignClientToGroup as _assignClientToGroup, assignClientToTenant as _assignClientToTenant, assignGroupToTenant as _assignGroupToTenant, assignMappingRuleToGroup as _assignMappingRuleToGroup, assignMappingRuleToTenant as _assignMappingRuleToTenant, assignRoleToClient as _assignRoleToClient, assignRoleToGroup as _assignRoleToGroup, assignRoleToMappingRule as _assignRoleToMappingRule, assignRoleToTenant as _assignRoleToTenant, assignRoleToUser as _assignRoleToUser, assignUserTask as _assignUserTask, assignUserToGroup as _assignUserToGroup, assignUserToTenant as _assignUserToTenant, broadcastSignal as _broadcastSignal, cancelBatchOperation as _cancelBatchOperation, cancelProcessInstance as _cancelProcessInstance, cancelProcessInstancesBatchOperation as _cancelProcessInstancesBatchOperation, completeJob as _completeJob, completeUserTask as _completeUserTask, correlateMessage as _correlateMessage, createAdminUser as _createAdminUser, createAuthorization as _createAuthorization, createDeployment as _createDeployment, createDocument as _createDocument, createDocumentLink as _createDocumentLink, createDocuments as _createDocuments, createElementInstanceVariables as _createElementInstanceVariables, createGroup as _createGroup, createMappingRule as _createMappingRule, createProcessInstance as _createProcessInstance, createRole as _createRole, createTenant as _createTenant, createUser as _createUser, deleteAuthorization as _deleteAuthorization, deleteDocument as _deleteDocument, deleteGroup as _deleteGroup, deleteMappingRule as _deleteMappingRule, deleteResource as _deleteResource, deleteRole as _deleteRole, deleteTenant as _deleteTenant, deleteUser as _deleteUser, evaluateDecision as _evaluateDecision, failJob as _failJob, getAuthentication as _getAuthentication, getAuthorization as _getAuthorization, getBatchOperation as _getBatchOperation, getDecisionDefinition as _getDecisionDefinition, getDecisionDefinitionXml as _getDecisionDefinitionXml, getDecisionInstance as _getDecisionInstance, getDecisionRequirements as _getDecisionRequirements, getDecisionRequirementsXml as _getDecisionRequirementsXml, getDocument as _getDocument, getElementInstance as _getElementInstance, getGroup as _getGroup, getIncident as _getIncident, getLicense as _getLicense, getMappingRule as _getMappingRule, getProcessDefinition as _getProcessDefinition, getProcessDefinitionStatistics as _getProcessDefinitionStatistics, getProcessDefinitionXml as _getProcessDefinitionXml, getProcessInstance as _getProcessInstance, getProcessInstanceCallHierarchy as _getProcessInstanceCallHierarchy, getProcessInstanceSequenceFlows as _getProcessInstanceSequenceFlows, getProcessInstanceStatistics as _getProcessInstanceStatistics, getResource as _getResource, getResourceContent as _getResourceContent, getRole as _getRole, getStartProcessForm as _getStartProcessForm, getTenant as _getTenant, getTopology as _getTopology, getUsageMetrics as _getUsageMetrics, getUser as _getUser, getUserTask as _getUserTask, getUserTaskForm as _getUserTaskForm, getVariable as _getVariable, migrateProcessInstance as _migrateProcessInstance, migrateProcessInstancesBatchOperation as _migrateProcessInstancesBatchOperation, modifyProcessInstance as _modifyProcessInstance, modifyProcessInstancesBatchOperation as _modifyProcessInstancesBatchOperation, pinClock as _pinClock, publishMessage as _publishMessage, resetClock as _resetClock, resolveIncident as _resolveIncident, resolveIncidentsBatchOperation as _resolveIncidentsBatchOperation, resumeBatchOperation as _resumeBatchOperation, searchAuthorizations as _searchAuthorizations, searchBatchOperationItems as _searchBatchOperationItems, searchBatchOperations as _searchBatchOperations, searchClientsForGroup as _searchClientsForGroup, searchClientsForRole as _searchClientsForRole, searchClientsForTenant as _searchClientsForTenant, searchDecisionDefinitions as _searchDecisionDefinitions, searchDecisionInstances as _searchDecisionInstances, searchDecisionRequirements as _searchDecisionRequirements, searchElementInstances as _searchElementInstances, searchGroupIdsForTenant as _searchGroupIdsForTenant, searchGroups as _searchGroups, searchGroupsForRole as _searchGroupsForRole, searchIncidents as _searchIncidents, searchJobs as _searchJobs, searchMappingRule as _searchMappingRule, searchMappingRulesForGroup as _searchMappingRulesForGroup, searchMappingRulesForRole as _searchMappingRulesForRole, searchMappingsForTenant as _searchMappingsForTenant, searchMessageSubscriptions as _searchMessageSubscriptions, searchProcessDefinitions as _searchProcessDefinitions, searchProcessInstanceIncidents as _searchProcessInstanceIncidents, searchProcessInstances as _searchProcessInstances, searchRoles as _searchRoles, searchRolesForGroup as _searchRolesForGroup, searchRolesForTenant as _searchRolesForTenant, searchTenants as _searchTenants, searchUsers as _searchUsers, searchUsersForGroup as _searchUsersForGroup, searchUsersForRole as _searchUsersForRole, searchUsersForTenant as _searchUsersForTenant, searchUserTasks as _searchUserTasks, searchUserTaskVariables as _searchUserTaskVariables, searchVariables as _searchVariables, suspendBatchOperation as _suspendBatchOperation, throwJobError as _throwJobError, unassignClientFromGroup as _unassignClientFromGroup, unassignClientFromTenant as _unassignClientFromTenant, unassignGroupFromTenant as _unassignGroupFromTenant, unassignMappingRuleFromGroup as _unassignMappingRuleFromGroup, unassignMappingRuleFromTenant as _unassignMappingRuleFromTenant, unassignRoleFromClient as _unassignRoleFromClient, unassignRoleFromGroup as _unassignRoleFromGroup, unassignRoleFromMappingRule as _unassignRoleFromMappingRule, unassignRoleFromTenant as _unassignRoleFromTenant, unassignRoleFromUser as _unassignRoleFromUser, unassignUserFromGroup as _unassignUserFromGroup, unassignUserFromTenant as _unassignUserFromTenant, unassignUserTask as _unassignUserTask, updateAuthorization as _updateAuthorization, updateGroup as _updateGroup, updateJob as _updateJob, updateMappingRule as _updateMappingRule, updateRole as _updateRole, updateTenant as _updateTenant, updateUser as _updateUser, updateUserTask as _updateUserTask } from '../gen/sdk.gen';

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

type _activateJobs_Options = Parameters<typeof _activateJobs>[0];
type _activateJobs_MaybeBody = _activateJobs_Options extends { body?: infer B } ? B : never;
type _activateJobs_Body = [ _activateJobs_MaybeBody ] extends [never] ? unknown : _activateJobs_MaybeBody;
/**
 * Activate jobs
 * Iterate through all known partitions and activate jobs up to the requested maximum.
 *
  *
 * @operationId activateJobs
 * @tags Job
 */
export function activateJobs(body: _activateJobs_Body): CancelablePromise<_DataOf<typeof _activateJobs>>;
export function activateJobs(options: _activateJobs_Options): CancelablePromise<_DataOf<typeof _activateJobs>>;
export function activateJobs(arg: any): CancelablePromise<_DataOf<typeof _activateJobs>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _activateJobs({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _activateJobs({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _broadcastSignal_Options = Parameters<typeof _broadcastSignal>[0];
type _broadcastSignal_MaybeBody = _broadcastSignal_Options extends { body?: infer B } ? B : never;
type _broadcastSignal_Body = [ _broadcastSignal_MaybeBody ] extends [never] ? unknown : _broadcastSignal_MaybeBody;
/**
 * Broadcast signal
 * Broadcasts a signal.
  *
 * @operationId broadcastSignal
 * @tags Signal
 */
export function broadcastSignal(body: _broadcastSignal_Body): CancelablePromise<_DataOf<typeof _broadcastSignal>>;
export function broadcastSignal(options: _broadcastSignal_Options): CancelablePromise<_DataOf<typeof _broadcastSignal>>;
export function broadcastSignal(arg: any): CancelablePromise<_DataOf<typeof _broadcastSignal>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _broadcastSignal({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _broadcastSignal({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _cancelProcessInstancesBatchOperation_Options = Parameters<typeof _cancelProcessInstancesBatchOperation>[0];
type _cancelProcessInstancesBatchOperation_MaybeBody = _cancelProcessInstancesBatchOperation_Options extends { body?: infer B } ? B : never;
type _cancelProcessInstancesBatchOperation_Body = [ _cancelProcessInstancesBatchOperation_MaybeBody ] extends [never] ? unknown : _cancelProcessInstancesBatchOperation_MaybeBody;
/**
 * Create a batch operation to cancel process instances
 * Cancels multiple running process instances.
 * Since only ACTIVE root instances can be cancelled, any given filters for state and
 * parentProcessInstanceKey are ignored and overridden during this batch operation.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId cancelProcessInstancesBatchOperation
 * @tags Process instance
 */
export function cancelProcessInstancesBatchOperation(body: _cancelProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>>;
export function cancelProcessInstancesBatchOperation(options: _cancelProcessInstancesBatchOperation_Options): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>>;
export function cancelProcessInstancesBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _cancelProcessInstancesBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _cancelProcessInstancesBatchOperation({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _cancelProcessInstancesBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _correlateMessage_Options = Parameters<typeof _correlateMessage>[0];
type _correlateMessage_MaybeBody = _correlateMessage_Options extends { body?: infer B } ? B : never;
type _correlateMessage_Body = [ _correlateMessage_MaybeBody ] extends [never] ? unknown : _correlateMessage_MaybeBody;
/**
 * Correlate message
 * Publishes a message and correlates it to a subscription.
 * If correlation is successful it will return the first process instance key the message correlated with.
 * The message is not buffered.
 * Use the publish message endpoint to send messages that can be buffered.
 *
  *
 * @operationId correlateMessage
 * @tags Message
 */
export function correlateMessage(body: _correlateMessage_Body): CancelablePromise<_DataOf<typeof _correlateMessage>>;
export function correlateMessage(options: _correlateMessage_Options): CancelablePromise<_DataOf<typeof _correlateMessage>>;
export function correlateMessage(arg: any): CancelablePromise<_DataOf<typeof _correlateMessage>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _correlateMessage({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _correlateMessage({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createAdminUser_Options = Parameters<typeof _createAdminUser>[0];
type _createAdminUser_MaybeBody = _createAdminUser_Options extends { body?: infer B } ? B : never;
type _createAdminUser_Body = [ _createAdminUser_MaybeBody ] extends [never] ? unknown : _createAdminUser_MaybeBody;
/**
 * Create admin user
 * Creates a new user and assign the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
  *
 * @operationId createAdminUser
 * @tags Setup
 */
export function createAdminUser(body: _createAdminUser_Body): CancelablePromise<_DataOf<typeof _createAdminUser>>;
export function createAdminUser(options: _createAdminUser_Options): CancelablePromise<_DataOf<typeof _createAdminUser>>;
export function createAdminUser(arg: any): CancelablePromise<_DataOf<typeof _createAdminUser>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createAdminUser({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createAdminUser({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createAuthorization_Options = Parameters<typeof _createAuthorization>[0];
type _createAuthorization_MaybeBody = _createAuthorization_Options extends { body?: infer B } ? B : never;
type _createAuthorization_Body = [ _createAuthorization_MaybeBody ] extends [never] ? unknown : _createAuthorization_MaybeBody;
/**
 * Create authorization
 * Create the authorization.
  *
 * @operationId createAuthorization
 * @tags Authorization
 */
export function createAuthorization(body: _createAuthorization_Body): CancelablePromise<_DataOf<typeof _createAuthorization>>;
export function createAuthorization(options: _createAuthorization_Options): CancelablePromise<_DataOf<typeof _createAuthorization>>;
export function createAuthorization(arg: any): CancelablePromise<_DataOf<typeof _createAuthorization>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createAuthorization({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createAuthorization({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createDeployment_Options = Parameters<typeof _createDeployment>[0];
type _createDeployment_MaybeBody = _createDeployment_Options extends { body?: infer B } ? B : never;
type _createDeployment_Body = [ _createDeployment_MaybeBody ] extends [never] ? unknown : _createDeployment_MaybeBody;
/**
 * Deploy resources
 * Deploys one or more resources (e.g. processes, decision models, or forms).
 * This is an atomic call, i.e. either all resources are deployed or none of them are.
 *
  *
 * @operationId createDeployment
 * @tags Resource
 */
export function createDeployment(body: _createDeployment_Body): CancelablePromise<_DataOf<typeof _createDeployment>>;
export function createDeployment(options: _createDeployment_Options): CancelablePromise<_DataOf<typeof _createDeployment>>;
export function createDeployment(arg: any): CancelablePromise<_DataOf<typeof _createDeployment>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createDeployment({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createDeployment({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createGroup_Options = Parameters<typeof _createGroup>[0];
type _createGroup_MaybeBody = _createGroup_Options extends { body?: infer B } ? B : never;
type _createGroup_Body = [ _createGroup_MaybeBody ] extends [never] ? unknown : _createGroup_MaybeBody;
/**
 * Create group
 * Create a new group.
 *
  *
 * @operationId createGroup
 * @tags Group
 */
export function createGroup(body: _createGroup_Body): CancelablePromise<_DataOf<typeof _createGroup>>;
export function createGroup(options: _createGroup_Options): CancelablePromise<_DataOf<typeof _createGroup>>;
export function createGroup(arg: any): CancelablePromise<_DataOf<typeof _createGroup>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createGroup({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createGroup({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createMappingRule_Options = Parameters<typeof _createMappingRule>[0];
type _createMappingRule_MaybeBody = _createMappingRule_Options extends { body?: infer B } ? B : never;
type _createMappingRule_Body = [ _createMappingRule_MaybeBody ] extends [never] ? unknown : _createMappingRule_MaybeBody;
/**
 * Create mapping rule
 * Create a new mapping rule
 *
  *
 * @operationId createMappingRule
 * @tags Mapping rule
 */
export function createMappingRule(body: _createMappingRule_Body): CancelablePromise<_DataOf<typeof _createMappingRule>>;
export function createMappingRule(options: _createMappingRule_Options): CancelablePromise<_DataOf<typeof _createMappingRule>>;
export function createMappingRule(arg: any): CancelablePromise<_DataOf<typeof _createMappingRule>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createMappingRule({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createMappingRule({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createProcessInstance_Options = Parameters<typeof _createProcessInstance>[0];
type _createProcessInstance_MaybeBody = _createProcessInstance_Options extends { body?: infer B } ? B : never;
type _createProcessInstance_Body = [ _createProcessInstance_MaybeBody ] extends [never] ? unknown : _createProcessInstance_MaybeBody;
/**
 * Create process instance
 * Creates and starts an instance of the specified process.
 * The process definition to use to create the instance can be specified either using its unique key
 * (as returned by Deploy resources), or using the BPMN process ID and a version.
 *
 * Waits for the completion of the process instance before returning a result
 * when awaitCompletion is enabled.
 *
  *
 * @operationId createProcessInstance
 * @tags Process instance
 */
export function createProcessInstance(body: _createProcessInstance_Body): CancelablePromise<_DataOf<typeof _createProcessInstance>>;
export function createProcessInstance(options: _createProcessInstance_Options): CancelablePromise<_DataOf<typeof _createProcessInstance>>;
export function createProcessInstance(arg: any): CancelablePromise<_DataOf<typeof _createProcessInstance>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createProcessInstance({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createProcessInstance({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createRole_Options = Parameters<typeof _createRole>[0];
type _createRole_MaybeBody = _createRole_Options extends { body?: infer B } ? B : never;
type _createRole_Body = [ _createRole_MaybeBody ] extends [never] ? unknown : _createRole_MaybeBody;
/**
 * Create role
 * Create a new role.
 *
  *
 * @operationId createRole
 * @tags Role
 */
export function createRole(body: _createRole_Body): CancelablePromise<_DataOf<typeof _createRole>>;
export function createRole(options: _createRole_Options): CancelablePromise<_DataOf<typeof _createRole>>;
export function createRole(arg: any): CancelablePromise<_DataOf<typeof _createRole>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createRole({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createRole({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createTenant_Options = Parameters<typeof _createTenant>[0];
type _createTenant_MaybeBody = _createTenant_Options extends { body?: infer B } ? B : never;
type _createTenant_Body = [ _createTenant_MaybeBody ] extends [never] ? unknown : _createTenant_MaybeBody;
/**
 * Create tenant
 * Creates a new tenant.
  *
 * @operationId createTenant
 * @tags Tenant
 */
export function createTenant(body: _createTenant_Body): CancelablePromise<_DataOf<typeof _createTenant>>;
export function createTenant(options: _createTenant_Options): CancelablePromise<_DataOf<typeof _createTenant>>;
export function createTenant(arg: any): CancelablePromise<_DataOf<typeof _createTenant>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createTenant({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createTenant({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _createUser_Options = Parameters<typeof _createUser>[0];
type _createUser_MaybeBody = _createUser_Options extends { body?: infer B } ? B : never;
type _createUser_Body = [ _createUser_MaybeBody ] extends [never] ? unknown : _createUser_MaybeBody;
/**
 * Create user
 * Create a new user.
  *
 * @operationId createUser
 * @tags User
 */
export function createUser(body: _createUser_Body): CancelablePromise<_DataOf<typeof _createUser>>;
export function createUser(options: _createUser_Options): CancelablePromise<_DataOf<typeof _createUser>>;
export function createUser(arg: any): CancelablePromise<_DataOf<typeof _createUser>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _createUser({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _createUser({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _evaluateDecision_Options = Parameters<typeof _evaluateDecision>[0];
type _evaluateDecision_MaybeBody = _evaluateDecision_Options extends { body?: infer B } ? B : never;
type _evaluateDecision_Body = [ _evaluateDecision_MaybeBody ] extends [never] ? unknown : _evaluateDecision_MaybeBody;
/**
 * Evaluate decision
 * Evaluates a decision.
 * You specify the decision to evaluate either by using its unique key (as returned by
 * DeployResource), or using the decision ID. When using the decision ID, the latest deployed
 * version of the decision is used.
 *
  *
 * @operationId evaluateDecision
 * @tags Decision definition
 */
export function evaluateDecision(body: _evaluateDecision_Body): CancelablePromise<_DataOf<typeof _evaluateDecision>>;
export function evaluateDecision(options: _evaluateDecision_Options): CancelablePromise<_DataOf<typeof _evaluateDecision>>;
export function evaluateDecision(arg: any): CancelablePromise<_DataOf<typeof _evaluateDecision>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _evaluateDecision({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _evaluateDecision({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _migrateProcessInstancesBatchOperation_Options = Parameters<typeof _migrateProcessInstancesBatchOperation>[0];
type _migrateProcessInstancesBatchOperation_MaybeBody = _migrateProcessInstancesBatchOperation_Options extends { body?: infer B } ? B : never;
type _migrateProcessInstancesBatchOperation_Body = [ _migrateProcessInstancesBatchOperation_MaybeBody ] extends [never] ? unknown : _migrateProcessInstancesBatchOperation_MaybeBody;
/**
 * Create a batch operation to migrate process instances
 * Migrate multiple instances of process instances.
 * Since only process instances with ACTIVE state can be migrated, any given
 * filters for state are ignored and overridden during this batch operation.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId migrateProcessInstancesBatchOperation
 * @tags Process instance
 */
export function migrateProcessInstancesBatchOperation(body: _migrateProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>>;
export function migrateProcessInstancesBatchOperation(options: _migrateProcessInstancesBatchOperation_Options): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>>;
export function migrateProcessInstancesBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _migrateProcessInstancesBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _migrateProcessInstancesBatchOperation({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _migrateProcessInstancesBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _modifyProcessInstancesBatchOperation_Options = Parameters<typeof _modifyProcessInstancesBatchOperation>[0];
type _modifyProcessInstancesBatchOperation_MaybeBody = _modifyProcessInstancesBatchOperation_Options extends { body?: infer B } ? B : never;
type _modifyProcessInstancesBatchOperation_Body = [ _modifyProcessInstancesBatchOperation_MaybeBody ] extends [never] ? unknown : _modifyProcessInstancesBatchOperation_MaybeBody;
/**
 * Create a batch operation to modify process instances
 * Modify multiple process instances.
 * Since only process instances with ACTIVE state can be modified, any given
 * filters for state are ignored and overridden during this batch operation.
 * In contrast to single modification operation, it is not possible to add variable instructions or modify by element key.
 * It is only possible to use the element id of the source and target.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId modifyProcessInstancesBatchOperation
 * @tags Process instance
 */
export function modifyProcessInstancesBatchOperation(body: _modifyProcessInstancesBatchOperation_Body): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>>;
export function modifyProcessInstancesBatchOperation(options: _modifyProcessInstancesBatchOperation_Options): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>>;
export function modifyProcessInstancesBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _modifyProcessInstancesBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _modifyProcessInstancesBatchOperation({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _modifyProcessInstancesBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _pinClock_Options = Parameters<typeof _pinClock>[0];
type _pinClock_MaybeBody = _pinClock_Options extends { body?: infer B } ? B : never;
type _pinClock_Body = [ _pinClock_MaybeBody ] extends [never] ? unknown : _pinClock_MaybeBody;
/**
 * Pin internal clock (alpha)
 * Set a precise, static time for the Zeebe engine’s internal clock.
 * When the clock is pinned, it remains at the specified time and does not advance.
 * To change the time, the clock must be pinned again with a new timestamp.
 *
 * This endpoint is an alpha feature and may be subject to change
 * in future releases.
 *
  *
 * @operationId pinClock
 * @tags Clock
 */
export function pinClock(body: _pinClock_Body): CancelablePromise<_DataOf<typeof _pinClock>>;
export function pinClock(options: _pinClock_Options): CancelablePromise<_DataOf<typeof _pinClock>>;
export function pinClock(arg: any): CancelablePromise<_DataOf<typeof _pinClock>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _pinClock({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _pinClock({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _publishMessage_Options = Parameters<typeof _publishMessage>[0];
type _publishMessage_MaybeBody = _publishMessage_Options extends { body?: infer B } ? B : never;
type _publishMessage_Body = [ _publishMessage_MaybeBody ] extends [never] ? unknown : _publishMessage_MaybeBody;
/**
 * Publish message
 * Publishes a single message.
 * Messages are published to specific partitions computed from their correlation keys.
 * Messages can be buffered.
 * The endpoint does not wait for a correlation result.
 * Use the message correlation endpoint for such use cases.
 *
  *
 * @operationId publishMessage
 * @tags Message
 */
export function publishMessage(body: _publishMessage_Body): CancelablePromise<_DataOf<typeof _publishMessage>>;
export function publishMessage(options: _publishMessage_Options): CancelablePromise<_DataOf<typeof _publishMessage>>;
export function publishMessage(arg: any): CancelablePromise<_DataOf<typeof _publishMessage>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _publishMessage({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _publishMessage({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _resolveIncidentsBatchOperation_Options = Parameters<typeof _resolveIncidentsBatchOperation>[0];
type _resolveIncidentsBatchOperation_MaybeBody = _resolveIncidentsBatchOperation_Options extends { body?: infer B } ? B : never;
type _resolveIncidentsBatchOperation_Body = [ _resolveIncidentsBatchOperation_MaybeBody ] extends [never] ? unknown : _resolveIncidentsBatchOperation_MaybeBody;
/**
 * Create a batch operation to resolve incidents of process instances
 * Resolves multiple instances of process instances.
 * Since only process instances with ACTIVE state can have unresolved incidents, any given
 * filters for state are ignored and overridden during this batch operation.
 * This is done asynchronously, the progress can be tracked using the batchOperationKey from the response and the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId resolveIncidentsBatchOperation
 * @tags Process instance
 */
export function resolveIncidentsBatchOperation(body: _resolveIncidentsBatchOperation_Body): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>>;
export function resolveIncidentsBatchOperation(options: _resolveIncidentsBatchOperation_Options): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>>;
export function resolveIncidentsBatchOperation(arg: any): CancelablePromise<_DataOf<typeof _resolveIncidentsBatchOperation>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _resolveIncidentsBatchOperation({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _resolveIncidentsBatchOperation({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchAuthorizations_Options = Parameters<typeof _searchAuthorizations>[0];
type _searchAuthorizations_MaybeBody = _searchAuthorizations_Options extends { body?: infer B } ? B : never;
type _searchAuthorizations_Body = [ _searchAuthorizations_MaybeBody ] extends [never] ? unknown : _searchAuthorizations_MaybeBody;
/**
 * Search authorizations
 * Search for authorizations based on given criteria.
 *
  *
 * @operationId searchAuthorizations
 * @tags Authorization
 */
export function searchAuthorizations(body: _searchAuthorizations_Body): CancelablePromise<_DataOf<typeof _searchAuthorizations>>;
export function searchAuthorizations(options: _searchAuthorizations_Options): CancelablePromise<_DataOf<typeof _searchAuthorizations>>;
export function searchAuthorizations(arg: any): CancelablePromise<_DataOf<typeof _searchAuthorizations>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchAuthorizations({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchAuthorizations({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchBatchOperationItems_Options = Parameters<typeof _searchBatchOperationItems>[0];
type _searchBatchOperationItems_MaybeBody = _searchBatchOperationItems_Options extends { body?: infer B } ? B : never;
type _searchBatchOperationItems_Body = [ _searchBatchOperationItems_MaybeBody ] extends [never] ? unknown : _searchBatchOperationItems_MaybeBody;
/**
 * Search batch operation items
 * Search for batch operation items based on given criteria.
  *
 * @operationId searchBatchOperationItems
 * @tags Batch operation
 */
export function searchBatchOperationItems(body: _searchBatchOperationItems_Body): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>>;
export function searchBatchOperationItems(options: _searchBatchOperationItems_Options): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>>;
export function searchBatchOperationItems(arg: any): CancelablePromise<_DataOf<typeof _searchBatchOperationItems>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchBatchOperationItems({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchBatchOperationItems({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchBatchOperations_Options = Parameters<typeof _searchBatchOperations>[0];
type _searchBatchOperations_MaybeBody = _searchBatchOperations_Options extends { body?: infer B } ? B : never;
type _searchBatchOperations_Body = [ _searchBatchOperations_MaybeBody ] extends [never] ? unknown : _searchBatchOperations_MaybeBody;
/**
 * Search batch operations
 * Search for batch operations based on given criteria.
  *
 * @operationId searchBatchOperations
 * @tags Batch operation
 */
export function searchBatchOperations(body: _searchBatchOperations_Body): CancelablePromise<_DataOf<typeof _searchBatchOperations>>;
export function searchBatchOperations(options: _searchBatchOperations_Options): CancelablePromise<_DataOf<typeof _searchBatchOperations>>;
export function searchBatchOperations(arg: any): CancelablePromise<_DataOf<typeof _searchBatchOperations>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchBatchOperations({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchBatchOperations({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchDecisionDefinitions_Options = Parameters<typeof _searchDecisionDefinitions>[0];
type _searchDecisionDefinitions_MaybeBody = _searchDecisionDefinitions_Options extends { body?: infer B } ? B : never;
type _searchDecisionDefinitions_Body = [ _searchDecisionDefinitions_MaybeBody ] extends [never] ? unknown : _searchDecisionDefinitions_MaybeBody;
/**
 * Search decision definitions
 * Search for decision definitions based on given criteria.
 *
  *
 * @operationId searchDecisionDefinitions
 * @tags Decision definition
 */
export function searchDecisionDefinitions(body: _searchDecisionDefinitions_Body): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>>;
export function searchDecisionDefinitions(options: _searchDecisionDefinitions_Options): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>>;
export function searchDecisionDefinitions(arg: any): CancelablePromise<_DataOf<typeof _searchDecisionDefinitions>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchDecisionDefinitions({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchDecisionDefinitions({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchDecisionInstances_Options = Parameters<typeof _searchDecisionInstances>[0];
type _searchDecisionInstances_MaybeBody = _searchDecisionInstances_Options extends { body?: infer B } ? B : never;
type _searchDecisionInstances_Body = [ _searchDecisionInstances_MaybeBody ] extends [never] ? unknown : _searchDecisionInstances_MaybeBody;
/**
 * Search decision instances
 * Search for decision instances based on given criteria.
 *
  *
 * @operationId searchDecisionInstances
 * @tags Decision instance
 */
export function searchDecisionInstances(body: _searchDecisionInstances_Body): CancelablePromise<_DataOf<typeof _searchDecisionInstances>>;
export function searchDecisionInstances(options: _searchDecisionInstances_Options): CancelablePromise<_DataOf<typeof _searchDecisionInstances>>;
export function searchDecisionInstances(arg: any): CancelablePromise<_DataOf<typeof _searchDecisionInstances>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchDecisionInstances({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchDecisionInstances({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchDecisionRequirements_Options = Parameters<typeof _searchDecisionRequirements>[0];
type _searchDecisionRequirements_MaybeBody = _searchDecisionRequirements_Options extends { body?: infer B } ? B : never;
type _searchDecisionRequirements_Body = [ _searchDecisionRequirements_MaybeBody ] extends [never] ? unknown : _searchDecisionRequirements_MaybeBody;
/**
 * Search decision requirements
 * Search for decision requirements based on given criteria.
 *
  *
 * @operationId searchDecisionRequirements
 * @tags Decision requirements
 */
export function searchDecisionRequirements(body: _searchDecisionRequirements_Body): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>>;
export function searchDecisionRequirements(options: _searchDecisionRequirements_Options): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>>;
export function searchDecisionRequirements(arg: any): CancelablePromise<_DataOf<typeof _searchDecisionRequirements>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchDecisionRequirements({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchDecisionRequirements({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchElementInstances_Options = Parameters<typeof _searchElementInstances>[0];
type _searchElementInstances_MaybeBody = _searchElementInstances_Options extends { body?: infer B } ? B : never;
type _searchElementInstances_Body = [ _searchElementInstances_MaybeBody ] extends [never] ? unknown : _searchElementInstances_MaybeBody;
/**
 * Search element instances
 * Search for element instances based on given criteria.
 *
  *
 * @operationId searchElementInstances
 * @tags Element instance
 */
export function searchElementInstances(body: _searchElementInstances_Body): CancelablePromise<_DataOf<typeof _searchElementInstances>>;
export function searchElementInstances(options: _searchElementInstances_Options): CancelablePromise<_DataOf<typeof _searchElementInstances>>;
export function searchElementInstances(arg: any): CancelablePromise<_DataOf<typeof _searchElementInstances>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchElementInstances({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchElementInstances({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchGroups_Options = Parameters<typeof _searchGroups>[0];
type _searchGroups_MaybeBody = _searchGroups_Options extends { body?: infer B } ? B : never;
type _searchGroups_Body = [ _searchGroups_MaybeBody ] extends [never] ? unknown : _searchGroups_MaybeBody;
/**
 * Search groups
 * Search for groups based on given criteria.
 *
  *
 * @operationId searchGroups
 * @tags Group
 */
export function searchGroups(body: _searchGroups_Body): CancelablePromise<_DataOf<typeof _searchGroups>>;
export function searchGroups(options: _searchGroups_Options): CancelablePromise<_DataOf<typeof _searchGroups>>;
export function searchGroups(arg: any): CancelablePromise<_DataOf<typeof _searchGroups>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchGroups({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchGroups({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchIncidents_Options = Parameters<typeof _searchIncidents>[0];
type _searchIncidents_MaybeBody = _searchIncidents_Options extends { body?: infer B } ? B : never;
type _searchIncidents_Body = [ _searchIncidents_MaybeBody ] extends [never] ? unknown : _searchIncidents_MaybeBody;
/**
 * Search incidents
 * Search for incidents based on given criteria.
 *
  *
 * @operationId searchIncidents
 * @tags Incident
 */
export function searchIncidents(body: _searchIncidents_Body): CancelablePromise<_DataOf<typeof _searchIncidents>>;
export function searchIncidents(options: _searchIncidents_Options): CancelablePromise<_DataOf<typeof _searchIncidents>>;
export function searchIncidents(arg: any): CancelablePromise<_DataOf<typeof _searchIncidents>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchIncidents({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchIncidents({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchJobs_Options = Parameters<typeof _searchJobs>[0];
type _searchJobs_MaybeBody = _searchJobs_Options extends { body?: infer B } ? B : never;
type _searchJobs_Body = [ _searchJobs_MaybeBody ] extends [never] ? unknown : _searchJobs_MaybeBody;
/**
 * Search jobs
 * Search for jobs based on given criteria.
  *
 * @operationId searchJobs
 * @tags Job
 */
export function searchJobs(body: _searchJobs_Body): CancelablePromise<_DataOf<typeof _searchJobs>>;
export function searchJobs(options: _searchJobs_Options): CancelablePromise<_DataOf<typeof _searchJobs>>;
export function searchJobs(arg: any): CancelablePromise<_DataOf<typeof _searchJobs>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchJobs({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchJobs({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchMappingRule_Options = Parameters<typeof _searchMappingRule>[0];
type _searchMappingRule_MaybeBody = _searchMappingRule_Options extends { body?: infer B } ? B : never;
type _searchMappingRule_Body = [ _searchMappingRule_MaybeBody ] extends [never] ? unknown : _searchMappingRule_MaybeBody;
/**
 * Search mapping rules
 * Search for mapping rules based on given criteria.
 *
  *
 * @operationId searchMappingRule
 * @tags Mapping rule
 */
export function searchMappingRule(body: _searchMappingRule_Body): CancelablePromise<_DataOf<typeof _searchMappingRule>>;
export function searchMappingRule(options: _searchMappingRule_Options): CancelablePromise<_DataOf<typeof _searchMappingRule>>;
export function searchMappingRule(arg: any): CancelablePromise<_DataOf<typeof _searchMappingRule>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchMappingRule({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchMappingRule({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchMessageSubscriptions_Options = Parameters<typeof _searchMessageSubscriptions>[0];
type _searchMessageSubscriptions_MaybeBody = _searchMessageSubscriptions_Options extends { body?: infer B } ? B : never;
type _searchMessageSubscriptions_Body = [ _searchMessageSubscriptions_MaybeBody ] extends [never] ? unknown : _searchMessageSubscriptions_MaybeBody;
/**
 * Search message subscriptions
 * Search for message subscriptions based on given criteria.
 *
  *
 * @operationId searchMessageSubscriptions
 * @tags Message subscription
 */
export function searchMessageSubscriptions(body: _searchMessageSubscriptions_Body): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>>;
export function searchMessageSubscriptions(options: _searchMessageSubscriptions_Options): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>>;
export function searchMessageSubscriptions(arg: any): CancelablePromise<_DataOf<typeof _searchMessageSubscriptions>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchMessageSubscriptions({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchMessageSubscriptions({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchProcessDefinitions_Options = Parameters<typeof _searchProcessDefinitions>[0];
type _searchProcessDefinitions_MaybeBody = _searchProcessDefinitions_Options extends { body?: infer B } ? B : never;
type _searchProcessDefinitions_Body = [ _searchProcessDefinitions_MaybeBody ] extends [never] ? unknown : _searchProcessDefinitions_MaybeBody;
/**
 * Search process definitions
 * Search for process definitions based on given criteria.
 *
  *
 * @operationId searchProcessDefinitions
 * @tags Process definition
 */
export function searchProcessDefinitions(body: _searchProcessDefinitions_Body): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>>;
export function searchProcessDefinitions(options: _searchProcessDefinitions_Options): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>>;
export function searchProcessDefinitions(arg: any): CancelablePromise<_DataOf<typeof _searchProcessDefinitions>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchProcessDefinitions({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchProcessDefinitions({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchProcessInstances_Options = Parameters<typeof _searchProcessInstances>[0];
type _searchProcessInstances_MaybeBody = _searchProcessInstances_Options extends { body?: infer B } ? B : never;
type _searchProcessInstances_Body = [ _searchProcessInstances_MaybeBody ] extends [never] ? unknown : _searchProcessInstances_MaybeBody;
/**
 * Search process instances
 * Search for process instances based on given criteria.
 *
  *
 * @operationId searchProcessInstances
 * @tags Process instance
 */
export function searchProcessInstances(body: _searchProcessInstances_Body): CancelablePromise<_DataOf<typeof _searchProcessInstances>>;
export function searchProcessInstances(options: _searchProcessInstances_Options): CancelablePromise<_DataOf<typeof _searchProcessInstances>>;
export function searchProcessInstances(arg: any): CancelablePromise<_DataOf<typeof _searchProcessInstances>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchProcessInstances({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchProcessInstances({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchRoles_Options = Parameters<typeof _searchRoles>[0];
type _searchRoles_MaybeBody = _searchRoles_Options extends { body?: infer B } ? B : never;
type _searchRoles_Body = [ _searchRoles_MaybeBody ] extends [never] ? unknown : _searchRoles_MaybeBody;
/**
 * Search roles
 * Search for roles based on given criteria.
 *
  *
 * @operationId searchRoles
 * @tags Role
 */
export function searchRoles(body: _searchRoles_Body): CancelablePromise<_DataOf<typeof _searchRoles>>;
export function searchRoles(options: _searchRoles_Options): CancelablePromise<_DataOf<typeof _searchRoles>>;
export function searchRoles(arg: any): CancelablePromise<_DataOf<typeof _searchRoles>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchRoles({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchRoles({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchTenants_Options = Parameters<typeof _searchTenants>[0];
type _searchTenants_MaybeBody = _searchTenants_Options extends { body?: infer B } ? B : never;
type _searchTenants_Body = [ _searchTenants_MaybeBody ] extends [never] ? unknown : _searchTenants_MaybeBody;
/**
 * Search tenants
 * Retrieves a filtered and sorted list of tenants.
  *
 * @operationId searchTenants
 * @tags Tenant
 */
export function searchTenants(body: _searchTenants_Body): CancelablePromise<_DataOf<typeof _searchTenants>>;
export function searchTenants(options: _searchTenants_Options): CancelablePromise<_DataOf<typeof _searchTenants>>;
export function searchTenants(arg: any): CancelablePromise<_DataOf<typeof _searchTenants>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchTenants({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchTenants({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchUsers_Options = Parameters<typeof _searchUsers>[0];
type _searchUsers_MaybeBody = _searchUsers_Options extends { body?: infer B } ? B : never;
type _searchUsers_Body = [ _searchUsers_MaybeBody ] extends [never] ? unknown : _searchUsers_MaybeBody;
/**
 * Search users
 * Search for users based on given criteria.
 *
  *
 * @operationId searchUsers
 * @tags User
 */
export function searchUsers(body: _searchUsers_Body): CancelablePromise<_DataOf<typeof _searchUsers>>;
export function searchUsers(options: _searchUsers_Options): CancelablePromise<_DataOf<typeof _searchUsers>>;
export function searchUsers(arg: any): CancelablePromise<_DataOf<typeof _searchUsers>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchUsers({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchUsers({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchUserTasks_Options = Parameters<typeof _searchUserTasks>[0];
type _searchUserTasks_MaybeBody = _searchUserTasks_Options extends { body?: infer B } ? B : never;
type _searchUserTasks_Body = [ _searchUserTasks_MaybeBody ] extends [never] ? unknown : _searchUserTasks_MaybeBody;
/**
 * Search user tasks
 * Search for user tasks based on given criteria.
 *
  *
 * @operationId searchUserTasks
 * @tags User task
 */
export function searchUserTasks(body: _searchUserTasks_Body): CancelablePromise<_DataOf<typeof _searchUserTasks>>;
export function searchUserTasks(options: _searchUserTasks_Options): CancelablePromise<_DataOf<typeof _searchUserTasks>>;
export function searchUserTasks(arg: any): CancelablePromise<_DataOf<typeof _searchUserTasks>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchUserTasks({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchUserTasks({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

type _searchVariables_Options = Parameters<typeof _searchVariables>[0];
type _searchVariables_MaybeBody = _searchVariables_Options extends { body?: infer B } ? B : never;
type _searchVariables_Body = [ _searchVariables_MaybeBody ] extends [never] ? unknown : _searchVariables_MaybeBody;
/**
 * Search variables
 * Search for process and local variables based on given criteria.
 *
  *
 * @operationId searchVariables
 * @tags Variable
 */
export function searchVariables(body: _searchVariables_Body): CancelablePromise<_DataOf<typeof _searchVariables>>;
export function searchVariables(options: _searchVariables_Options): CancelablePromise<_DataOf<typeof _searchVariables>>;
export function searchVariables(arg: any): CancelablePromise<_DataOf<typeof _searchVariables>> {
  return toCancelable(signal => {
    if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
      return _searchVariables({ ...arg, signal } as any).then((r:any)=> r?.data ?? r);
    }
    return _searchVariables({ body: arg, signal } as any).then((r:any)=> r?.data ?? r);
  });
}

/**
 * Activate activities within an ad-hoc sub-process
 * Activates selected activities within an ad-hoc sub-process identified by element ID.
 * The provided element IDs must exist within the ad-hoc sub-process instance identified by the
 * provided adHocSubProcessInstanceKey.
 *
  *
 * @operationId activateAdHocSubProcessActivities
 * @tags Ad-hoc sub-process
 */
export function activateAdHocSubProcessActivities(options?: Parameters<typeof _activateAdHocSubProcessActivities>[0]): CancelablePromise<_DataOf<typeof _activateAdHocSubProcessActivities>> {
  return toCancelable(signal => _activateAdHocSubProcessActivities({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a client to a group
 * Assigns a client to a group, making it a member of the group. Members of the group inherit the group authorizations, roles, and tenant assignments.
  *
 * @operationId assignClientToGroup
 * @tags Group
 */
export function assignClientToGroup(options?: Parameters<typeof _assignClientToGroup>[0]): CancelablePromise<_DataOf<typeof _assignClientToGroup>> {
  return toCancelable(signal => _assignClientToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a client to a tenant
 * Assign the client to the specified tenant. The client can then access tenant data and perform authorized actions.
  *
 * @operationId assignClientToTenant
 * @tags Tenant
 */
export function assignClientToTenant(options?: Parameters<typeof _assignClientToTenant>[0]): CancelablePromise<_DataOf<typeof _assignClientToTenant>> {
  return toCancelable(signal => _assignClientToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a group to a tenant
 * Assigns a group to a specified tenant. Group members (users, clients) can then access tenant data and perform authorized actions.
  *
 * @operationId assignGroupToTenant
 * @tags Tenant
 */
export function assignGroupToTenant(options?: Parameters<typeof _assignGroupToTenant>[0]): CancelablePromise<_DataOf<typeof _assignGroupToTenant>> {
  return toCancelable(signal => _assignGroupToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a mapping rule to a group
 * Assigns a mapping rule to a group.
 *
  *
 * @operationId assignMappingRuleToGroup
 * @tags Group
 */
export function assignMappingRuleToGroup(options?: Parameters<typeof _assignMappingRuleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToGroup>> {
  return toCancelable(signal => _assignMappingRuleToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a mapping rule to a tenant
 * Assign a single mapping rule to a specified tenant.
  *
 * @operationId assignMappingRuleToTenant
 * @tags Tenant
 */
export function assignMappingRuleToTenant(options?: Parameters<typeof _assignMappingRuleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignMappingRuleToTenant>> {
  return toCancelable(signal => _assignMappingRuleToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a client
 * Assigns the specified role to the client.
 * The client will inherit the authorizations associated with this role.
  *
 * @operationId assignRoleToClient
 * @tags Role
 */
export function assignRoleToClient(options?: Parameters<typeof _assignRoleToClient>[0]): CancelablePromise<_DataOf<typeof _assignRoleToClient>> {
  return toCancelable(signal => _assignRoleToClient({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a group
 *  Assigns the specified role to the group.  Every member of the group (user or client) will inherit the authorizations associated with this role.
  *
 * @operationId assignRoleToGroup
 * @tags Role
 */
export function assignRoleToGroup(options?: Parameters<typeof _assignRoleToGroup>[0]): CancelablePromise<_DataOf<typeof _assignRoleToGroup>> {
  return toCancelable(signal => _assignRoleToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a mapping rule
 * Assigns a role to a mapping rule.
 *
  *
 * @operationId assignRoleToMappingRule
 * @tags Role
 */
export function assignRoleToMappingRule(options?: Parameters<typeof _assignRoleToMappingRule>[0]): CancelablePromise<_DataOf<typeof _assignRoleToMappingRule>> {
  return toCancelable(signal => _assignRoleToMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a tenant
 * Assigns a role to a specified tenant. Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
  *
 * @operationId assignRoleToTenant
 * @tags Tenant
 */
export function assignRoleToTenant(options?: Parameters<typeof _assignRoleToTenant>[0]): CancelablePromise<_DataOf<typeof _assignRoleToTenant>> {
  return toCancelable(signal => _assignRoleToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a role to a user
 * Assigns the specified role to the user. The user will inherit the authorizations associated with this role.
  *
 * @operationId assignRoleToUser
 * @tags Role
 */
export function assignRoleToUser(options?: Parameters<typeof _assignRoleToUser>[0]): CancelablePromise<_DataOf<typeof _assignRoleToUser>> {
  return toCancelable(signal => _assignRoleToUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign user task
 * Assigns a user task with the given key to the given assignee.
  *
 * @operationId assignUserTask
 * @tags User task
 */
export function assignUserTask(options?: Parameters<typeof _assignUserTask>[0]): CancelablePromise<_DataOf<typeof _assignUserTask>> {
  return toCancelable(signal => _assignUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a user to a group
 * Assigns a user to a group, making the user a member of the group. Group members inherit the group authorizations, roles, and tenant assignments.
  *
 * @operationId assignUserToGroup
 * @tags Group
 */
export function assignUserToGroup(options?: Parameters<typeof _assignUserToGroup>[0]): CancelablePromise<_DataOf<typeof _assignUserToGroup>> {
  return toCancelable(signal => _assignUserToGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Assign a user to a tenant
 * Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
  *
 * @operationId assignUserToTenant
 * @tags Tenant
 */
export function assignUserToTenant(options?: Parameters<typeof _assignUserToTenant>[0]): CancelablePromise<_DataOf<typeof _assignUserToTenant>> {
  return toCancelable(signal => _assignUserToTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Cancel Batch operation
 * Cancels a running batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId cancelBatchOperation
 * @tags Batch operation
 */
export function cancelBatchOperation(options?: Parameters<typeof _cancelBatchOperation>[0]): CancelablePromise<_DataOf<typeof _cancelBatchOperation>> {
  return toCancelable(signal => _cancelBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Cancel process instance
 * Cancels a running process instance. As a cancelation includes more than just the removal of the process instance resource, the cancelation resource must be posted.
  *
 * @operationId cancelProcessInstance
 * @tags Process instance
 */
export function cancelProcessInstance(options?: Parameters<typeof _cancelProcessInstance>[0]): CancelablePromise<_DataOf<typeof _cancelProcessInstance>> {
  return toCancelable(signal => _cancelProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Complete job
 * Complete a job with the given payload, which allows completing the associated service task.
 *
  *
 * @operationId completeJob
 * @tags Job
 */
export function completeJob(options?: Parameters<typeof _completeJob>[0]): CancelablePromise<_DataOf<typeof _completeJob>> {
  return toCancelable(signal => _completeJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Complete user task
 * Completes a user task with the given key.
  *
 * @operationId completeUserTask
 * @tags User task
 */
export function completeUserTask(options?: Parameters<typeof _completeUserTask>[0]): CancelablePromise<_DataOf<typeof _completeUserTask>> {
  return toCancelable(signal => _completeUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Upload document
 * Upload a document to the Camunda 8 cluster.
 *
 * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
 *
  *
 * @operationId createDocument
 * @tags Document
 */
export function createDocument(options?: Parameters<typeof _createDocument>[0]): CancelablePromise<_DataOf<typeof _createDocument>> {
  return toCancelable(signal => _createDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Create document link
 * Create a link to a document in the Camunda 8 cluster.
 *
 * Note that this is currently supported for document stores of type: AWS, GCP
 *
  *
 * @operationId createDocumentLink
 * @tags Document
 */
export function createDocumentLink(options?: Parameters<typeof _createDocumentLink>[0]): CancelablePromise<_DataOf<typeof _createDocumentLink>> {
  return toCancelable(signal => _createDocumentLink({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
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
  *
 * @operationId createDocuments
 * @tags Document
 */
export function createDocuments(options?: Parameters<typeof _createDocuments>[0]): CancelablePromise<_DataOf<typeof _createDocuments>> {
  return toCancelable(signal => _createDocuments({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update element instance variables
 * Updates all the variables of a particular scope (for example, process instance, element instance) with the given variable data.
 * Specify the element instance in the `elementInstanceKey` parameter.
 *
  *
 * @operationId createElementInstanceVariables
 * @tags Element instance
 */
export function createElementInstanceVariables(options?: Parameters<typeof _createElementInstanceVariables>[0]): CancelablePromise<_DataOf<typeof _createElementInstanceVariables>> {
  return toCancelable(signal => _createElementInstanceVariables({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete authorization
 * Deletes the authorization with the given key.
  *
 * @operationId deleteAuthorization
 * @tags Authorization
 */
export function deleteAuthorization(options?: Parameters<typeof _deleteAuthorization>[0]): CancelablePromise<_DataOf<typeof _deleteAuthorization>> {
  return toCancelable(signal => _deleteAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete document
 * Delete a document from the Camunda 8 cluster.
 *
 * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
 *
  *
 * @operationId deleteDocument
 * @tags Document
 */
export function deleteDocument(options?: Parameters<typeof _deleteDocument>[0]): CancelablePromise<_DataOf<typeof _deleteDocument>> {
  return toCancelable(signal => _deleteDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete group
 * Deletes the group with the given ID.
 *
  *
 * @operationId deleteGroup
 * @tags Group
 */
export function deleteGroup(options?: Parameters<typeof _deleteGroup>[0]): CancelablePromise<_DataOf<typeof _deleteGroup>> {
  return toCancelable(signal => _deleteGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete a mapping rule
 * Deletes the mapping rule with the given ID.
 *
  *
 * @operationId deleteMappingRule
 * @tags Mapping rule
 */
export function deleteMappingRule(options?: Parameters<typeof _deleteMappingRule>[0]): CancelablePromise<_DataOf<typeof _deleteMappingRule>> {
  return toCancelable(signal => _deleteMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete resource
 * Deletes a deployed resource.
 * This can be a process definition, decision requirements definition, or form definition
 * deployed using the deploy resources endpoint. Specify the resource you want to delete in the `resourceKey` parameter.
 *
  *
 * @operationId deleteResource
 * @tags Resource
 */
export function deleteResource(options?: Parameters<typeof _deleteResource>[0]): CancelablePromise<_DataOf<typeof _deleteResource>> {
  return toCancelable(signal => _deleteResource({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete role
 * Deletes the role with the given ID.
 *
  *
 * @operationId deleteRole
 * @tags Role
 */
export function deleteRole(options?: Parameters<typeof _deleteRole>[0]): CancelablePromise<_DataOf<typeof _deleteRole>> {
  return toCancelable(signal => _deleteRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete tenant
 * Deletes an existing tenant.
  *
 * @operationId deleteTenant
 * @tags Tenant
 */
export function deleteTenant(options?: Parameters<typeof _deleteTenant>[0]): CancelablePromise<_DataOf<typeof _deleteTenant>> {
  return toCancelable(signal => _deleteTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Delete user
 * Deletes a user.
 *
  *
 * @operationId deleteUser
 * @tags User
 */
export function deleteUser(options?: Parameters<typeof _deleteUser>[0]): CancelablePromise<_DataOf<typeof _deleteUser>> {
  return toCancelable(signal => _deleteUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Fail job
 * Mark the job as failed
 *
  *
 * @operationId failJob
 * @tags Job
 */
export function failJob(options?: Parameters<typeof _failJob>[0]): CancelablePromise<_DataOf<typeof _failJob>> {
  return toCancelable(signal => _failJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get current user
 * Retrieves the current authenticated user.
  *
 * @operationId getAuthentication
 * @tags Authentication
 */
export function getAuthentication(options?: Parameters<typeof _getAuthentication>[0]): CancelablePromise<_DataOf<typeof _getAuthentication>> {
  return toCancelable(signal => _getAuthentication({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get authorization
 * Get authorization by the given key.
  *
 * @operationId getAuthorization
 * @tags Authorization
 */
export function getAuthorization(options?: Parameters<typeof _getAuthorization>[0]): CancelablePromise<_DataOf<typeof _getAuthorization>> {
  return toCancelable(signal => _getAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get batch operation
 * Get batch operation by key.
  *
 * @operationId getBatchOperation
 * @tags Batch operation
 */
export function getBatchOperation(options?: Parameters<typeof _getBatchOperation>[0]): CancelablePromise<_DataOf<typeof _getBatchOperation>> {
  return toCancelable(signal => _getBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get decision definition
 * Returns a decision definition by key.
 *
  *
 * @operationId getDecisionDefinition
 * @tags Decision definition
 */
export function getDecisionDefinition(options?: Parameters<typeof _getDecisionDefinition>[0]): CancelablePromise<_DataOf<typeof _getDecisionDefinition>> {
  return toCancelable(signal => _getDecisionDefinition({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get decision definition XML
 * Returns decision definition as XML.
 *
  *
 * @operationId getDecisionDefinitionXML
 * @tags Decision definition
 */
export function getDecisionDefinitionXml(options?: Parameters<typeof _getDecisionDefinitionXml>[0]): CancelablePromise<_DataOf<typeof _getDecisionDefinitionXml>> {
  return toCancelable(signal => _getDecisionDefinitionXml({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}
/** @deprecated Use getDecisionDefinitionXml instead; legacy operationId retained for transitional compatibility. */
export const getDecisionDefinitionXML = getDecisionDefinitionXml;

/**
 * Get decision instance
 * Returns a decision instance.
 *
  *
 * @operationId getDecisionInstance
 * @tags Decision instance
 */
export function getDecisionInstance(options?: Parameters<typeof _getDecisionInstance>[0]): CancelablePromise<_DataOf<typeof _getDecisionInstance>> {
  return toCancelable(signal => _getDecisionInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get decision requirements
 * Returns Decision Requirements as JSON.
 *
  *
 * @operationId getDecisionRequirements
 * @tags Decision requirements
 */
export function getDecisionRequirements(options?: Parameters<typeof _getDecisionRequirements>[0]): CancelablePromise<_DataOf<typeof _getDecisionRequirements>> {
  return toCancelable(signal => _getDecisionRequirements({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get decision requirements XML
 * Returns decision requirements as XML.
 *
  *
 * @operationId getDecisionRequirementsXML
 * @tags Decision requirements
 */
export function getDecisionRequirementsXml(options?: Parameters<typeof _getDecisionRequirementsXml>[0]): CancelablePromise<_DataOf<typeof _getDecisionRequirementsXml>> {
  return toCancelable(signal => _getDecisionRequirementsXml({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}
/** @deprecated Use getDecisionRequirementsXml instead; legacy operationId retained for transitional compatibility. */
export const getDecisionRequirementsXML = getDecisionRequirementsXml;

/**
 * Download document
 * Download a document from the Camunda 8 cluster.
 *
 * Note that this is currently supported for document stores of type: AWS, GCP, in-memory (non-production), local (non-production)
 *
  *
 * @operationId getDocument
 * @tags Document
 */
export function getDocument(options?: Parameters<typeof _getDocument>[0]): CancelablePromise<_DataOf<typeof _getDocument>> {
  return toCancelable(signal => _getDocument({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get element instance
 * Returns element instance as JSON.
 *
  *
 * @operationId getElementInstance
 * @tags Element instance
 */
export function getElementInstance(options?: Parameters<typeof _getElementInstance>[0]): CancelablePromise<_DataOf<typeof _getElementInstance>> {
  return toCancelable(signal => _getElementInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get group
 * Get a group by its ID.
 *
  *
 * @operationId getGroup
 * @tags Group
 */
export function getGroup(options?: Parameters<typeof _getGroup>[0]): CancelablePromise<_DataOf<typeof _getGroup>> {
  return toCancelable(signal => _getGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get incident
 * Returns incident as JSON.
 *
  *
 * @operationId getIncident
 * @tags Incident
 */
export function getIncident(options?: Parameters<typeof _getIncident>[0]): CancelablePromise<_DataOf<typeof _getIncident>> {
  return toCancelable(signal => _getIncident({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get license status
 * Obtains the status of the current Camunda license.
  *
 * @operationId getLicense
 * @tags License
 */
export function getLicense(options?: Parameters<typeof _getLicense>[0]): CancelablePromise<_DataOf<typeof _getLicense>> {
  return toCancelable(signal => _getLicense({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get a mapping rule
 * Gets the mapping rule with the given ID.
 *
  *
 * @operationId getMappingRule
 * @tags Mapping rule
 */
export function getMappingRule(options?: Parameters<typeof _getMappingRule>[0]): CancelablePromise<_DataOf<typeof _getMappingRule>> {
  return toCancelable(signal => _getMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get process definition
 * Returns process definition as JSON.
 *
  *
 * @operationId getProcessDefinition
 * @tags Process definition
 */
export function getProcessDefinition(options?: Parameters<typeof _getProcessDefinition>[0]): CancelablePromise<_DataOf<typeof _getProcessDefinition>> {
  return toCancelable(signal => _getProcessDefinition({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get process definition statistics
 * Get statistics about elements in currently running process instances by process definition key and search filter.
 *
  *
 * @operationId getProcessDefinitionStatistics
 * @tags Process definition
 */
export function getProcessDefinitionStatistics(options?: Parameters<typeof _getProcessDefinitionStatistics>[0]): CancelablePromise<_DataOf<typeof _getProcessDefinitionStatistics>> {
  return toCancelable(signal => _getProcessDefinitionStatistics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get process definition XML
 * Returns process definition as XML.
 *
  *
 * @operationId getProcessDefinitionXML
 * @tags Process definition
 */
export function getProcessDefinitionXml(options?: Parameters<typeof _getProcessDefinitionXml>[0]): CancelablePromise<_DataOf<typeof _getProcessDefinitionXml>> {
  return toCancelable(signal => _getProcessDefinitionXml({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}
/** @deprecated Use getProcessDefinitionXml instead; legacy operationId retained for transitional compatibility. */
export const getProcessDefinitionXML = getProcessDefinitionXml;

/**
 * Get process instance
 * Get the process instance by the process instance key.
 *
  *
 * @operationId getProcessInstance
 * @tags Process instance
 */
export function getProcessInstance(options?: Parameters<typeof _getProcessInstance>[0]): CancelablePromise<_DataOf<typeof _getProcessInstance>> {
  return toCancelable(signal => _getProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get call hierarchy for process instance
 * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
 *
  *
 * @operationId getProcessInstanceCallHierarchy
 * @tags Process instance
 */
export function getProcessInstanceCallHierarchy(options?: Parameters<typeof _getProcessInstanceCallHierarchy>[0]): CancelablePromise<_DataOf<typeof _getProcessInstanceCallHierarchy>> {
  return toCancelable(signal => _getProcessInstanceCallHierarchy({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get process instance sequence flows
 * Get sequence flows taken by the process instance.
 *
  *
 * @operationId getProcessInstanceSequenceFlows
 * @tags Process instance
 */
export function getProcessInstanceSequenceFlows(options?: Parameters<typeof _getProcessInstanceSequenceFlows>[0]): CancelablePromise<_DataOf<typeof _getProcessInstanceSequenceFlows>> {
  return toCancelable(signal => _getProcessInstanceSequenceFlows({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get process instance statistics
 * Get statistics about elements by the process instance key.
 *
  *
 * @operationId getProcessInstanceStatistics
 * @tags Process instance
 */
export function getProcessInstanceStatistics(options?: Parameters<typeof _getProcessInstanceStatistics>[0]): CancelablePromise<_DataOf<typeof _getProcessInstanceStatistics>> {
  return toCancelable(signal => _getProcessInstanceStatistics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get resource
 * Returns a deployed resource.
 * :::info
 * Currently, this endpoint only supports RPA resources.
 * :::
 *
  *
 * @operationId getResource
 * @tags Resource
 */
export function getResource(options?: Parameters<typeof _getResource>[0]): CancelablePromise<_DataOf<typeof _getResource>> {
  return toCancelable(signal => _getResource({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get resource content
 * Returns the content of a deployed resource.
 * :::info
 * Currently, this endpoint only supports RPA resources.
 * :::
 *
  *
 * @operationId getResourceContent
 * @tags Resource
 */
export function getResourceContent(options?: Parameters<typeof _getResourceContent>[0]): CancelablePromise<_DataOf<typeof _getResourceContent>> {
  return toCancelable(signal => _getResourceContent({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get role
 * Get a role by its ID.
 *
  *
 * @operationId getRole
 * @tags Role
 */
export function getRole(options?: Parameters<typeof _getRole>[0]): CancelablePromise<_DataOf<typeof _getRole>> {
  return toCancelable(signal => _getRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get process start form
 * Get the start form of a process.
 *
 * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
 *
  *
 * @operationId getStartProcessForm
 * @tags Process definition
 */
export function getStartProcessForm(options?: Parameters<typeof _getStartProcessForm>[0]): CancelablePromise<_DataOf<typeof _getStartProcessForm>> {
  return toCancelable(signal => _getStartProcessForm({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get tenant
 * Retrieves a single tenant by tenant ID.
  *
 * @operationId getTenant
 * @tags Tenant
 */
export function getTenant(options?: Parameters<typeof _getTenant>[0]): CancelablePromise<_DataOf<typeof _getTenant>> {
  return toCancelable(signal => _getTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get cluster topology
 * Obtains the current topology of the cluster the gateway is part of.
  *
 * @operationId getTopology
 * @tags Cluster
 */
export function getTopology(options?: Parameters<typeof _getTopology>[0]): CancelablePromise<_DataOf<typeof _getTopology>> {
  return toCancelable(signal => _getTopology({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get usage metrics
 * Retrieve the usage metrics based on given criteria.
  *
 * @operationId getUsageMetrics
 * @tags System
 */
export function getUsageMetrics(options?: Parameters<typeof _getUsageMetrics>[0]): CancelablePromise<_DataOf<typeof _getUsageMetrics>> {
  return toCancelable(signal => _getUsageMetrics({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get user
 * Get a user by its username.
 *
  *
 * @operationId getUser
 * @tags User
 */
export function getUser(options?: Parameters<typeof _getUser>[0]): CancelablePromise<_DataOf<typeof _getUser>> {
  return toCancelable(signal => _getUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get user task
 * Get the user task by the user task key.
 *
  *
 * @operationId getUserTask
 * @tags User task
 */
export function getUserTask(options?: Parameters<typeof _getUserTask>[0]): CancelablePromise<_DataOf<typeof _getUserTask>> {
  return toCancelable(signal => _getUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get user task form
 * Get the form of a user task.
 *
 * Note that this endpoint will only return linked forms. This endpoint does not support embedded forms.
 *
  *
 * @operationId getUserTaskForm
 * @tags User task
 */
export function getUserTaskForm(options?: Parameters<typeof _getUserTaskForm>[0]): CancelablePromise<_DataOf<typeof _getUserTaskForm>> {
  return toCancelable(signal => _getUserTaskForm({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Get variable
 * Get the variable by the variable key.
 *
  *
 * @operationId getVariable
 * @tags Variable
 */
export function getVariable(options?: Parameters<typeof _getVariable>[0]): CancelablePromise<_DataOf<typeof _getVariable>> {
  return toCancelable(signal => _getVariable({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Migrate process instance
 * Migrates a process instance to a new process definition.
 * This request can contain multiple mapping instructions to define mapping between the active
 * process instance's elements and target process definition elements.
 *
 * Use this to upgrade a process instance to a new version of a process or to
 * a different process definition, e.g. to keep your running instances up-to-date with the
 * latest process improvements.
 *
  *
 * @operationId migrateProcessInstance
 * @tags Process instance
 */
export function migrateProcessInstance(options?: Parameters<typeof _migrateProcessInstance>[0]): CancelablePromise<_DataOf<typeof _migrateProcessInstance>> {
  return toCancelable(signal => _migrateProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Modify process instance
 * Modifies a running process instance.
 * This request can contain multiple instructions to activate an element of the process or
 * to terminate an active instance of an element.
 *
 * Use this to repair a process instance that is stuck on an element or took an unintended path.
 * For example, because an external system is not available or doesn't respond as expected.
 *
  *
 * @operationId modifyProcessInstance
 * @tags Process instance
 */
export function modifyProcessInstance(options?: Parameters<typeof _modifyProcessInstance>[0]): CancelablePromise<_DataOf<typeof _modifyProcessInstance>> {
  return toCancelable(signal => _modifyProcessInstance({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Reset internal clock (alpha)
 * Resets the Zeebe engine’s internal clock to the current system time, enabling it to tick in real-time.
 * This operation is useful for returning the clock to
 * normal behavior after it has been pinned to a specific time.
 *
 * This endpoint is an alpha feature and may be subject to change
 * in future releases.
 *
  *
 * @operationId resetClock
 * @tags Clock
 */
export function resetClock(options?: Parameters<typeof _resetClock>[0]): CancelablePromise<_DataOf<typeof _resetClock>> {
  return toCancelable(signal => _resetClock({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Resolve incident
 * Marks the incident as resolved; most likely a call to Update job will be necessary to reset the job’s retries, followed by this call.
 *
  *
 * @operationId resolveIncident
 * @tags Incident
 */
export function resolveIncident(options?: Parameters<typeof _resolveIncident>[0]): CancelablePromise<_DataOf<typeof _resolveIncident>> {
  return toCancelable(signal => _resolveIncident({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Resume Batch operation
 * Resumes a suspended batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId resumeBatchOperation
 * @tags Batch operation
 */
export function resumeBatchOperation(options?: Parameters<typeof _resumeBatchOperation>[0]): CancelablePromise<_DataOf<typeof _resumeBatchOperation>> {
  return toCancelable(signal => _resumeBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search group clients
 * Search clients assigned to a group.
 *
  *
 * @operationId searchClientsForGroup
 * @tags Group
 */
export function searchClientsForGroup(options?: Parameters<typeof _searchClientsForGroup>[0]): CancelablePromise<_DataOf<typeof _searchClientsForGroup>> {
  return toCancelable(signal => _searchClientsForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search role clients
 * Search clients with assigned role.
 *
  *
 * @operationId searchClientsForRole
 * @tags Role
 */
export function searchClientsForRole(options?: Parameters<typeof _searchClientsForRole>[0]): CancelablePromise<_DataOf<typeof _searchClientsForRole>> {
  return toCancelable(signal => _searchClientsForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search clients for tenant
 * Retrieves a filtered and sorted list of clients for a specified tenant.
  *
 * @operationId searchClientsForTenant
 * @tags Tenant
 */
export function searchClientsForTenant(options?: Parameters<typeof _searchClientsForTenant>[0]): CancelablePromise<_DataOf<typeof _searchClientsForTenant>> {
  return toCancelable(signal => _searchClientsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search groups for tenant
 * Retrieves a filtered and sorted list of groups for a specified tenant.
  *
 * @operationId searchGroupIdsForTenant
 * @tags Tenant
 */
export function searchGroupIdsForTenant(options?: Parameters<typeof _searchGroupIdsForTenant>[0]): CancelablePromise<_DataOf<typeof _searchGroupIdsForTenant>> {
  return toCancelable(signal => _searchGroupIdsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search role groups
 * Search groups with assigned role.
 *
  *
 * @operationId searchGroupsForRole
 * @tags Role
 */
export function searchGroupsForRole(options?: Parameters<typeof _searchGroupsForRole>[0]): CancelablePromise<_DataOf<typeof _searchGroupsForRole>> {
  return toCancelable(signal => _searchGroupsForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search group mapping rules
 * Search mapping rules assigned to a group.
 *
  *
 * @operationId searchMappingRulesForGroup
 * @tags Group
 */
export function searchMappingRulesForGroup(options?: Parameters<typeof _searchMappingRulesForGroup>[0]): CancelablePromise<_DataOf<typeof _searchMappingRulesForGroup>> {
  return toCancelable(signal => _searchMappingRulesForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search role mapping rules
 * Search mapping rules with assigned role.
 *
  *
 * @operationId searchMappingRulesForRole
 * @tags Role
 */
export function searchMappingRulesForRole(options?: Parameters<typeof _searchMappingRulesForRole>[0]): CancelablePromise<_DataOf<typeof _searchMappingRulesForRole>> {
  return toCancelable(signal => _searchMappingRulesForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search mapping rules for tenant
 * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
  *
 * @operationId searchMappingsForTenant
 * @tags Tenant
 */
export function searchMappingsForTenant(options?: Parameters<typeof _searchMappingsForTenant>[0]): CancelablePromise<_DataOf<typeof _searchMappingsForTenant>> {
  return toCancelable(signal => _searchMappingsForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search for incidents associated with a process instance
 * Search for incidents caused by the process instance or any of its called process or decision instances.
 *
  *
 * @operationId searchProcessInstanceIncidents
 * @tags Process instance
 */
export function searchProcessInstanceIncidents(options?: Parameters<typeof _searchProcessInstanceIncidents>[0]): CancelablePromise<_DataOf<typeof _searchProcessInstanceIncidents>> {
  return toCancelable(signal => _searchProcessInstanceIncidents({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search group roles
 * Search roles assigned to a group.
 *
  *
 * @operationId searchRolesForGroup
 * @tags Group
 */
export function searchRolesForGroup(options?: Parameters<typeof _searchRolesForGroup>[0]): CancelablePromise<_DataOf<typeof _searchRolesForGroup>> {
  return toCancelable(signal => _searchRolesForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search roles for tenant
 * Retrieves a filtered and sorted list of roles for a specified tenant.
  *
 * @operationId searchRolesForTenant
 * @tags Tenant
 */
export function searchRolesForTenant(options?: Parameters<typeof _searchRolesForTenant>[0]): CancelablePromise<_DataOf<typeof _searchRolesForTenant>> {
  return toCancelable(signal => _searchRolesForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search group users
 * Search users assigned to a group.
 *
  *
 * @operationId searchUsersForGroup
 * @tags Group
 */
export function searchUsersForGroup(options?: Parameters<typeof _searchUsersForGroup>[0]): CancelablePromise<_DataOf<typeof _searchUsersForGroup>> {
  return toCancelable(signal => _searchUsersForGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search role users
 * Search users with assigned role.
 *
  *
 * @operationId searchUsersForRole
 * @tags Role
 */
export function searchUsersForRole(options?: Parameters<typeof _searchUsersForRole>[0]): CancelablePromise<_DataOf<typeof _searchUsersForRole>> {
  return toCancelable(signal => _searchUsersForRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search users for tenant
 * Retrieves a filtered and sorted list of users for a specified tenant.
  *
 * @operationId searchUsersForTenant
 * @tags Tenant
 */
export function searchUsersForTenant(options?: Parameters<typeof _searchUsersForTenant>[0]): CancelablePromise<_DataOf<typeof _searchUsersForTenant>> {
  return toCancelable(signal => _searchUsersForTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Search user task variables
 * Search for user task variables based on given criteria.
 *
  *
 * @operationId searchUserTaskVariables
 * @tags User task
 */
export function searchUserTaskVariables(options?: Parameters<typeof _searchUserTaskVariables>[0]): CancelablePromise<_DataOf<typeof _searchUserTaskVariables>> {
  return toCancelable(signal => _searchUserTaskVariables({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Suspend Batch operation
 * Suspends a running batch operation.
 * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
 *
  *
 * @operationId suspendBatchOperation
 * @tags Batch operation
 */
export function suspendBatchOperation(options?: Parameters<typeof _suspendBatchOperation>[0]): CancelablePromise<_DataOf<typeof _suspendBatchOperation>> {
  return toCancelable(signal => _suspendBatchOperation({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Throw error for job
 * Reports a business error (i.e. non-technical) that occurs while processing a job.
 *
  *
 * @operationId throwJobError
 * @tags Job
 */
export function throwJobError(options?: Parameters<typeof _throwJobError>[0]): CancelablePromise<_DataOf<typeof _throwJobError>> {
  return toCancelable(signal => _throwJobError({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a client from a group
 * Unassigns a client from a group.
 * The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
  *
 * @operationId unassignClientFromGroup
 * @tags Group
 */
export function unassignClientFromGroup(options?: Parameters<typeof _unassignClientFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromGroup>> {
  return toCancelable(signal => _unassignClientFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a client from a tenant
 * Unassigns the client from the specified tenant. The client can no longer access tenant data.
  *
 * @operationId unassignClientFromTenant
 * @tags Tenant
 */
export function unassignClientFromTenant(options?: Parameters<typeof _unassignClientFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignClientFromTenant>> {
  return toCancelable(signal => _unassignClientFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a group from a tenant
 * Unassigns a group from a specified tenant. Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
  *
 * @operationId unassignGroupFromTenant
 * @tags Tenant
 */
export function unassignGroupFromTenant(options?: Parameters<typeof _unassignGroupFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignGroupFromTenant>> {
  return toCancelable(signal => _unassignGroupFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a mapping rule from a group
 * Unassigns a mapping rule from a group.
 *
  *
 * @operationId unassignMappingRuleFromGroup
 * @tags Group
 */
export function unassignMappingRuleFromGroup(options?: Parameters<typeof _unassignMappingRuleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromGroup>> {
  return toCancelable(signal => _unassignMappingRuleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a mapping rule from a tenant
 * Unassigns a single mapping rule from a specified tenant without deleting the rule.
  *
 * @operationId unassignMappingRuleFromTenant
 * @tags Tenant
 */
export function unassignMappingRuleFromTenant(options?: Parameters<typeof _unassignMappingRuleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignMappingRuleFromTenant>> {
  return toCancelable(signal => _unassignMappingRuleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a client
 *  Unassigns the specified role from the client.  The client will no longer inherit the authorizations associated with this role.
  *
 * @operationId unassignRoleFromClient
 * @tags Role
 */
export function unassignRoleFromClient(options?: Parameters<typeof _unassignRoleFromClient>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromClient>> {
  return toCancelable(signal => _unassignRoleFromClient({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a group
 * Unassigns the specified role from the group. All group members (user or client) no longer inherit the authorizations associated with this role.
  *
 * @operationId unassignRoleFromGroup
 * @tags Role
 */
export function unassignRoleFromGroup(options?: Parameters<typeof _unassignRoleFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromGroup>> {
  return toCancelable(signal => _unassignRoleFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a mapping rule
 * Unassigns a role from a mapping rule.
 *
  *
 * @operationId unassignRoleFromMappingRule
 * @tags Role
 */
export function unassignRoleFromMappingRule(options?: Parameters<typeof _unassignRoleFromMappingRule>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromMappingRule>> {
  return toCancelable(signal => _unassignRoleFromMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a tenant
 * Unassigns a role from a specified tenant. Users, Clients or Groups, that have the role assigned, will no longer have access to the tenant's data - unless they are assigned directly to the tenant.
  *
 * @operationId unassignRoleFromTenant
 * @tags Tenant
 */
export function unassignRoleFromTenant(options?: Parameters<typeof _unassignRoleFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromTenant>> {
  return toCancelable(signal => _unassignRoleFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a role from a user
 * Unassigns a role from a user.
 * The user will no longer inherit the authorizations associated with this role.
  *
 * @operationId unassignRoleFromUser
 * @tags Role
 */
export function unassignRoleFromUser(options?: Parameters<typeof _unassignRoleFromUser>[0]): CancelablePromise<_DataOf<typeof _unassignRoleFromUser>> {
  return toCancelable(signal => _unassignRoleFromUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a user from a group
 * Unassigns a user from a group.
 * The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
  *
 * @operationId unassignUserFromGroup
 * @tags Group
 */
export function unassignUserFromGroup(options?: Parameters<typeof _unassignUserFromGroup>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromGroup>> {
  return toCancelable(signal => _unassignUserFromGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign a user from a tenant
 * Unassigns the user from the specified tenant. The user can no longer access tenant data.
  *
 * @operationId unassignUserFromTenant
 * @tags Tenant
 */
export function unassignUserFromTenant(options?: Parameters<typeof _unassignUserFromTenant>[0]): CancelablePromise<_DataOf<typeof _unassignUserFromTenant>> {
  return toCancelable(signal => _unassignUserFromTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Unassign user task
 * Removes the assignee of a task with the given key.
  *
 * @operationId unassignUserTask
 * @tags User task
 */
export function unassignUserTask(options?: Parameters<typeof _unassignUserTask>[0]): CancelablePromise<_DataOf<typeof _unassignUserTask>> {
  return toCancelable(signal => _unassignUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update authorization
 * Update the authorization with the given key.
  *
 * @operationId updateAuthorization
 * @tags Authorization
 */
export function updateAuthorization(options?: Parameters<typeof _updateAuthorization>[0]): CancelablePromise<_DataOf<typeof _updateAuthorization>> {
  return toCancelable(signal => _updateAuthorization({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update group
 * Update a group with the given ID.
 *
  *
 * @operationId updateGroup
 * @tags Group
 */
export function updateGroup(options?: Parameters<typeof _updateGroup>[0]): CancelablePromise<_DataOf<typeof _updateGroup>> {
  return toCancelable(signal => _updateGroup({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update job
 * Update a job with the given key.
  *
 * @operationId updateJob
 * @tags Job
 */
export function updateJob(options?: Parameters<typeof _updateJob>[0]): CancelablePromise<_DataOf<typeof _updateJob>> {
  return toCancelable(signal => _updateJob({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update mapping rule
 * Update a mapping rule.
 *
  *
 * @operationId updateMappingRule
 * @tags Mapping rule
 */
export function updateMappingRule(options?: Parameters<typeof _updateMappingRule>[0]): CancelablePromise<_DataOf<typeof _updateMappingRule>> {
  return toCancelable(signal => _updateMappingRule({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update role
 * Update a role with the given ID.
 *
  *
 * @operationId updateRole
 * @tags Role
 */
export function updateRole(options?: Parameters<typeof _updateRole>[0]): CancelablePromise<_DataOf<typeof _updateRole>> {
  return toCancelable(signal => _updateRole({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update tenant
 * Updates an existing tenant.
  *
 * @operationId updateTenant
 * @tags Tenant
 */
export function updateTenant(options?: Parameters<typeof _updateTenant>[0]): CancelablePromise<_DataOf<typeof _updateTenant>> {
  return toCancelable(signal => _updateTenant({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update user
 * Updates a user.
 *
  *
 * @operationId updateUser
 * @tags User
 */
export function updateUser(options?: Parameters<typeof _updateUser>[0]): CancelablePromise<_DataOf<typeof _updateUser>> {
  return toCancelable(signal => _updateUser({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}

/**
 * Update user task
 * Update a user task with the given key.
  *
 * @operationId updateUserTask
 * @tags User task
 */
export function updateUserTask(options?: Parameters<typeof _updateUserTask>[0]): CancelablePromise<_DataOf<typeof _updateUserTask>> {
  return toCancelable(signal => _updateUserTask({ ...(options||{}), signal } as any).then((r:any)=> r?.data ?? r));
}
