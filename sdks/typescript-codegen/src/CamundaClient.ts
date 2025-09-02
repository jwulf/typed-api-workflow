// @generated from CamundaClient.template.ts – DO NOT EDIT DIRECTLY
// Canonical Camunda class template (manually maintained)
// DO NOT add generated operation methods here; generator will produce CamundaClient.ts from this template.

import { createClient } from './gen/client/client.gen';
import type { Client } from './gen/client/types.gen';
import { createAuthFacade } from './runtime/auth';
import type { CamundaConfig } from './runtime/unifiedConfiguration';
import type { EnvOverrides } from './runtime/configSchema';
import { hydrateConfig } from './runtime/unifiedConfiguration';
import * as Sdk from './gen/sdk.gen';
import { ConsistencyOptions, eventualPoll } from './runtime/eventual'
import * as Schemas from './gen/zod.gen';
import { ValidationManager } from './runtime/validationManager';

// === AUTO-GENERATED CAMUNDA SUPPORT TYPES START ===
// Generated 2025-09-02T00:58:59.157Z
// Operations: 144
type _RawReturn<F> = F extends (...a:any)=>Promise<infer R> ? R : never;
type _DataOf<F> = Exclude<_RawReturn<F> extends { data: infer D } ? D : _RawReturn<F>, undefined>;
type activateAdHocSubProcessActivitiesOptions = Parameters<typeof Sdk.activateAdHocSubProcessActivities>[0];
type activateAdHocSubProcessActivitiesBody = (NonNullable<activateAdHocSubProcessActivitiesOptions> extends { body?: infer B } ? B : never);
type activateJobsOptions = Parameters<typeof Sdk.activateJobs>[0];
type activateJobsBody = (NonNullable<activateJobsOptions> extends { body?: infer B } ? B : never);
type assignClientToGroupOptions = Parameters<typeof Sdk.assignClientToGroup>[0];
type assignClientToTenantOptions = Parameters<typeof Sdk.assignClientToTenant>[0];
type assignGroupToTenantOptions = Parameters<typeof Sdk.assignGroupToTenant>[0];
type assignMappingRuleToGroupOptions = Parameters<typeof Sdk.assignMappingRuleToGroup>[0];
type assignMappingRuleToTenantOptions = Parameters<typeof Sdk.assignMappingRuleToTenant>[0];
type assignRoleToClientOptions = Parameters<typeof Sdk.assignRoleToClient>[0];
type assignRoleToGroupOptions = Parameters<typeof Sdk.assignRoleToGroup>[0];
type assignRoleToMappingRuleOptions = Parameters<typeof Sdk.assignRoleToMappingRule>[0];
type assignRoleToTenantOptions = Parameters<typeof Sdk.assignRoleToTenant>[0];
type assignRoleToUserOptions = Parameters<typeof Sdk.assignRoleToUser>[0];
type assignUserTaskOptions = Parameters<typeof Sdk.assignUserTask>[0];
type assignUserTaskBody = (NonNullable<assignUserTaskOptions> extends { body?: infer B } ? B : never);
type assignUserToGroupOptions = Parameters<typeof Sdk.assignUserToGroup>[0];
type assignUserToTenantOptions = Parameters<typeof Sdk.assignUserToTenant>[0];
type broadcastSignalOptions = Parameters<typeof Sdk.broadcastSignal>[0];
type broadcastSignalBody = (NonNullable<broadcastSignalOptions> extends { body?: infer B } ? B : never);
type cancelBatchOperationOptions = Parameters<typeof Sdk.cancelBatchOperation>[0];
type cancelBatchOperationBody = (NonNullable<cancelBatchOperationOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type cancelBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.cancelBatchOperation>> 
};
type cancelProcessInstanceOptions = Parameters<typeof Sdk.cancelProcessInstance>[0];
type cancelProcessInstanceBody = (NonNullable<cancelProcessInstanceOptions> extends { body?: infer B } ? B : never);
type cancelProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.cancelProcessInstancesBatchOperation>[0];
type cancelProcessInstancesBatchOperationBody = (NonNullable<cancelProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type cancelProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>> 
};
type completeJobOptions = Parameters<typeof Sdk.completeJob>[0];
type completeJobBody = (NonNullable<completeJobOptions> extends { body?: infer B } ? B : never);
type completeUserTaskOptions = Parameters<typeof Sdk.completeUserTask>[0];
type completeUserTaskBody = (NonNullable<completeUserTaskOptions> extends { body?: infer B } ? B : never);
type correlateMessageOptions = Parameters<typeof Sdk.correlateMessage>[0];
type correlateMessageBody = (NonNullable<correlateMessageOptions> extends { body?: infer B } ? B : never);
type createAdminUserOptions = Parameters<typeof Sdk.createAdminUser>[0];
type createAdminUserBody = (NonNullable<createAdminUserOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type createAdminUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.createAdminUser>> 
};
type createAuthorizationOptions = Parameters<typeof Sdk.createAuthorization>[0];
type createAuthorizationBody = (NonNullable<createAuthorizationOptions> extends { body?: infer B } ? B : never);
type createDeploymentOptions = Parameters<typeof Sdk.createDeployment>[0];
type createDeploymentBody = (NonNullable<createDeploymentOptions> extends { body?: infer B } ? B : never);
type createDocumentOptions = Parameters<typeof Sdk.createDocument>[0];
type createDocumentBody = (NonNullable<createDocumentOptions> extends { body?: infer B } ? B : never);
type createDocumentLinkOptions = Parameters<typeof Sdk.createDocumentLink>[0];
type createDocumentLinkBody = (NonNullable<createDocumentLinkOptions> extends { body?: infer B } ? B : never);
type createDocumentsOptions = Parameters<typeof Sdk.createDocuments>[0];
type createDocumentsBody = (NonNullable<createDocumentsOptions> extends { body?: infer B } ? B : never);
type createElementInstanceVariablesOptions = Parameters<typeof Sdk.createElementInstanceVariables>[0];
type createElementInstanceVariablesBody = (NonNullable<createElementInstanceVariablesOptions> extends { body?: infer B } ? B : never);
type createGroupOptions = Parameters<typeof Sdk.createGroup>[0];
type createGroupBody = (NonNullable<createGroupOptions> extends { body?: infer B } ? B : never);
type createMappingRuleOptions = Parameters<typeof Sdk.createMappingRule>[0];
type createMappingRuleBody = (NonNullable<createMappingRuleOptions> extends { body?: infer B } ? B : never);
type createProcessInstanceOptions = Parameters<typeof Sdk.createProcessInstance>[0];
type createProcessInstanceBody = (NonNullable<createProcessInstanceOptions> extends { body?: infer B } ? B : never);
type createRoleOptions = Parameters<typeof Sdk.createRole>[0];
type createRoleBody = (NonNullable<createRoleOptions> extends { body?: infer B } ? B : never);
type createTenantOptions = Parameters<typeof Sdk.createTenant>[0];
type createTenantBody = (NonNullable<createTenantOptions> extends { body?: infer B } ? B : never);
type createUserOptions = Parameters<typeof Sdk.createUser>[0];
type createUserBody = (NonNullable<createUserOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type createUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.createUser>> 
};
type deleteAuthorizationOptions = Parameters<typeof Sdk.deleteAuthorization>[0];
type deleteAuthorizationPathParam = (NonNullable<deleteAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
type deleteDocumentOptions = Parameters<typeof Sdk.deleteDocument>[0];
type deleteDocumentPathParam = (NonNullable<deleteDocumentOptions> extends { path: { documentId: infer P } } ? P : any);
type deleteGroupOptions = Parameters<typeof Sdk.deleteGroup>[0];
type deleteGroupPathParam = (NonNullable<deleteGroupOptions> extends { path: { groupId: infer P } } ? P : any);
type deleteMappingRuleOptions = Parameters<typeof Sdk.deleteMappingRule>[0];
type deleteMappingRulePathParam = (NonNullable<deleteMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
type deleteResourceOptions = Parameters<typeof Sdk.deleteResource>[0];
type deleteResourceBody = (NonNullable<deleteResourceOptions> extends { body?: infer B } ? B : never);
type deleteRoleOptions = Parameters<typeof Sdk.deleteRole>[0];
type deleteRolePathParam = (NonNullable<deleteRoleOptions> extends { path: { roleId: infer P } } ? P : any);
type deleteTenantOptions = Parameters<typeof Sdk.deleteTenant>[0];
type deleteTenantPathParam = (NonNullable<deleteTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
type deleteUserOptions = Parameters<typeof Sdk.deleteUser>[0];
type deleteUserPathParam = (NonNullable<deleteUserOptions> extends { path: { username: infer P } } ? P : any);
/** Management of eventual consistency **/
type deleteUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.deleteUser>> 
};
type evaluateDecisionOptions = Parameters<typeof Sdk.evaluateDecision>[0];
type evaluateDecisionBody = (NonNullable<evaluateDecisionOptions> extends { body?: infer B } ? B : never);
type failJobOptions = Parameters<typeof Sdk.failJob>[0];
type failJobBody = (NonNullable<failJobOptions> extends { body?: infer B } ? B : never);
type getAuthenticationOptions = Parameters<typeof Sdk.getAuthentication>[0];
type getAuthorizationOptions = Parameters<typeof Sdk.getAuthorization>[0];
type getAuthorizationPathParam = (NonNullable<getAuthorizationOptions> extends { path: { authorizationKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getAuthorizationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getAuthorization>> 
};
type getBatchOperationOptions = Parameters<typeof Sdk.getBatchOperation>[0];
type getBatchOperationPathParam = (NonNullable<getBatchOperationOptions> extends { path: { batchOperationKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getBatchOperation>> 
};
type getDecisionDefinitionOptions = Parameters<typeof Sdk.getDecisionDefinition>[0];
type getDecisionDefinitionPathParam = (NonNullable<getDecisionDefinitionOptions> extends { path: { decisionDefinitionKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getDecisionDefinitionConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionDefinition>> 
};
type getDecisionDefinitionXmlOptions = Parameters<typeof Sdk.getDecisionDefinitionXml>[0];
type getDecisionDefinitionXmlPathParam = (NonNullable<getDecisionDefinitionXmlOptions> extends { path: { decisionDefinitionKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getDecisionDefinitionXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionDefinitionXml>> 
};
type getDecisionInstanceOptions = Parameters<typeof Sdk.getDecisionInstance>[0];
type getDecisionInstancePathParam = (NonNullable<getDecisionInstanceOptions> extends { path: { decisionEvaluationInstanceKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getDecisionInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionInstance>> 
};
type getDecisionRequirementsOptions = Parameters<typeof Sdk.getDecisionRequirements>[0];
type getDecisionRequirementsPathParam = (NonNullable<getDecisionRequirementsOptions> extends { path: { decisionRequirementsKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getDecisionRequirementsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionRequirements>> 
};
type getDecisionRequirementsXmlOptions = Parameters<typeof Sdk.getDecisionRequirementsXml>[0];
type getDecisionRequirementsXmlPathParam = (NonNullable<getDecisionRequirementsXmlOptions> extends { path: { decisionRequirementsKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getDecisionRequirementsXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getDecisionRequirementsXml>> 
};
type getDocumentOptions = Parameters<typeof Sdk.getDocument>[0];
type getDocumentPathParam = (NonNullable<getDocumentOptions> extends { path: { documentId: infer P } } ? P : any);
type getElementInstanceOptions = Parameters<typeof Sdk.getElementInstance>[0];
type getElementInstancePathParam = (NonNullable<getElementInstanceOptions> extends { path: { elementInstanceKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getElementInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getElementInstance>> 
};
type getGroupOptions = Parameters<typeof Sdk.getGroup>[0];
type getGroupPathParam = (NonNullable<getGroupOptions> extends { path: { groupId: infer P } } ? P : any);
/** Management of eventual consistency **/
type getGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getGroup>> 
};
type getIncidentOptions = Parameters<typeof Sdk.getIncident>[0];
type getIncidentPathParam = (NonNullable<getIncidentOptions> extends { path: { incidentKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getIncidentConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getIncident>> 
};
type getLicenseOptions = Parameters<typeof Sdk.getLicense>[0];
type getMappingRuleOptions = Parameters<typeof Sdk.getMappingRule>[0];
type getMappingRulePathParam = (NonNullable<getMappingRuleOptions> extends { path: { mappingRuleId: infer P } } ? P : any);
/** Management of eventual consistency **/
type getMappingRuleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getMappingRule>> 
};
type getProcessDefinitionOptions = Parameters<typeof Sdk.getProcessDefinition>[0];
type getProcessDefinitionPathParam = (NonNullable<getProcessDefinitionOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getProcessDefinitionConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinition>> 
};
type getProcessDefinitionStatisticsOptions = Parameters<typeof Sdk.getProcessDefinitionStatistics>[0];
type getProcessDefinitionStatisticsBody = (NonNullable<getProcessDefinitionStatisticsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type getProcessDefinitionStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionStatistics>> 
};
type getProcessDefinitionXmlOptions = Parameters<typeof Sdk.getProcessDefinitionXml>[0];
type getProcessDefinitionXmlPathParam = (NonNullable<getProcessDefinitionXmlOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getProcessDefinitionXmlConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessDefinitionXml>> 
};
type getProcessInstanceOptions = Parameters<typeof Sdk.getProcessInstance>[0];
type getProcessInstancePathParam = (NonNullable<getProcessInstanceOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getProcessInstanceConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstance>> 
};
type getProcessInstanceCallHierarchyOptions = Parameters<typeof Sdk.getProcessInstanceCallHierarchy>[0];
type getProcessInstanceCallHierarchyPathParam = (NonNullable<getProcessInstanceCallHierarchyOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getProcessInstanceCallHierarchyConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>> 
};
type getProcessInstanceSequenceFlowsOptions = Parameters<typeof Sdk.getProcessInstanceSequenceFlows>[0];
type getProcessInstanceSequenceFlowsPathParam = (NonNullable<getProcessInstanceSequenceFlowsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getProcessInstanceSequenceFlowsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>> 
};
type getProcessInstanceStatisticsOptions = Parameters<typeof Sdk.getProcessInstanceStatistics>[0];
type getProcessInstanceStatisticsPathParam = (NonNullable<getProcessInstanceStatisticsOptions> extends { path: { processInstanceKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getProcessInstanceStatisticsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getProcessInstanceStatistics>> 
};
type getResourceOptions = Parameters<typeof Sdk.getResource>[0];
type getResourcePathParam = (NonNullable<getResourceOptions> extends { path: { resourceKey: infer P } } ? P : any);
type getResourceContentOptions = Parameters<typeof Sdk.getResourceContent>[0];
type getResourceContentPathParam = (NonNullable<getResourceContentOptions> extends { path: { resourceKey: infer P } } ? P : any);
type getRoleOptions = Parameters<typeof Sdk.getRole>[0];
type getRolePathParam = (NonNullable<getRoleOptions> extends { path: { roleId: infer P } } ? P : any);
/** Management of eventual consistency **/
type getRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getRole>> 
};
type getStartProcessFormOptions = Parameters<typeof Sdk.getStartProcessForm>[0];
type getStartProcessFormPathParam = (NonNullable<getStartProcessFormOptions> extends { path: { processDefinitionKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getStartProcessFormConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getStartProcessForm>> 
};
type getTenantOptions = Parameters<typeof Sdk.getTenant>[0];
type getTenantPathParam = (NonNullable<getTenantOptions> extends { path: { tenantId: infer P } } ? P : any);
/** Management of eventual consistency **/
type getTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getTenant>> 
};
type getTopologyOptions = Parameters<typeof Sdk.getTopology>[0];
type getUsageMetricsOptions = Parameters<typeof Sdk.getUsageMetrics>[0];
/** Management of eventual consistency **/
type getUsageMetricsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUsageMetrics>> 
};
type getUserOptions = Parameters<typeof Sdk.getUser>[0];
type getUserPathParam = (NonNullable<getUserOptions> extends { path: { username: infer P } } ? P : any);
/** Management of eventual consistency **/
type getUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUser>> 
};
type getUserTaskOptions = Parameters<typeof Sdk.getUserTask>[0];
type getUserTaskPathParam = (NonNullable<getUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getUserTaskConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUserTask>> 
};
type getUserTaskFormOptions = Parameters<typeof Sdk.getUserTaskForm>[0];
type getUserTaskFormPathParam = (NonNullable<getUserTaskFormOptions> extends { path: { userTaskKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getUserTaskFormConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getUserTaskForm>> 
};
type getVariableOptions = Parameters<typeof Sdk.getVariable>[0];
type getVariablePathParam = (NonNullable<getVariableOptions> extends { path: { variableKey: infer P } } ? P : any);
/** Management of eventual consistency **/
type getVariableConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.getVariable>> 
};
type migrateProcessInstanceOptions = Parameters<typeof Sdk.migrateProcessInstance>[0];
type migrateProcessInstanceBody = (NonNullable<migrateProcessInstanceOptions> extends { body?: infer B } ? B : never);
type migrateProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.migrateProcessInstancesBatchOperation>[0];
type migrateProcessInstancesBatchOperationBody = (NonNullable<migrateProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type migrateProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>> 
};
type modifyProcessInstanceOptions = Parameters<typeof Sdk.modifyProcessInstance>[0];
type modifyProcessInstanceBody = (NonNullable<modifyProcessInstanceOptions> extends { body?: infer B } ? B : never);
type modifyProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.modifyProcessInstancesBatchOperation>[0];
type modifyProcessInstancesBatchOperationBody = (NonNullable<modifyProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type modifyProcessInstancesBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>> 
};
type pinClockOptions = Parameters<typeof Sdk.pinClock>[0];
type pinClockBody = (NonNullable<pinClockOptions> extends { body?: infer B } ? B : never);
type publishMessageOptions = Parameters<typeof Sdk.publishMessage>[0];
type publishMessageBody = (NonNullable<publishMessageOptions> extends { body?: infer B } ? B : never);
type resetClockOptions = Parameters<typeof Sdk.resetClock>[0];
type resolveIncidentOptions = Parameters<typeof Sdk.resolveIncident>[0];
type resolveIncidentBody = (NonNullable<resolveIncidentOptions> extends { body?: infer B } ? B : never);
type resolveIncidentsBatchOperationOptions = Parameters<typeof Sdk.resolveIncidentsBatchOperation>[0];
type resolveIncidentsBatchOperationBody = (NonNullable<resolveIncidentsBatchOperationOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type resolveIncidentsBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>> 
};
type resumeBatchOperationOptions = Parameters<typeof Sdk.resumeBatchOperation>[0];
type resumeBatchOperationBody = (NonNullable<resumeBatchOperationOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type resumeBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.resumeBatchOperation>> 
};
type searchAuthorizationsOptions = Parameters<typeof Sdk.searchAuthorizations>[0];
type searchAuthorizationsBody = (NonNullable<searchAuthorizationsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchAuthorizationsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchAuthorizations>> 
};
type searchBatchOperationItemsOptions = Parameters<typeof Sdk.searchBatchOperationItems>[0];
type searchBatchOperationItemsBody = (NonNullable<searchBatchOperationItemsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchBatchOperationItemsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchBatchOperationItems>> 
};
type searchBatchOperationsOptions = Parameters<typeof Sdk.searchBatchOperations>[0];
type searchBatchOperationsBody = (NonNullable<searchBatchOperationsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchBatchOperationsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchBatchOperations>> 
};
type searchClientsForGroupOptions = Parameters<typeof Sdk.searchClientsForGroup>[0];
type searchClientsForGroupBody = (NonNullable<searchClientsForGroupOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchClientsForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForGroup>> 
};
type searchClientsForRoleOptions = Parameters<typeof Sdk.searchClientsForRole>[0];
type searchClientsForRoleBody = (NonNullable<searchClientsForRoleOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchClientsForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForRole>> 
};
type searchClientsForTenantOptions = Parameters<typeof Sdk.searchClientsForTenant>[0];
type searchClientsForTenantBody = (NonNullable<searchClientsForTenantOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchClientsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchClientsForTenant>> 
};
type searchDecisionDefinitionsOptions = Parameters<typeof Sdk.searchDecisionDefinitions>[0];
type searchDecisionDefinitionsBody = (NonNullable<searchDecisionDefinitionsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchDecisionDefinitionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionDefinitions>> 
};
type searchDecisionInstancesOptions = Parameters<typeof Sdk.searchDecisionInstances>[0];
type searchDecisionInstancesBody = (NonNullable<searchDecisionInstancesOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchDecisionInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionInstances>> 
};
type searchDecisionRequirementsOptions = Parameters<typeof Sdk.searchDecisionRequirements>[0];
type searchDecisionRequirementsBody = (NonNullable<searchDecisionRequirementsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchDecisionRequirementsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchDecisionRequirements>> 
};
type searchElementInstancesOptions = Parameters<typeof Sdk.searchElementInstances>[0];
type searchElementInstancesBody = (NonNullable<searchElementInstancesOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchElementInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchElementInstances>> 
};
type searchGroupIdsForTenantOptions = Parameters<typeof Sdk.searchGroupIdsForTenant>[0];
type searchGroupIdsForTenantBody = (NonNullable<searchGroupIdsForTenantOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchGroupIdsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroupIdsForTenant>> 
};
type searchGroupsOptions = Parameters<typeof Sdk.searchGroups>[0];
type searchGroupsBody = (NonNullable<searchGroupsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchGroupsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroups>> 
};
type searchGroupsForRoleOptions = Parameters<typeof Sdk.searchGroupsForRole>[0];
type searchGroupsForRoleBody = (NonNullable<searchGroupsForRoleOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchGroupsForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchGroupsForRole>> 
};
type searchIncidentsOptions = Parameters<typeof Sdk.searchIncidents>[0];
type searchIncidentsBody = (NonNullable<searchIncidentsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchIncidents>> 
};
type searchJobsOptions = Parameters<typeof Sdk.searchJobs>[0];
type searchJobsBody = (NonNullable<searchJobsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchJobsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchJobs>> 
};
type searchMappingRuleOptions = Parameters<typeof Sdk.searchMappingRule>[0];
type searchMappingRuleBody = (NonNullable<searchMappingRuleOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchMappingRuleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRule>> 
};
type searchMappingRulesForGroupOptions = Parameters<typeof Sdk.searchMappingRulesForGroup>[0];
type searchMappingRulesForGroupBody = (NonNullable<searchMappingRulesForGroupOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchMappingRulesForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForGroup>> 
};
type searchMappingRulesForRoleOptions = Parameters<typeof Sdk.searchMappingRulesForRole>[0];
type searchMappingRulesForRoleBody = (NonNullable<searchMappingRulesForRoleOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchMappingRulesForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingRulesForRole>> 
};
type searchMappingsForTenantOptions = Parameters<typeof Sdk.searchMappingsForTenant>[0];
type searchMappingsForTenantBody = (NonNullable<searchMappingsForTenantOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchMappingsForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMappingsForTenant>> 
};
type searchMessageSubscriptionsOptions = Parameters<typeof Sdk.searchMessageSubscriptions>[0];
type searchMessageSubscriptionsBody = (NonNullable<searchMessageSubscriptionsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchMessageSubscriptionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchMessageSubscriptions>> 
};
type searchProcessDefinitionsOptions = Parameters<typeof Sdk.searchProcessDefinitions>[0];
type searchProcessDefinitionsBody = (NonNullable<searchProcessDefinitionsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchProcessDefinitionsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessDefinitions>> 
};
type searchProcessInstanceIncidentsOptions = Parameters<typeof Sdk.searchProcessInstanceIncidents>[0];
type searchProcessInstanceIncidentsBody = (NonNullable<searchProcessInstanceIncidentsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchProcessInstanceIncidentsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstanceIncidents>> 
};
type searchProcessInstancesOptions = Parameters<typeof Sdk.searchProcessInstances>[0];
type searchProcessInstancesBody = (NonNullable<searchProcessInstancesOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchProcessInstancesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchProcessInstances>> 
};
type searchRolesOptions = Parameters<typeof Sdk.searchRoles>[0];
type searchRolesBody = (NonNullable<searchRolesOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchRolesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRoles>> 
};
type searchRolesForGroupOptions = Parameters<typeof Sdk.searchRolesForGroup>[0];
type searchRolesForGroupBody = (NonNullable<searchRolesForGroupOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchRolesForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRolesForGroup>> 
};
type searchRolesForTenantOptions = Parameters<typeof Sdk.searchRolesForTenant>[0];
type searchRolesForTenantBody = (NonNullable<searchRolesForTenantOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchRolesForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchRolesForTenant>> 
};
type searchTenantsOptions = Parameters<typeof Sdk.searchTenants>[0];
type searchTenantsBody = (NonNullable<searchTenantsOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchTenantsConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchTenants>> 
};
type searchUsersOptions = Parameters<typeof Sdk.searchUsers>[0];
type searchUsersBody = (NonNullable<searchUsersOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchUsersConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsers>> 
};
type searchUsersForGroupOptions = Parameters<typeof Sdk.searchUsersForGroup>[0];
type searchUsersForGroupBody = (NonNullable<searchUsersForGroupOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchUsersForGroupConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForGroup>> 
};
type searchUsersForRoleOptions = Parameters<typeof Sdk.searchUsersForRole>[0];
type searchUsersForRoleBody = (NonNullable<searchUsersForRoleOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchUsersForRoleConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForRole>> 
};
type searchUsersForTenantOptions = Parameters<typeof Sdk.searchUsersForTenant>[0];
type searchUsersForTenantBody = (NonNullable<searchUsersForTenantOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchUsersForTenantConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUsersForTenant>> 
};
type searchUserTasksOptions = Parameters<typeof Sdk.searchUserTasks>[0];
type searchUserTasksBody = (NonNullable<searchUserTasksOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchUserTasksConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTasks>> 
};
type searchUserTaskVariablesOptions = Parameters<typeof Sdk.searchUserTaskVariables>[0];
type searchUserTaskVariablesBody = (NonNullable<searchUserTaskVariablesOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchUserTaskVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchUserTaskVariables>> 
};
type searchVariablesOptions = Parameters<typeof Sdk.searchVariables>[0];
type searchVariablesBody = (NonNullable<searchVariablesOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type searchVariablesConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.searchVariables>> 
};
type suspendBatchOperationOptions = Parameters<typeof Sdk.suspendBatchOperation>[0];
type suspendBatchOperationBody = (NonNullable<suspendBatchOperationOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type suspendBatchOperationConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.suspendBatchOperation>> 
};
type throwJobErrorOptions = Parameters<typeof Sdk.throwJobError>[0];
type throwJobErrorBody = (NonNullable<throwJobErrorOptions> extends { body?: infer B } ? B : never);
type unassignClientFromGroupOptions = Parameters<typeof Sdk.unassignClientFromGroup>[0];
type unassignClientFromTenantOptions = Parameters<typeof Sdk.unassignClientFromTenant>[0];
type unassignGroupFromTenantOptions = Parameters<typeof Sdk.unassignGroupFromTenant>[0];
type unassignMappingRuleFromGroupOptions = Parameters<typeof Sdk.unassignMappingRuleFromGroup>[0];
type unassignMappingRuleFromTenantOptions = Parameters<typeof Sdk.unassignMappingRuleFromTenant>[0];
type unassignRoleFromClientOptions = Parameters<typeof Sdk.unassignRoleFromClient>[0];
type unassignRoleFromGroupOptions = Parameters<typeof Sdk.unassignRoleFromGroup>[0];
type unassignRoleFromMappingRuleOptions = Parameters<typeof Sdk.unassignRoleFromMappingRule>[0];
type unassignRoleFromTenantOptions = Parameters<typeof Sdk.unassignRoleFromTenant>[0];
type unassignRoleFromUserOptions = Parameters<typeof Sdk.unassignRoleFromUser>[0];
type unassignUserFromGroupOptions = Parameters<typeof Sdk.unassignUserFromGroup>[0];
type unassignUserFromTenantOptions = Parameters<typeof Sdk.unassignUserFromTenant>[0];
type unassignUserTaskOptions = Parameters<typeof Sdk.unassignUserTask>[0];
type unassignUserTaskPathParam = (NonNullable<unassignUserTaskOptions> extends { path: { userTaskKey: infer P } } ? P : any);
type updateAuthorizationOptions = Parameters<typeof Sdk.updateAuthorization>[0];
type updateAuthorizationBody = (NonNullable<updateAuthorizationOptions> extends { body?: infer B } ? B : never);
type updateGroupOptions = Parameters<typeof Sdk.updateGroup>[0];
type updateGroupBody = (NonNullable<updateGroupOptions> extends { body?: infer B } ? B : never);
type updateJobOptions = Parameters<typeof Sdk.updateJob>[0];
type updateJobBody = (NonNullable<updateJobOptions> extends { body?: infer B } ? B : never);
type updateMappingRuleOptions = Parameters<typeof Sdk.updateMappingRule>[0];
type updateMappingRuleBody = (NonNullable<updateMappingRuleOptions> extends { body?: infer B } ? B : never);
type updateRoleOptions = Parameters<typeof Sdk.updateRole>[0];
type updateRoleBody = (NonNullable<updateRoleOptions> extends { body?: infer B } ? B : never);
type updateTenantOptions = Parameters<typeof Sdk.updateTenant>[0];
type updateTenantBody = (NonNullable<updateTenantOptions> extends { body?: infer B } ? B : never);
type updateUserOptions = Parameters<typeof Sdk.updateUser>[0];
type updateUserBody = (NonNullable<updateUserOptions> extends { body?: infer B } ? B : never);
/** Management of eventual consistency **/
type updateUserConsistency = { 
/** Management of eventual consistency tolerance. Set waitUpToMs to 0 to ignore eventual consistency. pollInterval is 500ms by default. */
    consistency: ConsistencyOptions<_DataOf<typeof Sdk.updateUser>> 
};
type updateUserTaskOptions = Parameters<typeof Sdk.updateUserTask>[0];
type updateUserTaskBody = (NonNullable<updateUserTaskOptions> extends { body?: infer B } ? B : never);
// === AUTO-GENERATED CAMUNDA SUPPORT TYPES END ===

// Cancelable primitive (kept lightweight & local)
export class CancelError extends Error { constructor(){ super('Cancelled'); this.name='CancelError'; } }
export interface CancelablePromise<T> extends Promise<T> { cancel(): void }
function toCancelable<T>(factory:(signal:AbortSignal)=>Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  const p: any = new Promise<T>((resolve,reject)=> { factory(ac.signal).then(resolve,reject); });
  p.cancel = ()=> ac.abort();
  return p as CancelablePromise<T>;
}

// New simplified input: we only accept an already hydrated CamundaConfig. Users wanting env
// overrides or partials should call hydrateConfig first (single source of truth) and pass
// the resulting config.
export interface CamundaOptions {
  // Strongly typed env-style overrides (CAMUNDA_* keys). Optional.
  config?: EnvOverrides;
  // Custom fetch implementation.
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  // Provide a custom env map (mainly for tests). Defaults to process.env.
  env?: Record<string,string|undefined>;
}

export function createCamunda(options?: CamundaOptions) { return new CamundaClient(options); }

export class CamundaClient {
  private _client: Client;
  private _config: CamundaConfig;
  private _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', verbose: false },
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: ''
  } as any);
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit)=>Promise<Response>;
  private _validation: ValidationManager = new ValidationManager({ req: 'none', res: 'none', verbose: false });

  private _overrides: EnvOverrides = {};

  constructor(opts: CamundaOptions = {}) {
    if (opts.config) this._overrides = { ...opts.config };
    const { config } = hydrateConfig({ overrides: this._overrides, env: opts.env });
    this._config = config;
    this._fetch = opts.fetch;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(this._config, { fetch: this._fetch });
  this._validation.update(this._config.validation);
  }

  get config() { return this._config; }

  // Merge new overrides and re-hydrate.
  configure(next: CamundaOptions) {
    if (next.config) this._overrides = { ...this._overrides, ...next.config };
    if (next.fetch) this._fetch = next.fetch;
    const { config } = hydrateConfig({ overrides: this._overrides, env: next.env });
    this._config = config;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(this._config, { fetch: this._fetch });
  this._validation.update(this._config.validation);
  }

  // Auth helpers
  async getAuthHeaders() { return this._auth.getAuthHeaders(); }
  async forceAuthRefresh() { return this._auth.forceRefresh(); }
  clearAuthCache(opts?: { disk?: boolean; memory?: boolean }) { this._auth.clearCache(opts); }
  onAuthHeaders(h: (headers: Record<string,string>) => Record<string,string>|Promise<Record<string,string>>) { this._auth.registerHeadersHook(h); }

  // Instance-scoped validation state (methods added by hand so template provides baseline)
  requestValidationMode() { return this._validation.settings.req; }
  responseValidationMode() { return this._validation.settings.res; }
  validationVerbose() { return this._validation.settings.verbose; }
  // Back-compat helper used in older tests expecting validationConfig()
  validationConfig() { return { req: this._validation.settings.req, res: this._validation.settings.res }; }
  async gateRequest(opId: string, schema: any, data: any) { return this._validation.gateRequest(opId, schema, data); }
  async gateResponse(opId: string, schema: any, data: any) { return this._validation.gateResponse(opId, schema, data); }

  // === AUTO-GENERATED CAMUNDA METHODS START ===
  // Generated methods (2025-09-02T00:58:59.158Z)
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
  activateAdHocSubProcessActivities(body: activateAdHocSubProcessActivitiesBody): CancelablePromise<_DataOf<typeof Sdk.activateAdHocSubProcessActivities>>;
  activateAdHocSubProcessActivities(options: activateAdHocSubProcessActivitiesOptions): CancelablePromise<_DataOf<typeof Sdk.activateAdHocSubProcessActivities>>;
  activateAdHocSubProcessActivities(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('activateAdHocSubProcessActivities', (Schemas as any).zActivateAdHocSubProcessActivitiesData || (Schemas as any).zactivateAdHocSubProcessActivitiesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.activateAdHocSubProcessActivities(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('activateAdHocSubProcessActivities', (Schemas as any).zActivateAdHocSubProcessActivitiesResponse || (Schemas as any).zactivateAdHocSubProcessActivitiesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('activateAdHocSubProcessActivities', (Schemas as any).zActivateAdHocSubProcessActivitiesData || (Schemas as any).zactivateAdHocSubProcessActivitiesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.activateAdHocSubProcessActivities({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('activateAdHocSubProcessActivities', (Schemas as any).zActivateAdHocSubProcessActivitiesResponse || (Schemas as any).zactivateAdHocSubProcessActivitiesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Activate jobs
   * Iterate through all known partitions and activate jobs up to the requested maximum.
   *
    *
   * @operationId activateJobs
   * @tags Job
   */
  activateJobs(body: activateJobsBody): CancelablePromise<_DataOf<typeof Sdk.activateJobs>>;
  activateJobs(options: activateJobsOptions): CancelablePromise<_DataOf<typeof Sdk.activateJobs>>;
  activateJobs(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('activateJobs', (Schemas as any).zActivateJobsData || (Schemas as any).zactivateJobsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.activateJobs(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('activateJobs', (Schemas as any).zActivateJobsResponse || (Schemas as any).zactivateJobsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('activateJobs', (Schemas as any).zActivateJobsData || (Schemas as any).zactivateJobsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.activateJobs({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('activateJobs', (Schemas as any).zActivateJobsResponse || (Schemas as any).zactivateJobsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a client to a group
   * Assigns a client to a group, making it a member of the group. Members of the group inherit the group authorizations, roles, and tenant assignments.
    *
   * @operationId assignClientToGroup
   * @tags Group
   */
  assignClientToGroup(options?: assignClientToGroupOptions): CancelablePromise<_DataOf<typeof Sdk.assignClientToGroup>>;
  assignClientToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignClientToGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignClientToGroup', (Schemas as any).zAssignClientToGroupResponse || (Schemas as any).zassignClientToGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a client to a tenant
   * Assign the client to the specified tenant. The client can then access tenant data and perform authorized actions.
    *
   * @operationId assignClientToTenant
   * @tags Tenant
   */
  assignClientToTenant(options?: assignClientToTenantOptions): CancelablePromise<_DataOf<typeof Sdk.assignClientToTenant>>;
  assignClientToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignClientToTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignClientToTenant', (Schemas as any).zAssignClientToTenantResponse || (Schemas as any).zassignClientToTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a group to a tenant
   * Assigns a group to a specified tenant. Group members (users, clients) can then access tenant data and perform authorized actions.
    *
   * @operationId assignGroupToTenant
   * @tags Tenant
   */
  assignGroupToTenant(options?: assignGroupToTenantOptions): CancelablePromise<_DataOf<typeof Sdk.assignGroupToTenant>>;
  assignGroupToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignGroupToTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignGroupToTenant', (Schemas as any).zAssignGroupToTenantResponse || (Schemas as any).zassignGroupToTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a mapping rule to a group
   * Assigns a mapping rule to a group.
   *
    *
   * @operationId assignMappingRuleToGroup
   * @tags Group
   */
  assignMappingRuleToGroup(options?: assignMappingRuleToGroupOptions): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToGroup>>;
  assignMappingRuleToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignMappingRuleToGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignMappingRuleToGroup', (Schemas as any).zAssignMappingRuleToGroupResponse || (Schemas as any).zassignMappingRuleToGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a mapping rule to a tenant
   * Assign a single mapping rule to a specified tenant.
    *
   * @operationId assignMappingRuleToTenant
   * @tags Tenant
   */
  assignMappingRuleToTenant(options?: assignMappingRuleToTenantOptions): CancelablePromise<_DataOf<typeof Sdk.assignMappingRuleToTenant>>;
  assignMappingRuleToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignMappingRuleToTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignMappingRuleToTenant', (Schemas as any).zAssignMappingRuleToTenantResponse || (Schemas as any).zassignMappingRuleToTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a role to a client
   * Assigns the specified role to the client.
   * The client will inherit the authorizations associated with this role.
    *
   * @operationId assignRoleToClient
   * @tags Role
   */
  assignRoleToClient(options?: assignRoleToClientOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToClient>>;
  assignRoleToClient(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignRoleToClient(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignRoleToClient', (Schemas as any).zAssignRoleToClientResponse || (Schemas as any).zassignRoleToClientResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a role to a group
   *  Assigns the specified role to the group.  Every member of the group (user or client) will inherit the authorizations associated with this role.
    *
   * @operationId assignRoleToGroup
   * @tags Role
   */
  assignRoleToGroup(options?: assignRoleToGroupOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToGroup>>;
  assignRoleToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignRoleToGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignRoleToGroup', (Schemas as any).zAssignRoleToGroupResponse || (Schemas as any).zassignRoleToGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a role to a mapping rule
   * Assigns a role to a mapping rule.
   *
    *
   * @operationId assignRoleToMappingRule
   * @tags Role
   */
  assignRoleToMappingRule(options?: assignRoleToMappingRuleOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToMappingRule>>;
  assignRoleToMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignRoleToMappingRule(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignRoleToMappingRule', (Schemas as any).zAssignRoleToMappingRuleResponse || (Schemas as any).zassignRoleToMappingRuleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a role to a tenant
   * Assigns a role to a specified tenant. Users, Clients or Groups, that have the role assigned, will get access to the tenant's data and can perform actions according to their authorizations.
    *
   * @operationId assignRoleToTenant
   * @tags Tenant
   */
  assignRoleToTenant(options?: assignRoleToTenantOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToTenant>>;
  assignRoleToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignRoleToTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignRoleToTenant', (Schemas as any).zAssignRoleToTenantResponse || (Schemas as any).zassignRoleToTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a role to a user
   * Assigns the specified role to the user. The user will inherit the authorizations associated with this role.
    *
   * @operationId assignRoleToUser
   * @tags Role
   */
  assignRoleToUser(options?: assignRoleToUserOptions): CancelablePromise<_DataOf<typeof Sdk.assignRoleToUser>>;
  assignRoleToUser(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignRoleToUser(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignRoleToUser', (Schemas as any).zAssignRoleToUserResponse || (Schemas as any).zassignRoleToUserResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign user task
   * Assigns a user task with the given key to the given assignee.
    *
   * @operationId assignUserTask
   * @tags User task
   */
  assignUserTask(body: assignUserTaskBody): CancelablePromise<_DataOf<typeof Sdk.assignUserTask>>;
  assignUserTask(options: assignUserTaskOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserTask>>;
  assignUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('assignUserTask', (Schemas as any).zAssignUserTaskData || (Schemas as any).zassignUserTaskData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.assignUserTask(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('assignUserTask', (Schemas as any).zAssignUserTaskResponse || (Schemas as any).zassignUserTaskResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('assignUserTask', (Schemas as any).zAssignUserTaskData || (Schemas as any).zassignUserTaskData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.assignUserTask({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignUserTask', (Schemas as any).zAssignUserTaskResponse || (Schemas as any).zassignUserTaskResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a user to a group
   * Assigns a user to a group, making the user a member of the group. Group members inherit the group authorizations, roles, and tenant assignments.
    *
   * @operationId assignUserToGroup
   * @tags Group
   */
  assignUserToGroup(options?: assignUserToGroupOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserToGroup>>;
  assignUserToGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignUserToGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignUserToGroup', (Schemas as any).zAssignUserToGroupResponse || (Schemas as any).zassignUserToGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Assign a user to a tenant
   * Assign a single user to a specified tenant. The user can then access tenant data and perform authorized actions.
    *
   * @operationId assignUserToTenant
   * @tags Tenant
   */
  assignUserToTenant(options?: assignUserToTenantOptions): CancelablePromise<_DataOf<typeof Sdk.assignUserToTenant>>;
  assignUserToTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.assignUserToTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('assignUserToTenant', (Schemas as any).zAssignUserToTenantResponse || (Schemas as any).zassignUserToTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Broadcast signal
   * Broadcasts a signal.
    *
   * @operationId broadcastSignal
   * @tags Signal
   */
  broadcastSignal(body: broadcastSignalBody): CancelablePromise<_DataOf<typeof Sdk.broadcastSignal>>;
  broadcastSignal(options: broadcastSignalOptions): CancelablePromise<_DataOf<typeof Sdk.broadcastSignal>>;
  broadcastSignal(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('broadcastSignal', (Schemas as any).zBroadcastSignalData || (Schemas as any).zbroadcastSignalData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.broadcastSignal(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('broadcastSignal', (Schemas as any).zBroadcastSignalResponse || (Schemas as any).zbroadcastSignalResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('broadcastSignal', (Schemas as any).zBroadcastSignalData || (Schemas as any).zbroadcastSignalData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.broadcastSignal({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('broadcastSignal', (Schemas as any).zBroadcastSignalResponse || (Schemas as any).zbroadcastSignalResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Cancel Batch operation
   * Cancels a running batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @operationId cancelBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  cancelBatchOperation(body: cancelBatchOperationBody, /** Management of eventual consistency **/ consistencyManagement: cancelBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.cancelBatchOperation>>;
  cancelBatchOperation(options: cancelBatchOperationOptions, /** Management of eventual consistency **/ consistencyManagement: cancelBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.cancelBatchOperation>>;
  cancelBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: cancelBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('cancelBatchOperation', (Schemas as any).zCancelBatchOperationData || (Schemas as any).zcancelBatchOperationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.cancelBatchOperation(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('cancelBatchOperation', (Schemas as any).zCancelBatchOperationResponse || (Schemas as any).zcancelBatchOperationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('cancelBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('cancelBatchOperation', (Schemas as any).zCancelBatchOperationData || (Schemas as any).zcancelBatchOperationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.cancelBatchOperation({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('cancelBatchOperation', (Schemas as any).zCancelBatchOperationResponse || (Schemas as any).zcancelBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('cancelBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Cancel process instance
   * Cancels a running process instance. As a cancelation includes more than just the removal of the process instance resource, the cancelation resource must be posted.
    *
   * @operationId cancelProcessInstance
   * @tags Process instance
   */
  cancelProcessInstance(body: cancelProcessInstanceBody): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstance>>;
  cancelProcessInstance(options: cancelProcessInstanceOptions): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstance>>;
  cancelProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('cancelProcessInstance', (Schemas as any).zCancelProcessInstanceData || (Schemas as any).zcancelProcessInstanceData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.cancelProcessInstance(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('cancelProcessInstance', (Schemas as any).zCancelProcessInstanceResponse || (Schemas as any).zcancelProcessInstanceResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('cancelProcessInstance', (Schemas as any).zCancelProcessInstanceData || (Schemas as any).zcancelProcessInstanceData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.cancelProcessInstance({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('cancelProcessInstance', (Schemas as any).zCancelProcessInstanceResponse || (Schemas as any).zcancelProcessInstanceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

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
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  cancelProcessInstancesBatchOperation(body: cancelProcessInstancesBatchOperationBody, /** Management of eventual consistency **/ consistencyManagement: cancelProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>>;
  cancelProcessInstancesBatchOperation(options: cancelProcessInstancesBatchOperationOptions, /** Management of eventual consistency **/ consistencyManagement: cancelProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>>;
  cancelProcessInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: cancelProcessInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('cancelProcessInstancesBatchOperation', (Schemas as any).zCancelProcessInstancesBatchOperationData || (Schemas as any).zcancelProcessInstancesBatchOperationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.cancelProcessInstancesBatchOperation(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('cancelProcessInstancesBatchOperation', (Schemas as any).zCancelProcessInstancesBatchOperationResponse || (Schemas as any).zcancelProcessInstancesBatchOperationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('cancelProcessInstancesBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('cancelProcessInstancesBatchOperation', (Schemas as any).zCancelProcessInstancesBatchOperationData || (Schemas as any).zcancelProcessInstancesBatchOperationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.cancelProcessInstancesBatchOperation({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('cancelProcessInstancesBatchOperation', (Schemas as any).zCancelProcessInstancesBatchOperationResponse || (Schemas as any).zcancelProcessInstancesBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('cancelProcessInstancesBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Complete job
   * Complete a job with the given payload, which allows completing the associated service task.
   *
    *
   * @operationId completeJob
   * @tags Job
   */
  completeJob(body: completeJobBody): CancelablePromise<_DataOf<typeof Sdk.completeJob>>;
  completeJob(options: completeJobOptions): CancelablePromise<_DataOf<typeof Sdk.completeJob>>;
  completeJob(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('completeJob', (Schemas as any).zCompleteJobData || (Schemas as any).zcompleteJobData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.completeJob(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('completeJob', (Schemas as any).zCompleteJobResponse || (Schemas as any).zcompleteJobResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('completeJob', (Schemas as any).zCompleteJobData || (Schemas as any).zcompleteJobData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.completeJob({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('completeJob', (Schemas as any).zCompleteJobResponse || (Schemas as any).zcompleteJobResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Complete user task
   * Completes a user task with the given key.
    *
   * @operationId completeUserTask
   * @tags User task
   */
  completeUserTask(body: completeUserTaskBody): CancelablePromise<_DataOf<typeof Sdk.completeUserTask>>;
  completeUserTask(options: completeUserTaskOptions): CancelablePromise<_DataOf<typeof Sdk.completeUserTask>>;
  completeUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('completeUserTask', (Schemas as any).zCompleteUserTaskData || (Schemas as any).zcompleteUserTaskData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.completeUserTask(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('completeUserTask', (Schemas as any).zCompleteUserTaskResponse || (Schemas as any).zcompleteUserTaskResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('completeUserTask', (Schemas as any).zCompleteUserTaskData || (Schemas as any).zcompleteUserTaskData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.completeUserTask({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('completeUserTask', (Schemas as any).zCompleteUserTaskResponse || (Schemas as any).zcompleteUserTaskResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

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
  correlateMessage(body: correlateMessageBody): CancelablePromise<_DataOf<typeof Sdk.correlateMessage>>;
  correlateMessage(options: correlateMessageOptions): CancelablePromise<_DataOf<typeof Sdk.correlateMessage>>;
  correlateMessage(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('correlateMessage', (Schemas as any).zCorrelateMessageData || (Schemas as any).zcorrelateMessageData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.correlateMessage(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('correlateMessage', (Schemas as any).zCorrelateMessageResponse || (Schemas as any).zcorrelateMessageResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('correlateMessage', (Schemas as any).zCorrelateMessageData || (Schemas as any).zcorrelateMessageData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.correlateMessage({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('correlateMessage', (Schemas as any).zCorrelateMessageResponse || (Schemas as any).zcorrelateMessageResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Create admin user
   * Creates a new user and assign the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
    *
   * @operationId createAdminUser
   * @tags Setup
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  createAdminUser(body: createAdminUserBody, /** Management of eventual consistency **/ consistencyManagement: createAdminUserConsistency): CancelablePromise<_DataOf<typeof Sdk.createAdminUser>>;
  createAdminUser(options: createAdminUserOptions, /** Management of eventual consistency **/ consistencyManagement: createAdminUserConsistency): CancelablePromise<_DataOf<typeof Sdk.createAdminUser>>;
  createAdminUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: createAdminUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createAdminUser', (Schemas as any).zCreateAdminUserData || (Schemas as any).zcreateAdminUserData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createAdminUser(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createAdminUser', (Schemas as any).zCreateAdminUserResponse || (Schemas as any).zcreateAdminUserResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('createAdminUser', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createAdminUser', (Schemas as any).zCreateAdminUserData || (Schemas as any).zcreateAdminUserData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createAdminUser({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createAdminUser', (Schemas as any).zCreateAdminUserResponse || (Schemas as any).zcreateAdminUserResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('createAdminUser', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Create authorization
   * Create the authorization.
    *
   * @operationId createAuthorization
   * @tags Authorization
   */
  createAuthorization(body: createAuthorizationBody): CancelablePromise<_DataOf<typeof Sdk.createAuthorization>>;
  createAuthorization(options: createAuthorizationOptions): CancelablePromise<_DataOf<typeof Sdk.createAuthorization>>;
  createAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createAuthorization', (Schemas as any).zCreateAuthorizationData || (Schemas as any).zcreateAuthorizationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createAuthorization(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createAuthorization', (Schemas as any).zCreateAuthorizationResponse || (Schemas as any).zcreateAuthorizationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createAuthorization', (Schemas as any).zCreateAuthorizationData || (Schemas as any).zcreateAuthorizationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createAuthorization({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createAuthorization', (Schemas as any).zCreateAuthorizationResponse || (Schemas as any).zcreateAuthorizationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Deploy resources
   * Deploys one or more resources (e.g. processes, decision models, or forms).
   * This is an atomic call, i.e. either all resources are deployed or none of them are.
   *
    *
   * @operationId createDeployment
   * @tags Resource
   */
  createDeployment(body: createDeploymentBody): CancelablePromise<_DataOf<typeof Sdk.createDeployment>>;
  createDeployment(options: createDeploymentOptions): CancelablePromise<_DataOf<typeof Sdk.createDeployment>>;
  createDeployment(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createDeployment', (Schemas as any).zCreateDeploymentData || (Schemas as any).zcreateDeploymentData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createDeployment(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createDeployment', (Schemas as any).zCreateDeploymentResponse || (Schemas as any).zcreateDeploymentResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createDeployment', (Schemas as any).zCreateDeploymentData || (Schemas as any).zcreateDeploymentData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createDeployment({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createDeployment', (Schemas as any).zCreateDeploymentResponse || (Schemas as any).zcreateDeploymentResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  createDocument(body: createDocumentBody): CancelablePromise<_DataOf<typeof Sdk.createDocument>>;
  createDocument(options: createDocumentOptions): CancelablePromise<_DataOf<typeof Sdk.createDocument>>;
  createDocument(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createDocument', (Schemas as any).zCreateDocumentData || (Schemas as any).zcreateDocumentData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createDocument(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createDocument', (Schemas as any).zCreateDocumentResponse || (Schemas as any).zcreateDocumentResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createDocument', (Schemas as any).zCreateDocumentData || (Schemas as any).zcreateDocumentData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createDocument({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createDocument', (Schemas as any).zCreateDocumentResponse || (Schemas as any).zcreateDocumentResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  createDocumentLink(body: createDocumentLinkBody): CancelablePromise<_DataOf<typeof Sdk.createDocumentLink>>;
  createDocumentLink(options: createDocumentLinkOptions): CancelablePromise<_DataOf<typeof Sdk.createDocumentLink>>;
  createDocumentLink(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createDocumentLink', (Schemas as any).zCreateDocumentLinkData || (Schemas as any).zcreateDocumentLinkData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createDocumentLink(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createDocumentLink', (Schemas as any).zCreateDocumentLinkResponse || (Schemas as any).zcreateDocumentLinkResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createDocumentLink', (Schemas as any).zCreateDocumentLinkData || (Schemas as any).zcreateDocumentLinkData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createDocumentLink({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createDocumentLink', (Schemas as any).zCreateDocumentLinkResponse || (Schemas as any).zcreateDocumentLinkResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  createDocuments(body: createDocumentsBody): CancelablePromise<_DataOf<typeof Sdk.createDocuments>>;
  createDocuments(options: createDocumentsOptions): CancelablePromise<_DataOf<typeof Sdk.createDocuments>>;
  createDocuments(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createDocuments', (Schemas as any).zCreateDocumentsData || (Schemas as any).zcreateDocumentsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createDocuments(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createDocuments', (Schemas as any).zCreateDocumentsResponse || (Schemas as any).zcreateDocumentsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createDocuments', (Schemas as any).zCreateDocumentsData || (Schemas as any).zcreateDocumentsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createDocuments({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createDocuments', (Schemas as any).zCreateDocumentsResponse || (Schemas as any).zcreateDocumentsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  createElementInstanceVariables(body: createElementInstanceVariablesBody): CancelablePromise<_DataOf<typeof Sdk.createElementInstanceVariables>>;
  createElementInstanceVariables(options: createElementInstanceVariablesOptions): CancelablePromise<_DataOf<typeof Sdk.createElementInstanceVariables>>;
  createElementInstanceVariables(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createElementInstanceVariables', (Schemas as any).zCreateElementInstanceVariablesData || (Schemas as any).zcreateElementInstanceVariablesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createElementInstanceVariables(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createElementInstanceVariables', (Schemas as any).zCreateElementInstanceVariablesResponse || (Schemas as any).zcreateElementInstanceVariablesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createElementInstanceVariables', (Schemas as any).zCreateElementInstanceVariablesData || (Schemas as any).zcreateElementInstanceVariablesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createElementInstanceVariables({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createElementInstanceVariables', (Schemas as any).zCreateElementInstanceVariablesResponse || (Schemas as any).zcreateElementInstanceVariablesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Create group
   * Create a new group.
   *
    *
   * @operationId createGroup
   * @tags Group
   */
  createGroup(body: createGroupBody): CancelablePromise<_DataOf<typeof Sdk.createGroup>>;
  createGroup(options: createGroupOptions): CancelablePromise<_DataOf<typeof Sdk.createGroup>>;
  createGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createGroup', (Schemas as any).zCreateGroupData || (Schemas as any).zcreateGroupData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createGroup(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createGroup', (Schemas as any).zCreateGroupResponse || (Schemas as any).zcreateGroupResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createGroup', (Schemas as any).zCreateGroupData || (Schemas as any).zcreateGroupData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createGroup({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createGroup', (Schemas as any).zCreateGroupResponse || (Schemas as any).zcreateGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Create mapping rule
   * Create a new mapping rule
   *
    *
   * @operationId createMappingRule
   * @tags Mapping rule
   */
  createMappingRule(body: createMappingRuleBody): CancelablePromise<_DataOf<typeof Sdk.createMappingRule>>;
  createMappingRule(options: createMappingRuleOptions): CancelablePromise<_DataOf<typeof Sdk.createMappingRule>>;
  createMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createMappingRule', (Schemas as any).zCreateMappingRuleData || (Schemas as any).zcreateMappingRuleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createMappingRule(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createMappingRule', (Schemas as any).zCreateMappingRuleResponse || (Schemas as any).zcreateMappingRuleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createMappingRule', (Schemas as any).zCreateMappingRuleData || (Schemas as any).zcreateMappingRuleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createMappingRule({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createMappingRule', (Schemas as any).zCreateMappingRuleResponse || (Schemas as any).zcreateMappingRuleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

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
  createProcessInstance(body: createProcessInstanceBody): CancelablePromise<_DataOf<typeof Sdk.createProcessInstance>>;
  createProcessInstance(options: createProcessInstanceOptions): CancelablePromise<_DataOf<typeof Sdk.createProcessInstance>>;
  createProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createProcessInstance', (Schemas as any).zCreateProcessInstanceData || (Schemas as any).zcreateProcessInstanceData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createProcessInstance(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createProcessInstance', (Schemas as any).zCreateProcessInstanceResponse || (Schemas as any).zcreateProcessInstanceResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createProcessInstance', (Schemas as any).zCreateProcessInstanceData || (Schemas as any).zcreateProcessInstanceData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createProcessInstance({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createProcessInstance', (Schemas as any).zCreateProcessInstanceResponse || (Schemas as any).zcreateProcessInstanceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Create role
   * Create a new role.
   *
    *
   * @operationId createRole
   * @tags Role
   */
  createRole(body: createRoleBody): CancelablePromise<_DataOf<typeof Sdk.createRole>>;
  createRole(options: createRoleOptions): CancelablePromise<_DataOf<typeof Sdk.createRole>>;
  createRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createRole', (Schemas as any).zCreateRoleData || (Schemas as any).zcreateRoleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createRole(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createRole', (Schemas as any).zCreateRoleResponse || (Schemas as any).zcreateRoleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createRole', (Schemas as any).zCreateRoleData || (Schemas as any).zcreateRoleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createRole({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createRole', (Schemas as any).zCreateRoleResponse || (Schemas as any).zcreateRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Create tenant
   * Creates a new tenant.
    *
   * @operationId createTenant
   * @tags Tenant
   */
  createTenant(body: createTenantBody): CancelablePromise<_DataOf<typeof Sdk.createTenant>>;
  createTenant(options: createTenantOptions): CancelablePromise<_DataOf<typeof Sdk.createTenant>>;
  createTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createTenant', (Schemas as any).zCreateTenantData || (Schemas as any).zcreateTenantData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createTenant(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createTenant', (Schemas as any).zCreateTenantResponse || (Schemas as any).zcreateTenantResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createTenant', (Schemas as any).zCreateTenantData || (Schemas as any).zcreateTenantData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createTenant({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createTenant', (Schemas as any).zCreateTenantResponse || (Schemas as any).zcreateTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Create user
   * Create a new user.
    *
   * @operationId createUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  createUser(body: createUserBody, /** Management of eventual consistency **/ consistencyManagement: createUserConsistency): CancelablePromise<_DataOf<typeof Sdk.createUser>>;
  createUser(options: createUserOptions, /** Management of eventual consistency **/ consistencyManagement: createUserConsistency): CancelablePromise<_DataOf<typeof Sdk.createUser>>;
  createUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: createUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('createUser', (Schemas as any).zCreateUserData || (Schemas as any).zcreateUserData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.createUser(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('createUser', (Schemas as any).zCreateUserResponse || (Schemas as any).zcreateUserResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('createUser', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('createUser', (Schemas as any).zCreateUserData || (Schemas as any).zcreateUserData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.createUser({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('createUser', (Schemas as any).zCreateUserResponse || (Schemas as any).zcreateUserResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('createUser', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Delete authorization
   * Deletes the authorization with the given key.
    *
   * @operationId deleteAuthorization
   * @tags Authorization
   */
  deleteAuthorization(options?: deleteAuthorizationOptions): CancelablePromise<_DataOf<typeof Sdk.deleteAuthorization>>;
  deleteAuthorization(authorizationKey: deleteAuthorizationPathParam): CancelablePromise<_DataOf<typeof Sdk.deleteAuthorization>>;
  deleteAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { authorizationKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.deleteAuthorization(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteAuthorization', (Schemas as any).zDeleteAuthorizationResponse || (Schemas as any).zdeleteAuthorizationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  deleteDocument(options?: deleteDocumentOptions): CancelablePromise<_DataOf<typeof Sdk.deleteDocument>>;
  deleteDocument(documentId: deleteDocumentPathParam): CancelablePromise<_DataOf<typeof Sdk.deleteDocument>>;
  deleteDocument(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { documentId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.deleteDocument(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteDocument', (Schemas as any).zDeleteDocumentResponse || (Schemas as any).zdeleteDocumentResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Delete group
   * Deletes the group with the given ID.
   *
    *
   * @operationId deleteGroup
   * @tags Group
   */
  deleteGroup(options?: deleteGroupOptions): CancelablePromise<_DataOf<typeof Sdk.deleteGroup>>;
  deleteGroup(groupId: deleteGroupPathParam): CancelablePromise<_DataOf<typeof Sdk.deleteGroup>>;
  deleteGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { groupId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.deleteGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteGroup', (Schemas as any).zDeleteGroupResponse || (Schemas as any).zdeleteGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Delete a mapping rule
   * Deletes the mapping rule with the given ID.
   *
    *
   * @operationId deleteMappingRule
   * @tags Mapping rule
   */
  deleteMappingRule(options?: deleteMappingRuleOptions): CancelablePromise<_DataOf<typeof Sdk.deleteMappingRule>>;
  deleteMappingRule(mappingRuleId: deleteMappingRulePathParam): CancelablePromise<_DataOf<typeof Sdk.deleteMappingRule>>;
  deleteMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { mappingRuleId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.deleteMappingRule(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteMappingRule', (Schemas as any).zDeleteMappingRuleResponse || (Schemas as any).zdeleteMappingRuleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  deleteResource(body: deleteResourceBody): CancelablePromise<_DataOf<typeof Sdk.deleteResource>>;
  deleteResource(options: deleteResourceOptions): CancelablePromise<_DataOf<typeof Sdk.deleteResource>>;
  deleteResource(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('deleteResource', (Schemas as any).zDeleteResourceData || (Schemas as any).zdeleteResourceData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.deleteResource(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('deleteResource', (Schemas as any).zDeleteResourceResponse || (Schemas as any).zdeleteResourceResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('deleteResource', (Schemas as any).zDeleteResourceData || (Schemas as any).zdeleteResourceData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.deleteResource({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteResource', (Schemas as any).zDeleteResourceResponse || (Schemas as any).zdeleteResourceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Delete role
   * Deletes the role with the given ID.
   *
    *
   * @operationId deleteRole
   * @tags Role
   */
  deleteRole(options?: deleteRoleOptions): CancelablePromise<_DataOf<typeof Sdk.deleteRole>>;
  deleteRole(roleId: deleteRolePathParam): CancelablePromise<_DataOf<typeof Sdk.deleteRole>>;
  deleteRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { roleId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.deleteRole(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteRole', (Schemas as any).zDeleteRoleResponse || (Schemas as any).zdeleteRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Delete tenant
   * Deletes an existing tenant.
    *
   * @operationId deleteTenant
   * @tags Tenant
   */
  deleteTenant(options?: deleteTenantOptions): CancelablePromise<_DataOf<typeof Sdk.deleteTenant>>;
  deleteTenant(tenantId: deleteTenantPathParam): CancelablePromise<_DataOf<typeof Sdk.deleteTenant>>;
  deleteTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { tenantId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.deleteTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteTenant', (Schemas as any).zDeleteTenantResponse || (Schemas as any).zdeleteTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Delete user
   * Deletes a user.
   *
    *
   * @operationId deleteUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  deleteUser(options: deleteUserOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: deleteUserConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteUser>>;
  deleteUser(username: deleteUserPathParam, /** Management of eventual consistency **/ consistencyManagement: deleteUserConsistency): CancelablePromise<_DataOf<typeof Sdk.deleteUser>>;
  deleteUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: deleteUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { username: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.deleteUser(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('deleteUser', (Schemas as any).zDeleteUserResponse || (Schemas as any).zdeleteUserResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('deleteUser', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

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
  evaluateDecision(body: evaluateDecisionBody): CancelablePromise<_DataOf<typeof Sdk.evaluateDecision>>;
  evaluateDecision(options: evaluateDecisionOptions): CancelablePromise<_DataOf<typeof Sdk.evaluateDecision>>;
  evaluateDecision(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('evaluateDecision', (Schemas as any).zEvaluateDecisionData || (Schemas as any).zevaluateDecisionData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.evaluateDecision(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('evaluateDecision', (Schemas as any).zEvaluateDecisionResponse || (Schemas as any).zevaluateDecisionResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('evaluateDecision', (Schemas as any).zEvaluateDecisionData || (Schemas as any).zevaluateDecisionData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.evaluateDecision({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('evaluateDecision', (Schemas as any).zEvaluateDecisionResponse || (Schemas as any).zevaluateDecisionResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Fail job
   * Mark the job as failed
   *
    *
   * @operationId failJob
   * @tags Job
   */
  failJob(body: failJobBody): CancelablePromise<_DataOf<typeof Sdk.failJob>>;
  failJob(options: failJobOptions): CancelablePromise<_DataOf<typeof Sdk.failJob>>;
  failJob(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('failJob', (Schemas as any).zFailJobData || (Schemas as any).zfailJobData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.failJob(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('failJob', (Schemas as any).zFailJobResponse || (Schemas as any).zfailJobResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('failJob', (Schemas as any).zFailJobData || (Schemas as any).zfailJobData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.failJob({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('failJob', (Schemas as any).zFailJobResponse || (Schemas as any).zfailJobResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Get current user
   * Retrieves the current authenticated user.
    *
   * @operationId getAuthentication
   * @tags Authentication
   */
  getAuthentication(options?: getAuthenticationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuthentication>>;
  getAuthentication(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getAuthentication(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getAuthentication', (Schemas as any).zGetAuthenticationResponse || (Schemas as any).zgetAuthenticationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Get authorization
   * Get authorization by the given key.
    *
   * @operationId getAuthorization
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getAuthorization(options: getAuthorizationOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency): CancelablePromise<_DataOf<typeof Sdk.getAuthorization>>;
  getAuthorization(authorizationKey: getAuthorizationPathParam, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency): CancelablePromise<_DataOf<typeof Sdk.getAuthorization>>;
  getAuthorization(arg: any, /** Management of eventual consistency **/ consistencyManagement: getAuthorizationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { authorizationKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getAuthorization(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getAuthorization', (Schemas as any).zGetAuthorizationResponse || (Schemas as any).zgetAuthorizationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getAuthorization', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get batch operation
   * Get batch operation by key.
    *
   * @operationId getBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getBatchOperation(options: getBatchOperationOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.getBatchOperation>>;
  getBatchOperation(batchOperationKey: getBatchOperationPathParam, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.getBatchOperation>>;
  getBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: getBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { batchOperationKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getBatchOperation(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getBatchOperation', (Schemas as any).zGetBatchOperationResponse || (Schemas as any).zgetBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getBatchOperation', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get decision definition
   * Returns a decision definition by key.
   *
    *
   * @operationId getDecisionDefinition
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinition(options: getDecisionDefinitionOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinition>>;
  getDecisionDefinition(decisionDefinitionKey: getDecisionDefinitionPathParam, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinition>>;
  getDecisionDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { decisionDefinitionKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getDecisionDefinition(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getDecisionDefinition', (Schemas as any).zGetDecisionDefinitionResponse || (Schemas as any).zgetDecisionDefinitionResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getDecisionDefinition', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get decision definition XML
   * Returns decision definition as XML.
   *
    *
   * @operationId getDecisionDefinitionXML
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionDefinitionXml(options: getDecisionDefinitionXmlOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinitionXml>>;
  getDecisionDefinitionXml(decisionDefinitionKey: getDecisionDefinitionXmlPathParam, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinitionXml>>;
  getDecisionDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionDefinitionXmlConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { decisionDefinitionKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getDecisionDefinitionXml(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getDecisionDefinitionXML', (Schemas as any).zGetDecisionDefinitionXmlResponse || (Schemas as any).zgetDecisionDefinitionXmlResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getDecisionDefinitionXML', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get decision instance
   * Returns a decision instance.
   *
    *
   * @operationId getDecisionInstance
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionInstance(options: getDecisionInstanceOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionInstance>>;
  getDecisionInstance(decisionEvaluationInstanceKey: getDecisionInstancePathParam, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionInstance>>;
  getDecisionInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { decisionEvaluationInstanceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getDecisionInstance(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getDecisionInstance', (Schemas as any).zGetDecisionInstanceResponse || (Schemas as any).zgetDecisionInstanceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getDecisionInstance', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get decision requirements
   * Returns Decision Requirements as JSON.
   *
    *
   * @operationId getDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirements(options: getDecisionRequirementsOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirements>>;
  getDecisionRequirements(decisionRequirementsKey: getDecisionRequirementsPathParam, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirements>>;
  getDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { decisionRequirementsKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getDecisionRequirements(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getDecisionRequirements', (Schemas as any).zGetDecisionRequirementsResponse || (Schemas as any).zgetDecisionRequirementsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getDecisionRequirements', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get decision requirements XML
   * Returns decision requirements as XML.
   *
    *
   * @operationId getDecisionRequirementsXML
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getDecisionRequirementsXml(options: getDecisionRequirementsXmlOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirementsXml>>;
  getDecisionRequirementsXml(decisionRequirementsKey: getDecisionRequirementsXmlPathParam, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirementsXml>>;
  getDecisionRequirementsXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getDecisionRequirementsXmlConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { decisionRequirementsKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getDecisionRequirementsXml(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getDecisionRequirementsXML', (Schemas as any).zGetDecisionRequirementsXmlResponse || (Schemas as any).zgetDecisionRequirementsXmlResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getDecisionRequirementsXML', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

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
  getDocument(options?: getDocumentOptions): CancelablePromise<_DataOf<typeof Sdk.getDocument>>;
  getDocument(documentId: getDocumentPathParam): CancelablePromise<_DataOf<typeof Sdk.getDocument>>;
  getDocument(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { documentId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getDocument(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getDocument', (Schemas as any).zGetDocumentResponse || (Schemas as any).zgetDocumentResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Get element instance
   * Returns element instance as JSON.
   *
    *
   * @operationId getElementInstance
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getElementInstance(options: getElementInstanceOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getElementInstance>>;
  getElementInstance(elementInstanceKey: getElementInstancePathParam, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getElementInstance>>;
  getElementInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getElementInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { elementInstanceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getElementInstance(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getElementInstance', (Schemas as any).zGetElementInstanceResponse || (Schemas as any).zgetElementInstanceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getElementInstance', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get group
   * Get a group by its ID.
   *
    *
   * @operationId getGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getGroup(options: getGroupOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.getGroup>>;
  getGroup(groupId: getGroupPathParam, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.getGroup>>;
  getGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: getGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { groupId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getGroup', (Schemas as any).zGetGroupResponse || (Schemas as any).zgetGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getGroup', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get incident
   * Returns incident as JSON.
   *
    *
   * @operationId getIncident
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getIncident(options: getIncidentOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency): CancelablePromise<_DataOf<typeof Sdk.getIncident>>;
  getIncident(incidentKey: getIncidentPathParam, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency): CancelablePromise<_DataOf<typeof Sdk.getIncident>>;
  getIncident(arg: any, /** Management of eventual consistency **/ consistencyManagement: getIncidentConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { incidentKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getIncident(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getIncident', (Schemas as any).zGetIncidentResponse || (Schemas as any).zgetIncidentResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getIncident', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get license status
   * Obtains the status of the current Camunda license.
    *
   * @operationId getLicense
   * @tags License
   */
  getLicense(options?: getLicenseOptions): CancelablePromise<_DataOf<typeof Sdk.getLicense>>;
  getLicense(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getLicense(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getLicense', (Schemas as any).zGetLicenseResponse || (Schemas as any).zgetLicenseResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Get a mapping rule
   * Gets the mapping rule with the given ID.
   *
    *
   * @operationId getMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getMappingRule(options: getMappingRuleOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency): CancelablePromise<_DataOf<typeof Sdk.getMappingRule>>;
  getMappingRule(mappingRuleId: getMappingRulePathParam, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency): CancelablePromise<_DataOf<typeof Sdk.getMappingRule>>;
  getMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: getMappingRuleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { mappingRuleId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getMappingRule(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getMappingRule', (Schemas as any).zGetMappingRuleResponse || (Schemas as any).zgetMappingRuleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getMappingRule', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get process definition
   * Returns process definition as JSON.
   *
    *
   * @operationId getProcessDefinition
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinition(options: getProcessDefinitionOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinition>>;
  getProcessDefinition(processDefinitionKey: getProcessDefinitionPathParam, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinition>>;
  getProcessDefinition(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { processDefinitionKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getProcessDefinition(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getProcessDefinition', (Schemas as any).zGetProcessDefinitionResponse || (Schemas as any).zgetProcessDefinitionResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getProcessDefinition', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get process definition statistics
   * Get statistics about elements in currently running process instances by process definition key and search filter.
   *
    *
   * @operationId getProcessDefinitionStatistics
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionStatistics(body: getProcessDefinitionStatisticsBody, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
  getProcessDefinitionStatistics(options: getProcessDefinitionStatisticsOptions, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
  getProcessDefinitionStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('getProcessDefinitionStatistics', (Schemas as any).zGetProcessDefinitionStatisticsData || (Schemas as any).zgetProcessDefinitionStatisticsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.getProcessDefinitionStatistics(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('getProcessDefinitionStatistics', (Schemas as any).zGetProcessDefinitionStatisticsResponse || (Schemas as any).zgetProcessDefinitionStatisticsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('getProcessDefinitionStatistics', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('getProcessDefinitionStatistics', (Schemas as any).zGetProcessDefinitionStatisticsData || (Schemas as any).zgetProcessDefinitionStatisticsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.getProcessDefinitionStatistics({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getProcessDefinitionStatistics', (Schemas as any).zGetProcessDefinitionStatisticsResponse || (Schemas as any).zgetProcessDefinitionStatisticsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getProcessDefinitionStatistics', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get process definition XML
   * Returns process definition as XML.
   *
    *
   * @operationId getProcessDefinitionXML
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessDefinitionXml(options: getProcessDefinitionXmlOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionXml>>;
  getProcessDefinitionXml(processDefinitionKey: getProcessDefinitionXmlPathParam, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionXml>>;
  getProcessDefinitionXml(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessDefinitionXmlConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { processDefinitionKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getProcessDefinitionXml(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getProcessDefinitionXML', (Schemas as any).zGetProcessDefinitionXmlResponse || (Schemas as any).zgetProcessDefinitionXmlResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getProcessDefinitionXML', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get process instance
   * Get the process instance by the process instance key.
   *
    *
   * @operationId getProcessInstance
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstance(options: getProcessInstanceOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstance>>;
  getProcessInstance(processInstanceKey: getProcessInstancePathParam, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstance>>;
  getProcessInstance(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { processInstanceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getProcessInstance(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getProcessInstance', (Schemas as any).zGetProcessInstanceResponse || (Schemas as any).zgetProcessInstanceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getProcessInstance', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get call hierarchy for process instance
   * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
   *
    *
   * @operationId getProcessInstanceCallHierarchy
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceCallHierarchy(options: getProcessInstanceCallHierarchyOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>>;
  getProcessInstanceCallHierarchy(processInstanceKey: getProcessInstanceCallHierarchyPathParam, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>>;
  getProcessInstanceCallHierarchy(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceCallHierarchyConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { processInstanceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getProcessInstanceCallHierarchy(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getProcessInstanceCallHierarchy', (Schemas as any).zGetProcessInstanceCallHierarchyResponse || (Schemas as any).zgetProcessInstanceCallHierarchyResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getProcessInstanceCallHierarchy', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get process instance sequence flows
   * Get sequence flows taken by the process instance.
   *
    *
   * @operationId getProcessInstanceSequenceFlows
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceSequenceFlows(options: getProcessInstanceSequenceFlowsOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>>;
  getProcessInstanceSequenceFlows(processInstanceKey: getProcessInstanceSequenceFlowsPathParam, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>>;
  getProcessInstanceSequenceFlows(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceSequenceFlowsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { processInstanceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getProcessInstanceSequenceFlows(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getProcessInstanceSequenceFlows', (Schemas as any).zGetProcessInstanceSequenceFlowsResponse || (Schemas as any).zgetProcessInstanceSequenceFlowsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getProcessInstanceSequenceFlows', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get process instance statistics
   * Get statistics about elements by the process instance key.
   *
    *
   * @operationId getProcessInstanceStatistics
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getProcessInstanceStatistics(options: getProcessInstanceStatisticsOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatistics>>;
  getProcessInstanceStatistics(processInstanceKey: getProcessInstanceStatisticsPathParam, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatistics>>;
  getProcessInstanceStatistics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getProcessInstanceStatisticsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { processInstanceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getProcessInstanceStatistics(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getProcessInstanceStatistics', (Schemas as any).zGetProcessInstanceStatisticsResponse || (Schemas as any).zgetProcessInstanceStatisticsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getProcessInstanceStatistics', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
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
  getResource(options?: getResourceOptions): CancelablePromise<_DataOf<typeof Sdk.getResource>>;
  getResource(resourceKey: getResourcePathParam): CancelablePromise<_DataOf<typeof Sdk.getResource>>;
  getResource(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { resourceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getResource(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getResource', (Schemas as any).zGetResourceResponse || (Schemas as any).zgetResourceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  getResourceContent(options?: getResourceContentOptions): CancelablePromise<_DataOf<typeof Sdk.getResourceContent>>;
  getResourceContent(resourceKey: getResourceContentPathParam): CancelablePromise<_DataOf<typeof Sdk.getResourceContent>>;
  getResourceContent(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { resourceKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getResourceContent(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getResourceContent', (Schemas as any).zGetResourceContentResponse || (Schemas as any).zgetResourceContentResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Get role
   * Get a role by its ID.
   *
    *
   * @operationId getRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getRole(options: getRoleOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.getRole>>;
  getRole(roleId: getRolePathParam, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.getRole>>;
  getRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: getRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { roleId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getRole(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getRole', (Schemas as any).zGetRoleResponse || (Schemas as any).zgetRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getRole', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
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
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getStartProcessForm(options: getStartProcessFormOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency): CancelablePromise<_DataOf<typeof Sdk.getStartProcessForm>>;
  getStartProcessForm(processDefinitionKey: getStartProcessFormPathParam, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency): CancelablePromise<_DataOf<typeof Sdk.getStartProcessForm>>;
  getStartProcessForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getStartProcessFormConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { processDefinitionKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getStartProcessForm(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getStartProcessForm', (Schemas as any).zGetStartProcessFormResponse || (Schemas as any).zgetStartProcessFormResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getStartProcessForm', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get tenant
   * Retrieves a single tenant by tenant ID.
    *
   * @operationId getTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getTenant(options: getTenantOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.getTenant>>;
  getTenant(tenantId: getTenantPathParam, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.getTenant>>;
  getTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: getTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { tenantId: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getTenant', (Schemas as any).zGetTenantResponse || (Schemas as any).zgetTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getTenant', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get cluster topology
   * Obtains the current topology of the cluster the gateway is part of.
    *
   * @operationId getTopology
   * @tags Cluster
   */
  getTopology(options?: getTopologyOptions): CancelablePromise<_DataOf<typeof Sdk.getTopology>>;
  getTopology(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getTopology(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getTopology', (Schemas as any).zGetTopologyResponse || (Schemas as any).zgetTopologyResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Get usage metrics
   * Retrieve the usage metrics based on given criteria.
    *
   * @operationId getUsageMetrics
   * @tags System
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUsageMetrics(options: getUsageMetricsOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency): CancelablePromise<_DataOf<typeof Sdk.getUsageMetrics>>;
  getUsageMetrics(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUsageMetricsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getUsageMetrics(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getUsageMetrics', (Schemas as any).zGetUsageMetricsResponse || (Schemas as any).zgetUsageMetricsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getUsageMetrics', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get user
   * Get a user by its username.
   *
    *
   * @operationId getUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUser(options: getUserOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency): CancelablePromise<_DataOf<typeof Sdk.getUser>>;
  getUser(username: getUserPathParam, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency): CancelablePromise<_DataOf<typeof Sdk.getUser>>;
  getUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { username: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getUser(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getUser', (Schemas as any).zGetUserResponse || (Schemas as any).zgetUserResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getUser', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get user task
   * Get the user task by the user task key.
   *
    *
   * @operationId getUserTask
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTask(options: getUserTaskOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency): CancelablePromise<_DataOf<typeof Sdk.getUserTask>>;
  getUserTask(userTaskKey: getUserTaskPathParam, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency): CancelablePromise<_DataOf<typeof Sdk.getUserTask>>;
  getUserTask(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { userTaskKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getUserTask(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getUserTask', (Schemas as any).zGetUserTaskResponse || (Schemas as any).zgetUserTaskResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getUserTask', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
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
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getUserTaskForm(options: getUserTaskFormOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency): CancelablePromise<_DataOf<typeof Sdk.getUserTaskForm>>;
  getUserTaskForm(userTaskKey: getUserTaskFormPathParam, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency): CancelablePromise<_DataOf<typeof Sdk.getUserTaskForm>>;
  getUserTaskForm(arg: any, /** Management of eventual consistency **/ consistencyManagement: getUserTaskFormConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { userTaskKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getUserTaskForm(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getUserTaskForm', (Schemas as any).zGetUserTaskFormResponse || (Schemas as any).zgetUserTaskFormResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getUserTaskForm', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Get variable
   * Get the variable by the variable key.
   *
    *
   * @operationId getVariable
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  getVariable(options: getVariableOptions | undefined, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency): CancelablePromise<_DataOf<typeof Sdk.getVariable>>;
  getVariable(variableKey: getVariablePathParam, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency): CancelablePromise<_DataOf<typeof Sdk.getVariable>>;
  getVariable(arg: any, /** Management of eventual consistency **/ consistencyManagement: getVariableConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { variableKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.getVariable(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('getVariable', (Schemas as any).zGetVariableResponse || (Schemas as any).zgetVariableResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('getVariable', true, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
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
  migrateProcessInstance(body: migrateProcessInstanceBody): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstance>>;
  migrateProcessInstance(options: migrateProcessInstanceOptions): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstance>>;
  migrateProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('migrateProcessInstance', (Schemas as any).zMigrateProcessInstanceData || (Schemas as any).zmigrateProcessInstanceData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.migrateProcessInstance(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('migrateProcessInstance', (Schemas as any).zMigrateProcessInstanceResponse || (Schemas as any).zmigrateProcessInstanceResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('migrateProcessInstance', (Schemas as any).zMigrateProcessInstanceData || (Schemas as any).zmigrateProcessInstanceData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.migrateProcessInstance({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('migrateProcessInstance', (Schemas as any).zMigrateProcessInstanceResponse || (Schemas as any).zmigrateProcessInstanceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

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
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  migrateProcessInstancesBatchOperation(body: migrateProcessInstancesBatchOperationBody, /** Management of eventual consistency **/ consistencyManagement: migrateProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>>;
  migrateProcessInstancesBatchOperation(options: migrateProcessInstancesBatchOperationOptions, /** Management of eventual consistency **/ consistencyManagement: migrateProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>>;
  migrateProcessInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: migrateProcessInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('migrateProcessInstancesBatchOperation', (Schemas as any).zMigrateProcessInstancesBatchOperationData || (Schemas as any).zmigrateProcessInstancesBatchOperationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.migrateProcessInstancesBatchOperation(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('migrateProcessInstancesBatchOperation', (Schemas as any).zMigrateProcessInstancesBatchOperationResponse || (Schemas as any).zmigrateProcessInstancesBatchOperationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('migrateProcessInstancesBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('migrateProcessInstancesBatchOperation', (Schemas as any).zMigrateProcessInstancesBatchOperationData || (Schemas as any).zmigrateProcessInstancesBatchOperationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.migrateProcessInstancesBatchOperation({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('migrateProcessInstancesBatchOperation', (Schemas as any).zMigrateProcessInstancesBatchOperationResponse || (Schemas as any).zmigrateProcessInstancesBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('migrateProcessInstancesBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
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
  modifyProcessInstance(body: modifyProcessInstanceBody): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstance>>;
  modifyProcessInstance(options: modifyProcessInstanceOptions): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstance>>;
  modifyProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('modifyProcessInstance', (Schemas as any).zModifyProcessInstanceData || (Schemas as any).zmodifyProcessInstanceData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.modifyProcessInstance(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('modifyProcessInstance', (Schemas as any).zModifyProcessInstanceResponse || (Schemas as any).zmodifyProcessInstanceResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('modifyProcessInstance', (Schemas as any).zModifyProcessInstanceData || (Schemas as any).zmodifyProcessInstanceData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.modifyProcessInstance({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('modifyProcessInstance', (Schemas as any).zModifyProcessInstanceResponse || (Schemas as any).zmodifyProcessInstanceResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

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
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  modifyProcessInstancesBatchOperation(body: modifyProcessInstancesBatchOperationBody, /** Management of eventual consistency **/ consistencyManagement: modifyProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>>;
  modifyProcessInstancesBatchOperation(options: modifyProcessInstancesBatchOperationOptions, /** Management of eventual consistency **/ consistencyManagement: modifyProcessInstancesBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>>;
  modifyProcessInstancesBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: modifyProcessInstancesBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('modifyProcessInstancesBatchOperation', (Schemas as any).zModifyProcessInstancesBatchOperationData || (Schemas as any).zmodifyProcessInstancesBatchOperationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.modifyProcessInstancesBatchOperation(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('modifyProcessInstancesBatchOperation', (Schemas as any).zModifyProcessInstancesBatchOperationResponse || (Schemas as any).zmodifyProcessInstancesBatchOperationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('modifyProcessInstancesBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('modifyProcessInstancesBatchOperation', (Schemas as any).zModifyProcessInstancesBatchOperationData || (Schemas as any).zmodifyProcessInstancesBatchOperationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.modifyProcessInstancesBatchOperation({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('modifyProcessInstancesBatchOperation', (Schemas as any).zModifyProcessInstancesBatchOperationResponse || (Schemas as any).zmodifyProcessInstancesBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('modifyProcessInstancesBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

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
  pinClock(body: pinClockBody): CancelablePromise<_DataOf<typeof Sdk.pinClock>>;
  pinClock(options: pinClockOptions): CancelablePromise<_DataOf<typeof Sdk.pinClock>>;
  pinClock(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('pinClock', (Schemas as any).zPinClockData || (Schemas as any).zpinClockData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.pinClock(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('pinClock', (Schemas as any).zPinClockResponse || (Schemas as any).zpinClockResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('pinClock', (Schemas as any).zPinClockData || (Schemas as any).zpinClockData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.pinClock({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('pinClock', (Schemas as any).zPinClockResponse || (Schemas as any).zpinClockResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

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
  publishMessage(body: publishMessageBody): CancelablePromise<_DataOf<typeof Sdk.publishMessage>>;
  publishMessage(options: publishMessageOptions): CancelablePromise<_DataOf<typeof Sdk.publishMessage>>;
  publishMessage(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('publishMessage', (Schemas as any).zPublishMessageData || (Schemas as any).zpublishMessageData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.publishMessage(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('publishMessage', (Schemas as any).zPublishMessageResponse || (Schemas as any).zpublishMessageResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('publishMessage', (Schemas as any).zPublishMessageData || (Schemas as any).zpublishMessageData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.publishMessage({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('publishMessage', (Schemas as any).zPublishMessageResponse || (Schemas as any).zpublishMessageResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
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
  resetClock(options?: resetClockOptions): CancelablePromise<_DataOf<typeof Sdk.resetClock>>;
  resetClock(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.resetClock(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('resetClock', (Schemas as any).zResetClockResponse || (Schemas as any).zresetClockResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Resolve incident
   * Marks the incident as resolved; most likely a call to Update job will be necessary to reset the job’s retries, followed by this call.
   *
    *
   * @operationId resolveIncident
   * @tags Incident
   */
  resolveIncident(body: resolveIncidentBody): CancelablePromise<_DataOf<typeof Sdk.resolveIncident>>;
  resolveIncident(options: resolveIncidentOptions): CancelablePromise<_DataOf<typeof Sdk.resolveIncident>>;
  resolveIncident(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('resolveIncident', (Schemas as any).zResolveIncidentData || (Schemas as any).zresolveIncidentData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.resolveIncident(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('resolveIncident', (Schemas as any).zResolveIncidentResponse || (Schemas as any).zresolveIncidentResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('resolveIncident', (Schemas as any).zResolveIncidentData || (Schemas as any).zresolveIncidentData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.resolveIncident({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('resolveIncident', (Schemas as any).zResolveIncidentResponse || (Schemas as any).zresolveIncidentResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

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
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  resolveIncidentsBatchOperation(body: resolveIncidentsBatchOperationBody, /** Management of eventual consistency **/ consistencyManagement: resolveIncidentsBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>>;
  resolveIncidentsBatchOperation(options: resolveIncidentsBatchOperationOptions, /** Management of eventual consistency **/ consistencyManagement: resolveIncidentsBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>>;
  resolveIncidentsBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: resolveIncidentsBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('resolveIncidentsBatchOperation', (Schemas as any).zResolveIncidentsBatchOperationData || (Schemas as any).zresolveIncidentsBatchOperationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.resolveIncidentsBatchOperation(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('resolveIncidentsBatchOperation', (Schemas as any).zResolveIncidentsBatchOperationResponse || (Schemas as any).zresolveIncidentsBatchOperationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('resolveIncidentsBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('resolveIncidentsBatchOperation', (Schemas as any).zResolveIncidentsBatchOperationData || (Schemas as any).zresolveIncidentsBatchOperationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.resolveIncidentsBatchOperation({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('resolveIncidentsBatchOperation', (Schemas as any).zResolveIncidentsBatchOperationResponse || (Schemas as any).zresolveIncidentsBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('resolveIncidentsBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Resume Batch operation
   * Resumes a suspended batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @operationId resumeBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  resumeBatchOperation(body: resumeBatchOperationBody, /** Management of eventual consistency **/ consistencyManagement: resumeBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.resumeBatchOperation>>;
  resumeBatchOperation(options: resumeBatchOperationOptions, /** Management of eventual consistency **/ consistencyManagement: resumeBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.resumeBatchOperation>>;
  resumeBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: resumeBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('resumeBatchOperation', (Schemas as any).zResumeBatchOperationData || (Schemas as any).zresumeBatchOperationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.resumeBatchOperation(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('resumeBatchOperation', (Schemas as any).zResumeBatchOperationResponse || (Schemas as any).zresumeBatchOperationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('resumeBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('resumeBatchOperation', (Schemas as any).zResumeBatchOperationData || (Schemas as any).zresumeBatchOperationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.resumeBatchOperation({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('resumeBatchOperation', (Schemas as any).zResumeBatchOperationResponse || (Schemas as any).zresumeBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('resumeBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search authorizations
   * Search for authorizations based on given criteria.
   *
    *
   * @operationId searchAuthorizations
   * @tags Authorization
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchAuthorizations(body: searchAuthorizationsBody, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchAuthorizations>>;
  searchAuthorizations(options: searchAuthorizationsOptions, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchAuthorizations>>;
  searchAuthorizations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchAuthorizationsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchAuthorizations', (Schemas as any).zSearchAuthorizationsData || (Schemas as any).zsearchAuthorizationsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchAuthorizations(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchAuthorizations', (Schemas as any).zSearchAuthorizationsResponse || (Schemas as any).zsearchAuthorizationsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchAuthorizations', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchAuthorizations', (Schemas as any).zSearchAuthorizationsData || (Schemas as any).zsearchAuthorizationsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchAuthorizations({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchAuthorizations', (Schemas as any).zSearchAuthorizationsResponse || (Schemas as any).zsearchAuthorizationsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchAuthorizations', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search batch operation items
   * Search for batch operation items based on given criteria.
    *
   * @operationId searchBatchOperationItems
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperationItems(body: searchBatchOperationItemsBody, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperationItems>>;
  searchBatchOperationItems(options: searchBatchOperationItemsOptions, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperationItems>>;
  searchBatchOperationItems(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationItemsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchBatchOperationItems', (Schemas as any).zSearchBatchOperationItemsData || (Schemas as any).zsearchBatchOperationItemsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchBatchOperationItems(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchBatchOperationItems', (Schemas as any).zSearchBatchOperationItemsResponse || (Schemas as any).zsearchBatchOperationItemsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchBatchOperationItems', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchBatchOperationItems', (Schemas as any).zSearchBatchOperationItemsData || (Schemas as any).zsearchBatchOperationItemsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchBatchOperationItems({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchBatchOperationItems', (Schemas as any).zSearchBatchOperationItemsResponse || (Schemas as any).zsearchBatchOperationItemsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchBatchOperationItems', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search batch operations
   * Search for batch operations based on given criteria.
    *
   * @operationId searchBatchOperations
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchBatchOperations(body: searchBatchOperationsBody, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperations>>;
  searchBatchOperations(options: searchBatchOperationsOptions, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperations>>;
  searchBatchOperations(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchBatchOperationsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchBatchOperations', (Schemas as any).zSearchBatchOperationsData || (Schemas as any).zsearchBatchOperationsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchBatchOperations(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchBatchOperations', (Schemas as any).zSearchBatchOperationsResponse || (Schemas as any).zsearchBatchOperationsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchBatchOperations', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchBatchOperations', (Schemas as any).zSearchBatchOperationsData || (Schemas as any).zsearchBatchOperationsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchBatchOperations({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchBatchOperations', (Schemas as any).zSearchBatchOperationsResponse || (Schemas as any).zsearchBatchOperationsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchBatchOperations', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search group clients
   * Search clients assigned to a group.
   *
    *
   * @operationId searchClientsForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForGroup(body: searchClientsForGroupBody, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForGroup>>;
  searchClientsForGroup(options: searchClientsForGroupOptions, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForGroup>>;
  searchClientsForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchClientsForGroup', (Schemas as any).zSearchClientsForGroupData || (Schemas as any).zsearchClientsForGroupData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchClientsForGroup(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchClientsForGroup', (Schemas as any).zSearchClientsForGroupResponse || (Schemas as any).zsearchClientsForGroupResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchClientsForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchClientsForGroup', (Schemas as any).zSearchClientsForGroupData || (Schemas as any).zsearchClientsForGroupData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchClientsForGroup({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchClientsForGroup', (Schemas as any).zSearchClientsForGroupResponse || (Schemas as any).zsearchClientsForGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchClientsForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search role clients
   * Search clients with assigned role.
   *
    *
   * @operationId searchClientsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForRole(body: searchClientsForRoleBody, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForRole>>;
  searchClientsForRole(options: searchClientsForRoleOptions, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForRole>>;
  searchClientsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchClientsForRole', (Schemas as any).zSearchClientsForRoleData || (Schemas as any).zsearchClientsForRoleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchClientsForRole(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchClientsForRole', (Schemas as any).zSearchClientsForRoleResponse || (Schemas as any).zsearchClientsForRoleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchClientsForRole', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchClientsForRole', (Schemas as any).zSearchClientsForRoleData || (Schemas as any).zsearchClientsForRoleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchClientsForRole({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchClientsForRole', (Schemas as any).zSearchClientsForRoleResponse || (Schemas as any).zsearchClientsForRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchClientsForRole', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search clients for tenant
   * Retrieves a filtered and sorted list of clients for a specified tenant.
    *
   * @operationId searchClientsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchClientsForTenant(body: searchClientsForTenantBody, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForTenant>>;
  searchClientsForTenant(options: searchClientsForTenantOptions, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchClientsForTenant>>;
  searchClientsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchClientsForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchClientsForTenant', (Schemas as any).zSearchClientsForTenantData || (Schemas as any).zsearchClientsForTenantData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchClientsForTenant(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchClientsForTenant', (Schemas as any).zSearchClientsForTenantResponse || (Schemas as any).zsearchClientsForTenantResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchClientsForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchClientsForTenant', (Schemas as any).zSearchClientsForTenantData || (Schemas as any).zsearchClientsForTenantData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchClientsForTenant({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchClientsForTenant', (Schemas as any).zSearchClientsForTenantResponse || (Schemas as any).zsearchClientsForTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchClientsForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search decision definitions
   * Search for decision definitions based on given criteria.
   *
    *
   * @operationId searchDecisionDefinitions
   * @tags Decision definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionDefinitions(body: searchDecisionDefinitionsBody, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionDefinitions>>;
  searchDecisionDefinitions(options: searchDecisionDefinitionsOptions, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionDefinitions>>;
  searchDecisionDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionDefinitionsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchDecisionDefinitions', (Schemas as any).zSearchDecisionDefinitionsData || (Schemas as any).zsearchDecisionDefinitionsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchDecisionDefinitions(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchDecisionDefinitions', (Schemas as any).zSearchDecisionDefinitionsResponse || (Schemas as any).zsearchDecisionDefinitionsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchDecisionDefinitions', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchDecisionDefinitions', (Schemas as any).zSearchDecisionDefinitionsData || (Schemas as any).zsearchDecisionDefinitionsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchDecisionDefinitions({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchDecisionDefinitions', (Schemas as any).zSearchDecisionDefinitionsResponse || (Schemas as any).zsearchDecisionDefinitionsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchDecisionDefinitions', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search decision instances
   * Search for decision instances based on given criteria.
   *
    *
   * @operationId searchDecisionInstances
   * @tags Decision instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionInstances(body: searchDecisionInstancesBody, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionInstances>>;
  searchDecisionInstances(options: searchDecisionInstancesOptions, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionInstances>>;
  searchDecisionInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionInstancesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchDecisionInstances', (Schemas as any).zSearchDecisionInstancesData || (Schemas as any).zsearchDecisionInstancesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchDecisionInstances(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchDecisionInstances', (Schemas as any).zSearchDecisionInstancesResponse || (Schemas as any).zsearchDecisionInstancesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchDecisionInstances', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchDecisionInstances', (Schemas as any).zSearchDecisionInstancesData || (Schemas as any).zsearchDecisionInstancesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchDecisionInstances({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchDecisionInstances', (Schemas as any).zSearchDecisionInstancesResponse || (Schemas as any).zsearchDecisionInstancesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchDecisionInstances', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search decision requirements
   * Search for decision requirements based on given criteria.
   *
    *
   * @operationId searchDecisionRequirements
   * @tags Decision requirements
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchDecisionRequirements(body: searchDecisionRequirementsBody, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionRequirements>>;
  searchDecisionRequirements(options: searchDecisionRequirementsOptions, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchDecisionRequirements>>;
  searchDecisionRequirements(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchDecisionRequirementsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchDecisionRequirements', (Schemas as any).zSearchDecisionRequirementsData || (Schemas as any).zsearchDecisionRequirementsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchDecisionRequirements(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchDecisionRequirements', (Schemas as any).zSearchDecisionRequirementsResponse || (Schemas as any).zsearchDecisionRequirementsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchDecisionRequirements', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchDecisionRequirements', (Schemas as any).zSearchDecisionRequirementsData || (Schemas as any).zsearchDecisionRequirementsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchDecisionRequirements({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchDecisionRequirements', (Schemas as any).zSearchDecisionRequirementsResponse || (Schemas as any).zsearchDecisionRequirementsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchDecisionRequirements', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search element instances
   * Search for element instances based on given criteria.
   *
    *
   * @operationId searchElementInstances
   * @tags Element instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchElementInstances(body: searchElementInstancesBody, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchElementInstances>>;
  searchElementInstances(options: searchElementInstancesOptions, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchElementInstances>>;
  searchElementInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchElementInstancesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchElementInstances', (Schemas as any).zSearchElementInstancesData || (Schemas as any).zsearchElementInstancesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchElementInstances(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchElementInstances', (Schemas as any).zSearchElementInstancesResponse || (Schemas as any).zsearchElementInstancesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchElementInstances', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchElementInstances', (Schemas as any).zSearchElementInstancesData || (Schemas as any).zsearchElementInstancesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchElementInstances({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchElementInstances', (Schemas as any).zSearchElementInstancesResponse || (Schemas as any).zsearchElementInstancesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchElementInstances', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search groups for tenant
   * Retrieves a filtered and sorted list of groups for a specified tenant.
    *
   * @operationId searchGroupIdsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupIdsForTenant(body: searchGroupIdsForTenantBody, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroupIdsForTenant>>;
  searchGroupIdsForTenant(options: searchGroupIdsForTenantOptions, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroupIdsForTenant>>;
  searchGroupIdsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupIdsForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchGroupIdsForTenant', (Schemas as any).zSearchGroupIdsForTenantData || (Schemas as any).zsearchGroupIdsForTenantData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchGroupIdsForTenant(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchGroupIdsForTenant', (Schemas as any).zSearchGroupIdsForTenantResponse || (Schemas as any).zsearchGroupIdsForTenantResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchGroupIdsForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchGroupIdsForTenant', (Schemas as any).zSearchGroupIdsForTenantData || (Schemas as any).zsearchGroupIdsForTenantData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchGroupIdsForTenant({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchGroupIdsForTenant', (Schemas as any).zSearchGroupIdsForTenantResponse || (Schemas as any).zsearchGroupIdsForTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchGroupIdsForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search groups
   * Search for groups based on given criteria.
   *
    *
   * @operationId searchGroups
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroups(body: searchGroupsBody, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroups>>;
  searchGroups(options: searchGroupsOptions, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroups>>;
  searchGroups(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchGroups', (Schemas as any).zSearchGroupsData || (Schemas as any).zsearchGroupsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchGroups(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchGroups', (Schemas as any).zSearchGroupsResponse || (Schemas as any).zsearchGroupsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchGroups', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchGroups', (Schemas as any).zSearchGroupsData || (Schemas as any).zsearchGroupsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchGroups({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchGroups', (Schemas as any).zSearchGroupsResponse || (Schemas as any).zsearchGroupsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchGroups', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search role groups
   * Search groups with assigned role.
   *
    *
   * @operationId searchGroupsForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchGroupsForRole(body: searchGroupsForRoleBody, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroupsForRole>>;
  searchGroupsForRole(options: searchGroupsForRoleOptions, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchGroupsForRole>>;
  searchGroupsForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchGroupsForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchGroupsForRole', (Schemas as any).zSearchGroupsForRoleData || (Schemas as any).zsearchGroupsForRoleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchGroupsForRole(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchGroupsForRole', (Schemas as any).zSearchGroupsForRoleResponse || (Schemas as any).zsearchGroupsForRoleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchGroupsForRole', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchGroupsForRole', (Schemas as any).zSearchGroupsForRoleData || (Schemas as any).zsearchGroupsForRoleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchGroupsForRole({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchGroupsForRole', (Schemas as any).zSearchGroupsForRoleResponse || (Schemas as any).zsearchGroupsForRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchGroupsForRole', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search incidents
   * Search for incidents based on given criteria.
   *
    *
   * @operationId searchIncidents
   * @tags Incident
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchIncidents(body: searchIncidentsBody, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchIncidents>>;
  searchIncidents(options: searchIncidentsOptions, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchIncidents>>;
  searchIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchIncidentsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchIncidents', (Schemas as any).zSearchIncidentsData || (Schemas as any).zsearchIncidentsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchIncidents(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchIncidents', (Schemas as any).zSearchIncidentsResponse || (Schemas as any).zsearchIncidentsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchIncidents', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchIncidents', (Schemas as any).zSearchIncidentsData || (Schemas as any).zsearchIncidentsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchIncidents({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchIncidents', (Schemas as any).zSearchIncidentsResponse || (Schemas as any).zsearchIncidentsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchIncidents', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search jobs
   * Search for jobs based on given criteria.
    *
   * @operationId searchJobs
   * @tags Job
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchJobs(body: searchJobsBody, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchJobs>>;
  searchJobs(options: searchJobsOptions, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchJobs>>;
  searchJobs(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchJobsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchJobs', (Schemas as any).zSearchJobsData || (Schemas as any).zsearchJobsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchJobs(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchJobs', (Schemas as any).zSearchJobsResponse || (Schemas as any).zsearchJobsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchJobs', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchJobs', (Schemas as any).zSearchJobsData || (Schemas as any).zsearchJobsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchJobs({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchJobs', (Schemas as any).zSearchJobsResponse || (Schemas as any).zsearchJobsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchJobs', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search mapping rules
   * Search for mapping rules based on given criteria.
   *
    *
   * @operationId searchMappingRule
   * @tags Mapping rule
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRule(body: searchMappingRuleBody, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRule>>;
  searchMappingRule(options: searchMappingRuleOptions, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRule>>;
  searchMappingRule(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRuleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchMappingRule', (Schemas as any).zSearchMappingRuleData || (Schemas as any).zsearchMappingRuleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchMappingRule(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchMappingRule', (Schemas as any).zSearchMappingRuleResponse || (Schemas as any).zsearchMappingRuleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchMappingRule', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchMappingRule', (Schemas as any).zSearchMappingRuleData || (Schemas as any).zsearchMappingRuleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchMappingRule({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchMappingRule', (Schemas as any).zSearchMappingRuleResponse || (Schemas as any).zsearchMappingRuleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchMappingRule', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search group mapping rules
   * Search mapping rules assigned to a group.
   *
    *
   * @operationId searchMappingRulesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForGroup(body: searchMappingRulesForGroupBody, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForGroup>>;
  searchMappingRulesForGroup(options: searchMappingRulesForGroupOptions, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForGroup>>;
  searchMappingRulesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchMappingRulesForGroup', (Schemas as any).zSearchMappingRulesForGroupData || (Schemas as any).zsearchMappingRulesForGroupData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchMappingRulesForGroup(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchMappingRulesForGroup', (Schemas as any).zSearchMappingRulesForGroupResponse || (Schemas as any).zsearchMappingRulesForGroupResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchMappingRulesForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchMappingRulesForGroup', (Schemas as any).zSearchMappingRulesForGroupData || (Schemas as any).zsearchMappingRulesForGroupData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchMappingRulesForGroup({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchMappingRulesForGroup', (Schemas as any).zSearchMappingRulesForGroupResponse || (Schemas as any).zsearchMappingRulesForGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchMappingRulesForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search role mapping rules
   * Search mapping rules with assigned role.
   *
    *
   * @operationId searchMappingRulesForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingRulesForRole(body: searchMappingRulesForRoleBody, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForRole>>;
  searchMappingRulesForRole(options: searchMappingRulesForRoleOptions, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForRole>>;
  searchMappingRulesForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingRulesForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchMappingRulesForRole', (Schemas as any).zSearchMappingRulesForRoleData || (Schemas as any).zsearchMappingRulesForRoleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchMappingRulesForRole(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchMappingRulesForRole', (Schemas as any).zSearchMappingRulesForRoleResponse || (Schemas as any).zsearchMappingRulesForRoleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchMappingRulesForRole', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchMappingRulesForRole', (Schemas as any).zSearchMappingRulesForRoleData || (Schemas as any).zsearchMappingRulesForRoleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchMappingRulesForRole({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchMappingRulesForRole', (Schemas as any).zSearchMappingRulesForRoleResponse || (Schemas as any).zsearchMappingRulesForRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchMappingRulesForRole', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search mapping rules for tenant
   * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
    *
   * @operationId searchMappingsForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMappingsForTenant(body: searchMappingsForTenantBody, /** Management of eventual consistency **/ consistencyManagement: searchMappingsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingsForTenant>>;
  searchMappingsForTenant(options: searchMappingsForTenantOptions, /** Management of eventual consistency **/ consistencyManagement: searchMappingsForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMappingsForTenant>>;
  searchMappingsForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMappingsForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchMappingsForTenant', (Schemas as any).zSearchMappingsForTenantData || (Schemas as any).zsearchMappingsForTenantData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchMappingsForTenant(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchMappingsForTenant', (Schemas as any).zSearchMappingsForTenantResponse || (Schemas as any).zsearchMappingsForTenantResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchMappingsForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchMappingsForTenant', (Schemas as any).zSearchMappingsForTenantData || (Schemas as any).zsearchMappingsForTenantData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchMappingsForTenant({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchMappingsForTenant', (Schemas as any).zSearchMappingsForTenantResponse || (Schemas as any).zsearchMappingsForTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchMappingsForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search message subscriptions
   * Search for message subscriptions based on given criteria.
   *
    *
   * @operationId searchMessageSubscriptions
   * @tags Message subscription
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchMessageSubscriptions(body: searchMessageSubscriptionsBody, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMessageSubscriptions>>;
  searchMessageSubscriptions(options: searchMessageSubscriptionsOptions, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchMessageSubscriptions>>;
  searchMessageSubscriptions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchMessageSubscriptionsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchMessageSubscriptions', (Schemas as any).zSearchMessageSubscriptionsData || (Schemas as any).zsearchMessageSubscriptionsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchMessageSubscriptions(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchMessageSubscriptions', (Schemas as any).zSearchMessageSubscriptionsResponse || (Schemas as any).zsearchMessageSubscriptionsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchMessageSubscriptions', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchMessageSubscriptions', (Schemas as any).zSearchMessageSubscriptionsData || (Schemas as any).zsearchMessageSubscriptionsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchMessageSubscriptions({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchMessageSubscriptions', (Schemas as any).zSearchMessageSubscriptionsResponse || (Schemas as any).zsearchMessageSubscriptionsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchMessageSubscriptions', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search process definitions
   * Search for process definitions based on given criteria.
   *
    *
   * @operationId searchProcessDefinitions
   * @tags Process definition
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessDefinitions(body: searchProcessDefinitionsBody, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitions>>;
  searchProcessDefinitions(options: searchProcessDefinitionsOptions, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitions>>;
  searchProcessDefinitions(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessDefinitionsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchProcessDefinitions', (Schemas as any).zSearchProcessDefinitionsData || (Schemas as any).zsearchProcessDefinitionsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchProcessDefinitions(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchProcessDefinitions', (Schemas as any).zSearchProcessDefinitionsResponse || (Schemas as any).zsearchProcessDefinitionsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchProcessDefinitions', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchProcessDefinitions', (Schemas as any).zSearchProcessDefinitionsData || (Schemas as any).zsearchProcessDefinitionsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchProcessDefinitions({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchProcessDefinitions', (Schemas as any).zSearchProcessDefinitionsResponse || (Schemas as any).zsearchProcessDefinitionsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchProcessDefinitions', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search for incidents associated with a process instance
   * Search for incidents caused by the process instance or any of its called process or decision instances.
   *
    *
   * @operationId searchProcessInstanceIncidents
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstanceIncidents(body: searchProcessInstanceIncidentsBody, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
  searchProcessInstanceIncidents(options: searchProcessInstanceIncidentsOptions, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
  searchProcessInstanceIncidents(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstanceIncidentsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchProcessInstanceIncidents', (Schemas as any).zSearchProcessInstanceIncidentsData || (Schemas as any).zsearchProcessInstanceIncidentsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchProcessInstanceIncidents(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchProcessInstanceIncidents', (Schemas as any).zSearchProcessInstanceIncidentsResponse || (Schemas as any).zsearchProcessInstanceIncidentsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchProcessInstanceIncidents', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchProcessInstanceIncidents', (Schemas as any).zSearchProcessInstanceIncidentsData || (Schemas as any).zsearchProcessInstanceIncidentsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchProcessInstanceIncidents({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchProcessInstanceIncidents', (Schemas as any).zSearchProcessInstanceIncidentsResponse || (Schemas as any).zsearchProcessInstanceIncidentsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchProcessInstanceIncidents', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search process instances
   * Search for process instances based on given criteria.
   *
    *
   * @operationId searchProcessInstances
   * @tags Process instance
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchProcessInstances(body: searchProcessInstancesBody, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstances>>;
  searchProcessInstances(options: searchProcessInstancesOptions, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstances>>;
  searchProcessInstances(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchProcessInstancesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchProcessInstances', (Schemas as any).zSearchProcessInstancesData || (Schemas as any).zsearchProcessInstancesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchProcessInstances(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchProcessInstances', (Schemas as any).zSearchProcessInstancesResponse || (Schemas as any).zsearchProcessInstancesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchProcessInstances', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchProcessInstances', (Schemas as any).zSearchProcessInstancesData || (Schemas as any).zsearchProcessInstancesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchProcessInstances({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchProcessInstances', (Schemas as any).zSearchProcessInstancesResponse || (Schemas as any).zsearchProcessInstancesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchProcessInstances', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search roles
   * Search for roles based on given criteria.
   *
    *
   * @operationId searchRoles
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRoles(body: searchRolesBody, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRoles>>;
  searchRoles(options: searchRolesOptions, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRoles>>;
  searchRoles(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchRoles', (Schemas as any).zSearchRolesData || (Schemas as any).zsearchRolesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchRoles(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchRoles', (Schemas as any).zSearchRolesResponse || (Schemas as any).zsearchRolesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchRoles', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchRoles', (Schemas as any).zSearchRolesData || (Schemas as any).zsearchRolesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchRoles({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchRoles', (Schemas as any).zSearchRolesResponse || (Schemas as any).zsearchRolesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchRoles', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search group roles
   * Search roles assigned to a group.
   *
    *
   * @operationId searchRolesForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForGroup(body: searchRolesForGroupBody, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRolesForGroup>>;
  searchRolesForGroup(options: searchRolesForGroupOptions, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRolesForGroup>>;
  searchRolesForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchRolesForGroup', (Schemas as any).zSearchRolesForGroupData || (Schemas as any).zsearchRolesForGroupData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchRolesForGroup(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchRolesForGroup', (Schemas as any).zSearchRolesForGroupResponse || (Schemas as any).zsearchRolesForGroupResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchRolesForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchRolesForGroup', (Schemas as any).zSearchRolesForGroupData || (Schemas as any).zsearchRolesForGroupData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchRolesForGroup({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchRolesForGroup', (Schemas as any).zSearchRolesForGroupResponse || (Schemas as any).zsearchRolesForGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchRolesForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search roles for tenant
   * Retrieves a filtered and sorted list of roles for a specified tenant.
    *
   * @operationId searchRolesForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchRolesForTenant(body: searchRolesForTenantBody, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRolesForTenant>>;
  searchRolesForTenant(options: searchRolesForTenantOptions, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchRolesForTenant>>;
  searchRolesForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchRolesForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchRolesForTenant', (Schemas as any).zSearchRolesForTenantData || (Schemas as any).zsearchRolesForTenantData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchRolesForTenant(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchRolesForTenant', (Schemas as any).zSearchRolesForTenantResponse || (Schemas as any).zsearchRolesForTenantResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchRolesForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchRolesForTenant', (Schemas as any).zSearchRolesForTenantData || (Schemas as any).zsearchRolesForTenantData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchRolesForTenant({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchRolesForTenant', (Schemas as any).zSearchRolesForTenantResponse || (Schemas as any).zsearchRolesForTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchRolesForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search tenants
   * Retrieves a filtered and sorted list of tenants.
    *
   * @operationId searchTenants
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchTenants(body: searchTenantsBody, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchTenants>>;
  searchTenants(options: searchTenantsOptions, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency): CancelablePromise<_DataOf<typeof Sdk.searchTenants>>;
  searchTenants(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchTenantsConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchTenants', (Schemas as any).zSearchTenantsData || (Schemas as any).zsearchTenantsData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchTenants(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchTenants', (Schemas as any).zSearchTenantsResponse || (Schemas as any).zsearchTenantsResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchTenants', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchTenants', (Schemas as any).zSearchTenantsData || (Schemas as any).zsearchTenantsData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchTenants({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchTenants', (Schemas as any).zSearchTenantsResponse || (Schemas as any).zsearchTenantsResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchTenants', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search users
   * Search for users based on given criteria.
   *
    *
   * @operationId searchUsers
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsers(body: searchUsersBody, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsers>>;
  searchUsers(options: searchUsersOptions, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsers>>;
  searchUsers(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchUsers', (Schemas as any).zSearchUsersData || (Schemas as any).zsearchUsersData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchUsers(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchUsers', (Schemas as any).zSearchUsersResponse || (Schemas as any).zsearchUsersResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchUsers', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchUsers', (Schemas as any).zSearchUsersData || (Schemas as any).zsearchUsersData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchUsers({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchUsers', (Schemas as any).zSearchUsersResponse || (Schemas as any).zsearchUsersResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchUsers', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search group users
   * Search users assigned to a group.
   *
    *
   * @operationId searchUsersForGroup
   * @tags Group
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForGroup(body: searchUsersForGroupBody, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForGroup>>;
  searchUsersForGroup(options: searchUsersForGroupOptions, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForGroup>>;
  searchUsersForGroup(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForGroupConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchUsersForGroup', (Schemas as any).zSearchUsersForGroupData || (Schemas as any).zsearchUsersForGroupData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchUsersForGroup(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchUsersForGroup', (Schemas as any).zSearchUsersForGroupResponse || (Schemas as any).zsearchUsersForGroupResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchUsersForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchUsersForGroup', (Schemas as any).zSearchUsersForGroupData || (Schemas as any).zsearchUsersForGroupData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchUsersForGroup({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchUsersForGroup', (Schemas as any).zSearchUsersForGroupResponse || (Schemas as any).zsearchUsersForGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchUsersForGroup', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search role users
   * Search users with assigned role.
   *
    *
   * @operationId searchUsersForRole
   * @tags Role
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForRole(body: searchUsersForRoleBody, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForRole>>;
  searchUsersForRole(options: searchUsersForRoleOptions, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForRole>>;
  searchUsersForRole(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForRoleConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchUsersForRole', (Schemas as any).zSearchUsersForRoleData || (Schemas as any).zsearchUsersForRoleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchUsersForRole(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchUsersForRole', (Schemas as any).zSearchUsersForRoleResponse || (Schemas as any).zsearchUsersForRoleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchUsersForRole', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchUsersForRole', (Schemas as any).zSearchUsersForRoleData || (Schemas as any).zsearchUsersForRoleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchUsersForRole({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchUsersForRole', (Schemas as any).zSearchUsersForRoleResponse || (Schemas as any).zsearchUsersForRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchUsersForRole', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search users for tenant
   * Retrieves a filtered and sorted list of users for a specified tenant.
    *
   * @operationId searchUsersForTenant
   * @tags Tenant
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUsersForTenant(body: searchUsersForTenantBody, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForTenant>>;
  searchUsersForTenant(options: searchUsersForTenantOptions, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUsersForTenant>>;
  searchUsersForTenant(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUsersForTenantConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchUsersForTenant', (Schemas as any).zSearchUsersForTenantData || (Schemas as any).zsearchUsersForTenantData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchUsersForTenant(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchUsersForTenant', (Schemas as any).zSearchUsersForTenantResponse || (Schemas as any).zsearchUsersForTenantResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchUsersForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchUsersForTenant', (Schemas as any).zSearchUsersForTenantData || (Schemas as any).zsearchUsersForTenantData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchUsersForTenant({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchUsersForTenant', (Schemas as any).zSearchUsersForTenantResponse || (Schemas as any).zsearchUsersForTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchUsersForTenant', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search user tasks
   * Search for user tasks based on given criteria.
   *
    *
   * @operationId searchUserTasks
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTasks(body: searchUserTasksBody, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUserTasks>>;
  searchUserTasks(options: searchUserTasksOptions, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUserTasks>>;
  searchUserTasks(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTasksConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchUserTasks', (Schemas as any).zSearchUserTasksData || (Schemas as any).zsearchUserTasksData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchUserTasks(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchUserTasks', (Schemas as any).zSearchUserTasksResponse || (Schemas as any).zsearchUserTasksResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchUserTasks', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchUserTasks', (Schemas as any).zSearchUserTasksData || (Schemas as any).zsearchUserTasksData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchUserTasks({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchUserTasks', (Schemas as any).zSearchUserTasksResponse || (Schemas as any).zsearchUserTasksResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchUserTasks', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search user task variables
   * Search for user task variables based on given criteria.
   *
    *
   * @operationId searchUserTaskVariables
   * @tags User task
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchUserTaskVariables(body: searchUserTaskVariablesBody, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskVariables>>;
  searchUserTaskVariables(options: searchUserTaskVariablesOptions, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskVariables>>;
  searchUserTaskVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchUserTaskVariablesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchUserTaskVariables', (Schemas as any).zSearchUserTaskVariablesData || (Schemas as any).zsearchUserTaskVariablesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchUserTaskVariables(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchUserTaskVariables', (Schemas as any).zSearchUserTaskVariablesResponse || (Schemas as any).zsearchUserTaskVariablesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchUserTaskVariables', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchUserTaskVariables', (Schemas as any).zSearchUserTaskVariablesData || (Schemas as any).zsearchUserTaskVariablesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchUserTaskVariables({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchUserTaskVariables', (Schemas as any).zSearchUserTaskVariablesResponse || (Schemas as any).zsearchUserTaskVariablesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchUserTaskVariables', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Search variables
   * Search for process and local variables based on given criteria.
   *
    *
   * @operationId searchVariables
   * @tags Variable
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  searchVariables(body: searchVariablesBody, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchVariables>>;
  searchVariables(options: searchVariablesOptions, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency): CancelablePromise<_DataOf<typeof Sdk.searchVariables>>;
  searchVariables(arg: any, /** Management of eventual consistency **/ consistencyManagement: searchVariablesConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('searchVariables', (Schemas as any).zSearchVariablesData || (Schemas as any).zsearchVariablesData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.searchVariables(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('searchVariables', (Schemas as any).zSearchVariablesResponse || (Schemas as any).zsearchVariablesResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('searchVariables', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('searchVariables', (Schemas as any).zSearchVariablesData || (Schemas as any).zsearchVariablesData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.searchVariables({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('searchVariables', (Schemas as any).zSearchVariablesResponse || (Schemas as any).zsearchVariablesResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('searchVariables', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Suspend Batch operation
   * Suspends a running batch operation.
   * This is done asynchronously, the progress can be tracked using the batch operation status endpoint (/batch-operations/{batchOperationKey}).
   *
    *
   * @operationId suspendBatchOperation
   * @tags Batch operation
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  suspendBatchOperation(body: suspendBatchOperationBody, /** Management of eventual consistency **/ consistencyManagement: suspendBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.suspendBatchOperation>>;
  suspendBatchOperation(options: suspendBatchOperationOptions, /** Management of eventual consistency **/ consistencyManagement: suspendBatchOperationConsistency): CancelablePromise<_DataOf<typeof Sdk.suspendBatchOperation>>;
  suspendBatchOperation(arg: any, /** Management of eventual consistency **/ consistencyManagement: suspendBatchOperationConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('suspendBatchOperation', (Schemas as any).zSuspendBatchOperationData || (Schemas as any).zsuspendBatchOperationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.suspendBatchOperation(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('suspendBatchOperation', (Schemas as any).zSuspendBatchOperationResponse || (Schemas as any).zsuspendBatchOperationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('suspendBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('suspendBatchOperation', (Schemas as any).zSuspendBatchOperationData || (Schemas as any).zsuspendBatchOperationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.suspendBatchOperation({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('suspendBatchOperation', (Schemas as any).zSuspendBatchOperationResponse || (Schemas as any).zsuspendBatchOperationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('suspendBatchOperation', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Throw error for job
   * Reports a business error (i.e. non-technical) that occurs while processing a job.
   *
    *
   * @operationId throwJobError
   * @tags Job
   */
  throwJobError(body: throwJobErrorBody): CancelablePromise<_DataOf<typeof Sdk.throwJobError>>;
  throwJobError(options: throwJobErrorOptions): CancelablePromise<_DataOf<typeof Sdk.throwJobError>>;
  throwJobError(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('throwJobError', (Schemas as any).zThrowJobErrorData || (Schemas as any).zthrowJobErrorData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.throwJobError(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('throwJobError', (Schemas as any).zThrowJobErrorResponse || (Schemas as any).zthrowJobErrorResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('throwJobError', (Schemas as any).zThrowJobErrorData || (Schemas as any).zthrowJobErrorData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.throwJobError({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('throwJobError', (Schemas as any).zThrowJobErrorResponse || (Schemas as any).zthrowJobErrorResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a client from a group
   * Unassigns a client from a group.
   * The client is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
    *
   * @operationId unassignClientFromGroup
   * @tags Group
   */
  unassignClientFromGroup(options?: unassignClientFromGroupOptions): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromGroup>>;
  unassignClientFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignClientFromGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignClientFromGroup', (Schemas as any).zUnassignClientFromGroupResponse || (Schemas as any).zunassignClientFromGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a client from a tenant
   * Unassigns the client from the specified tenant. The client can no longer access tenant data.
    *
   * @operationId unassignClientFromTenant
   * @tags Tenant
   */
  unassignClientFromTenant(options?: unassignClientFromTenantOptions): CancelablePromise<_DataOf<typeof Sdk.unassignClientFromTenant>>;
  unassignClientFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignClientFromTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignClientFromTenant', (Schemas as any).zUnassignClientFromTenantResponse || (Schemas as any).zunassignClientFromTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a group from a tenant
   * Unassigns a group from a specified tenant. Members of the group (users, clients) will no longer have access to the tenant's data - except they are assigned directly to the tenant.
    *
   * @operationId unassignGroupFromTenant
   * @tags Tenant
   */
  unassignGroupFromTenant(options?: unassignGroupFromTenantOptions): CancelablePromise<_DataOf<typeof Sdk.unassignGroupFromTenant>>;
  unassignGroupFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignGroupFromTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignGroupFromTenant', (Schemas as any).zUnassignGroupFromTenantResponse || (Schemas as any).zunassignGroupFromTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a mapping rule from a group
   * Unassigns a mapping rule from a group.
   *
    *
   * @operationId unassignMappingRuleFromGroup
   * @tags Group
   */
  unassignMappingRuleFromGroup(options?: unassignMappingRuleFromGroupOptions): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromGroup>>;
  unassignMappingRuleFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignMappingRuleFromGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignMappingRuleFromGroup', (Schemas as any).zUnassignMappingRuleFromGroupResponse || (Schemas as any).zunassignMappingRuleFromGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a mapping rule from a tenant
   * Unassigns a single mapping rule from a specified tenant without deleting the rule.
    *
   * @operationId unassignMappingRuleFromTenant
   * @tags Tenant
   */
  unassignMappingRuleFromTenant(options?: unassignMappingRuleFromTenantOptions): CancelablePromise<_DataOf<typeof Sdk.unassignMappingRuleFromTenant>>;
  unassignMappingRuleFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignMappingRuleFromTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignMappingRuleFromTenant', (Schemas as any).zUnassignMappingRuleFromTenantResponse || (Schemas as any).zunassignMappingRuleFromTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a role from a client
   *  Unassigns the specified role from the client.  The client will no longer inherit the authorizations associated with this role.
    *
   * @operationId unassignRoleFromClient
   * @tags Role
   */
  unassignRoleFromClient(options?: unassignRoleFromClientOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromClient>>;
  unassignRoleFromClient(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignRoleFromClient(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignRoleFromClient', (Schemas as any).zUnassignRoleFromClientResponse || (Schemas as any).zunassignRoleFromClientResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a role from a group
   * Unassigns the specified role from the group. All group members (user or client) no longer inherit the authorizations associated with this role.
    *
   * @operationId unassignRoleFromGroup
   * @tags Role
   */
  unassignRoleFromGroup(options?: unassignRoleFromGroupOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromGroup>>;
  unassignRoleFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignRoleFromGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignRoleFromGroup', (Schemas as any).zUnassignRoleFromGroupResponse || (Schemas as any).zunassignRoleFromGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a role from a mapping rule
   * Unassigns a role from a mapping rule.
   *
    *
   * @operationId unassignRoleFromMappingRule
   * @tags Role
   */
  unassignRoleFromMappingRule(options?: unassignRoleFromMappingRuleOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromMappingRule>>;
  unassignRoleFromMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignRoleFromMappingRule(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignRoleFromMappingRule', (Schemas as any).zUnassignRoleFromMappingRuleResponse || (Schemas as any).zunassignRoleFromMappingRuleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a role from a tenant
   * Unassigns a role from a specified tenant. Users, Clients or Groups, that have the role assigned, will no longer have access to the tenant's data - unless they are assigned directly to the tenant.
    *
   * @operationId unassignRoleFromTenant
   * @tags Tenant
   */
  unassignRoleFromTenant(options?: unassignRoleFromTenantOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromTenant>>;
  unassignRoleFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignRoleFromTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignRoleFromTenant', (Schemas as any).zUnassignRoleFromTenantResponse || (Schemas as any).zunassignRoleFromTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a role from a user
   * Unassigns a role from a user.
   * The user will no longer inherit the authorizations associated with this role.
    *
   * @operationId unassignRoleFromUser
   * @tags Role
   */
  unassignRoleFromUser(options?: unassignRoleFromUserOptions): CancelablePromise<_DataOf<typeof Sdk.unassignRoleFromUser>>;
  unassignRoleFromUser(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignRoleFromUser(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignRoleFromUser', (Schemas as any).zUnassignRoleFromUserResponse || (Schemas as any).zunassignRoleFromUserResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a user from a group
   * Unassigns a user from a group.
   * The user is removed as a group member, with associated authorizations, roles, and tenant assignments no longer applied.
    *
   * @operationId unassignUserFromGroup
   * @tags Group
   */
  unassignUserFromGroup(options?: unassignUserFromGroupOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromGroup>>;
  unassignUserFromGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignUserFromGroup(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignUserFromGroup', (Schemas as any).zUnassignUserFromGroupResponse || (Schemas as any).zunassignUserFromGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign a user from a tenant
   * Unassigns the user from the specified tenant. The user can no longer access tenant data.
    *
   * @operationId unassignUserFromTenant
   * @tags Tenant
   */
  unassignUserFromTenant(options?: unassignUserFromTenantOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserFromTenant>>;
  unassignUserFromTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignUserFromTenant(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignUserFromTenant', (Schemas as any).zUnassignUserFromTenantResponse || (Schemas as any).zunassignUserFromTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Unassign user task
   * Removes the assignee of a task with the given key.
    *
   * @operationId unassignUserTask
   * @tags User task
   */
  unassignUserTask(options?: unassignUserTaskOptions): CancelablePromise<_DataOf<typeof Sdk.unassignUserTask>>;
  unassignUserTask(userTaskKey: unassignUserTaskPathParam): CancelablePromise<_DataOf<typeof Sdk.unassignUserTask>>;
  unassignUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      let opts: any;
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) opts = arg || {}; else opts = { path: { userTaskKey: arg } };
      const call = async () => {
        const full = { ...opts, client: this._client, signal } as any;
        const r = await Sdk.unassignUserTask(full);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('unassignUserTask', (Schemas as any).zUnassignUserTaskResponse || (Schemas as any).zunassignUserTaskResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Update authorization
   * Update the authorization with the given key.
    *
   * @operationId updateAuthorization
   * @tags Authorization
   */
  updateAuthorization(body: updateAuthorizationBody): CancelablePromise<_DataOf<typeof Sdk.updateAuthorization>>;
  updateAuthorization(options: updateAuthorizationOptions): CancelablePromise<_DataOf<typeof Sdk.updateAuthorization>>;
  updateAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateAuthorization', (Schemas as any).zUpdateAuthorizationData || (Schemas as any).zupdateAuthorizationData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateAuthorization(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateAuthorization', (Schemas as any).zUpdateAuthorizationResponse || (Schemas as any).zupdateAuthorizationResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateAuthorization', (Schemas as any).zUpdateAuthorizationData || (Schemas as any).zupdateAuthorizationData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateAuthorization({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateAuthorization', (Schemas as any).zUpdateAuthorizationResponse || (Schemas as any).zupdateAuthorizationResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Update group
   * Update a group with the given ID.
   *
    *
   * @operationId updateGroup
   * @tags Group
   */
  updateGroup(body: updateGroupBody): CancelablePromise<_DataOf<typeof Sdk.updateGroup>>;
  updateGroup(options: updateGroupOptions): CancelablePromise<_DataOf<typeof Sdk.updateGroup>>;
  updateGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateGroup', (Schemas as any).zUpdateGroupData || (Schemas as any).zupdateGroupData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateGroup(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateGroup', (Schemas as any).zUpdateGroupResponse || (Schemas as any).zupdateGroupResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateGroup', (Schemas as any).zUpdateGroupData || (Schemas as any).zupdateGroupData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateGroup({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateGroup', (Schemas as any).zUpdateGroupResponse || (Schemas as any).zupdateGroupResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Update job
   * Update a job with the given key.
    *
   * @operationId updateJob
   * @tags Job
   */
  updateJob(body: updateJobBody): CancelablePromise<_DataOf<typeof Sdk.updateJob>>;
  updateJob(options: updateJobOptions): CancelablePromise<_DataOf<typeof Sdk.updateJob>>;
  updateJob(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateJob', (Schemas as any).zUpdateJobData || (Schemas as any).zupdateJobData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateJob(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateJob', (Schemas as any).zUpdateJobResponse || (Schemas as any).zupdateJobResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateJob', (Schemas as any).zUpdateJobData || (Schemas as any).zupdateJobData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateJob({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateJob', (Schemas as any).zUpdateJobResponse || (Schemas as any).zupdateJobResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Update mapping rule
   * Update a mapping rule.
   *
    *
   * @operationId updateMappingRule
   * @tags Mapping rule
   */
  updateMappingRule(body: updateMappingRuleBody): CancelablePromise<_DataOf<typeof Sdk.updateMappingRule>>;
  updateMappingRule(options: updateMappingRuleOptions): CancelablePromise<_DataOf<typeof Sdk.updateMappingRule>>;
  updateMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateMappingRule', (Schemas as any).zUpdateMappingRuleData || (Schemas as any).zupdateMappingRuleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateMappingRule(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateMappingRule', (Schemas as any).zUpdateMappingRuleResponse || (Schemas as any).zupdateMappingRuleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateMappingRule', (Schemas as any).zUpdateMappingRuleData || (Schemas as any).zupdateMappingRuleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateMappingRule({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateMappingRule', (Schemas as any).zUpdateMappingRuleResponse || (Schemas as any).zupdateMappingRuleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Update role
   * Update a role with the given ID.
   *
    *
   * @operationId updateRole
   * @tags Role
   */
  updateRole(body: updateRoleBody): CancelablePromise<_DataOf<typeof Sdk.updateRole>>;
  updateRole(options: updateRoleOptions): CancelablePromise<_DataOf<typeof Sdk.updateRole>>;
  updateRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateRole', (Schemas as any).zUpdateRoleData || (Schemas as any).zupdateRoleData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateRole(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateRole', (Schemas as any).zUpdateRoleResponse || (Schemas as any).zupdateRoleResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateRole', (Schemas as any).zUpdateRoleData || (Schemas as any).zupdateRoleData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateRole({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateRole', (Schemas as any).zUpdateRoleResponse || (Schemas as any).zupdateRoleResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Update tenant
   * Updates an existing tenant.
    *
   * @operationId updateTenant
   * @tags Tenant
   */
  updateTenant(body: updateTenantBody): CancelablePromise<_DataOf<typeof Sdk.updateTenant>>;
  updateTenant(options: updateTenantOptions): CancelablePromise<_DataOf<typeof Sdk.updateTenant>>;
  updateTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateTenant', (Schemas as any).zUpdateTenantData || (Schemas as any).zupdateTenantData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateTenant(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateTenant', (Schemas as any).zUpdateTenantResponse || (Schemas as any).zupdateTenantResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateTenant', (Schemas as any).zUpdateTenantData || (Schemas as any).zupdateTenantData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateTenant({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateTenant', (Schemas as any).zUpdateTenantResponse || (Schemas as any).zupdateTenantResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

  /**
   * Update user
   * Updates a user.
   *
    *
   * @operationId updateUser
   * @tags User
   * @consistency eventual - this endpoint is backed by data that is eventually consistent with the system state.
   */
  updateUser(body: updateUserBody, /** Management of eventual consistency **/ consistencyManagement: updateUserConsistency): CancelablePromise<_DataOf<typeof Sdk.updateUser>>;
  updateUser(options: updateUserOptions, /** Management of eventual consistency **/ consistencyManagement: updateUserConsistency): CancelablePromise<_DataOf<typeof Sdk.updateUser>>;
  updateUser(arg: any, /** Management of eventual consistency **/ consistencyManagement: updateUserConsistency): CancelablePromise<any> {
    if (!consistencyManagement) throw new Error("Missing consistencyManagement parameter for eventually consistent endpoint");
    const useConsistency = consistencyManagement.consistency;
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateUser', (Schemas as any).zUpdateUserData || (Schemas as any).zupdateUserData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateUser(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateUser', (Schemas as any).zUpdateUserResponse || (Schemas as any).zupdateUserResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        if (useConsistency) return eventualPoll('updateUser', false, ()=>toCancelable(()=>call()), useConsistency);
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateUser', (Schemas as any).zUpdateUserData || (Schemas as any).zupdateUserData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateUser({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateUser', (Schemas as any).zUpdateUserResponse || (Schemas as any).zupdateUserResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      if (useConsistency) return eventualPoll('updateUser', false, ()=>toCancelable(()=>call()), useConsistency);
      return call();
    });
  }

  /**
   * Update user task
   * Update a user task with the given key.
    *
   * @operationId updateUserTask
   * @tags User task
   */
  updateUserTask(body: updateUserTaskBody): CancelablePromise<_DataOf<typeof Sdk.updateUserTask>>;
  updateUserTask(options: updateUserTaskOptions): CancelablePromise<_DataOf<typeof Sdk.updateUserTask>>;
  updateUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        const call = async () => {
          const opts: any = { ...arg, client: this._client, signal };
          if (opts.body !== undefined && this.requestValidationMode() !== 'none') {
            const maybe = await this.gateRequest('updateUserTask', (Schemas as any).zUpdateUserTaskData || (Schemas as any).zupdateUserTaskData, opts.body);
            if (this.requestValidationMode() === 'strict') opts.body = maybe;
          }
          const r = await Sdk.updateUserTask(opts);
          let data = r?.data ?? r;
          if (this.responseValidationMode() !== 'none') {
            const maybeR = await this.gateResponse('updateUserTask', (Schemas as any).zUpdateUserTaskResponse || (Schemas as any).zupdateUserTaskResponse, data);
            if (this.responseValidationMode() === 'strict') data = maybeR;
          }
          return data;
        };
        return call();
      }
      const call = async () => {
        let bodyVal: any = arg;
        if (bodyVal !== undefined && this.requestValidationMode() !== 'none') {
          const maybe = await this.gateRequest('updateUserTask', (Schemas as any).zUpdateUserTaskData || (Schemas as any).zupdateUserTaskData, bodyVal);
          if (this.requestValidationMode() === 'strict') bodyVal = maybe;
        }
        const r = await Sdk.updateUserTask({ body: bodyVal, client: this._client, signal } as any);
        let data = r?.data ?? r;
        if (this.responseValidationMode() !== 'none') {
          const maybeR = await this.gateResponse('updateUserTask', (Schemas as any).zUpdateUserTaskResponse || (Schemas as any).zupdateUserTaskResponse, data);
          if (this.responseValidationMode() === 'strict') data = maybeR;
        }
        return data;
      };
      return call();
    });
  }

// === AUTO-GENERATED CAMUNDA METHODS END ===
}
