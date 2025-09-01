// @generated from Camunda8.template.ts – DO NOT EDIT DIRECTLY
// Canonical Camunda8 class template (manually maintained)
// DO NOT add generated operation methods here; generator will produce Camunda8.ts from this template.

import { createClient } from './gen/client/client.gen';
import type { Client } from './gen/client/types.gen';
import { createAuthFacade } from './runtime/auth';
import type { CamundaConfig } from './runtime/unifiedConfiguration';
import { hydrateConfig, getConfig } from './runtime/unifiedConfiguration';
import * as Sdk from './gen/sdk.gen';

// === AUTO-GENERATED CAMUNDA8 SUPPORT TYPES START ===
// Generated 2025-09-01T08:31:55.678Z
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
type cancelProcessInstanceOptions = Parameters<typeof Sdk.cancelProcessInstance>[0];
type cancelProcessInstanceBody = (NonNullable<cancelProcessInstanceOptions> extends { body?: infer B } ? B : never);
type cancelProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.cancelProcessInstancesBatchOperation>[0];
type cancelProcessInstancesBatchOperationBody = (NonNullable<cancelProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
type completeJobOptions = Parameters<typeof Sdk.completeJob>[0];
type completeJobBody = (NonNullable<completeJobOptions> extends { body?: infer B } ? B : never);
type completeUserTaskOptions = Parameters<typeof Sdk.completeUserTask>[0];
type completeUserTaskBody = (NonNullable<completeUserTaskOptions> extends { body?: infer B } ? B : never);
type correlateMessageOptions = Parameters<typeof Sdk.correlateMessage>[0];
type correlateMessageBody = (NonNullable<correlateMessageOptions> extends { body?: infer B } ? B : never);
type createAdminUserOptions = Parameters<typeof Sdk.createAdminUser>[0];
type createAdminUserBody = (NonNullable<createAdminUserOptions> extends { body?: infer B } ? B : never);
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
type deleteAuthorizationOptions = Parameters<typeof Sdk.deleteAuthorization>[0];
type deleteDocumentOptions = Parameters<typeof Sdk.deleteDocument>[0];
type deleteGroupOptions = Parameters<typeof Sdk.deleteGroup>[0];
type deleteMappingRuleOptions = Parameters<typeof Sdk.deleteMappingRule>[0];
type deleteResourceOptions = Parameters<typeof Sdk.deleteResource>[0];
type deleteResourceBody = (NonNullable<deleteResourceOptions> extends { body?: infer B } ? B : never);
type deleteRoleOptions = Parameters<typeof Sdk.deleteRole>[0];
type deleteTenantOptions = Parameters<typeof Sdk.deleteTenant>[0];
type deleteUserOptions = Parameters<typeof Sdk.deleteUser>[0];
type evaluateDecisionOptions = Parameters<typeof Sdk.evaluateDecision>[0];
type evaluateDecisionBody = (NonNullable<evaluateDecisionOptions> extends { body?: infer B } ? B : never);
type failJobOptions = Parameters<typeof Sdk.failJob>[0];
type failJobBody = (NonNullable<failJobOptions> extends { body?: infer B } ? B : never);
type getAuthenticationOptions = Parameters<typeof Sdk.getAuthentication>[0];
type getAuthorizationOptions = Parameters<typeof Sdk.getAuthorization>[0];
type getBatchOperationOptions = Parameters<typeof Sdk.getBatchOperation>[0];
type getDecisionDefinitionOptions = Parameters<typeof Sdk.getDecisionDefinition>[0];
type getDecisionDefinitionXmlOptions = Parameters<typeof Sdk.getDecisionDefinitionXml>[0];
type getDecisionInstanceOptions = Parameters<typeof Sdk.getDecisionInstance>[0];
type getDecisionRequirementsOptions = Parameters<typeof Sdk.getDecisionRequirements>[0];
type getDecisionRequirementsXmlOptions = Parameters<typeof Sdk.getDecisionRequirementsXml>[0];
type getDocumentOptions = Parameters<typeof Sdk.getDocument>[0];
type getElementInstanceOptions = Parameters<typeof Sdk.getElementInstance>[0];
type getGroupOptions = Parameters<typeof Sdk.getGroup>[0];
type getIncidentOptions = Parameters<typeof Sdk.getIncident>[0];
type getLicenseOptions = Parameters<typeof Sdk.getLicense>[0];
type getMappingRuleOptions = Parameters<typeof Sdk.getMappingRule>[0];
type getProcessDefinitionOptions = Parameters<typeof Sdk.getProcessDefinition>[0];
type getProcessDefinitionStatisticsOptions = Parameters<typeof Sdk.getProcessDefinitionStatistics>[0];
type getProcessDefinitionStatisticsBody = (NonNullable<getProcessDefinitionStatisticsOptions> extends { body?: infer B } ? B : never);
type getProcessDefinitionXmlOptions = Parameters<typeof Sdk.getProcessDefinitionXml>[0];
type getProcessInstanceOptions = Parameters<typeof Sdk.getProcessInstance>[0];
type getProcessInstanceCallHierarchyOptions = Parameters<typeof Sdk.getProcessInstanceCallHierarchy>[0];
type getProcessInstanceSequenceFlowsOptions = Parameters<typeof Sdk.getProcessInstanceSequenceFlows>[0];
type getProcessInstanceStatisticsOptions = Parameters<typeof Sdk.getProcessInstanceStatistics>[0];
type getResourceOptions = Parameters<typeof Sdk.getResource>[0];
type getResourceContentOptions = Parameters<typeof Sdk.getResourceContent>[0];
type getRoleOptions = Parameters<typeof Sdk.getRole>[0];
type getStartProcessFormOptions = Parameters<typeof Sdk.getStartProcessForm>[0];
type getTenantOptions = Parameters<typeof Sdk.getTenant>[0];
type getTopologyOptions = Parameters<typeof Sdk.getTopology>[0];
type getUsageMetricsOptions = Parameters<typeof Sdk.getUsageMetrics>[0];
type getUserOptions = Parameters<typeof Sdk.getUser>[0];
type getUserTaskOptions = Parameters<typeof Sdk.getUserTask>[0];
type getUserTaskFormOptions = Parameters<typeof Sdk.getUserTaskForm>[0];
type getVariableOptions = Parameters<typeof Sdk.getVariable>[0];
type migrateProcessInstanceOptions = Parameters<typeof Sdk.migrateProcessInstance>[0];
type migrateProcessInstanceBody = (NonNullable<migrateProcessInstanceOptions> extends { body?: infer B } ? B : never);
type migrateProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.migrateProcessInstancesBatchOperation>[0];
type migrateProcessInstancesBatchOperationBody = (NonNullable<migrateProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
type modifyProcessInstanceOptions = Parameters<typeof Sdk.modifyProcessInstance>[0];
type modifyProcessInstanceBody = (NonNullable<modifyProcessInstanceOptions> extends { body?: infer B } ? B : never);
type modifyProcessInstancesBatchOperationOptions = Parameters<typeof Sdk.modifyProcessInstancesBatchOperation>[0];
type modifyProcessInstancesBatchOperationBody = (NonNullable<modifyProcessInstancesBatchOperationOptions> extends { body?: infer B } ? B : never);
type pinClockOptions = Parameters<typeof Sdk.pinClock>[0];
type pinClockBody = (NonNullable<pinClockOptions> extends { body?: infer B } ? B : never);
type publishMessageOptions = Parameters<typeof Sdk.publishMessage>[0];
type publishMessageBody = (NonNullable<publishMessageOptions> extends { body?: infer B } ? B : never);
type resetClockOptions = Parameters<typeof Sdk.resetClock>[0];
type resolveIncidentOptions = Parameters<typeof Sdk.resolveIncident>[0];
type resolveIncidentBody = (NonNullable<resolveIncidentOptions> extends { body?: infer B } ? B : never);
type resolveIncidentsBatchOperationOptions = Parameters<typeof Sdk.resolveIncidentsBatchOperation>[0];
type resolveIncidentsBatchOperationBody = (NonNullable<resolveIncidentsBatchOperationOptions> extends { body?: infer B } ? B : never);
type resumeBatchOperationOptions = Parameters<typeof Sdk.resumeBatchOperation>[0];
type resumeBatchOperationBody = (NonNullable<resumeBatchOperationOptions> extends { body?: infer B } ? B : never);
type searchAuthorizationsOptions = Parameters<typeof Sdk.searchAuthorizations>[0];
type searchAuthorizationsBody = (NonNullable<searchAuthorizationsOptions> extends { body?: infer B } ? B : never);
type searchBatchOperationItemsOptions = Parameters<typeof Sdk.searchBatchOperationItems>[0];
type searchBatchOperationItemsBody = (NonNullable<searchBatchOperationItemsOptions> extends { body?: infer B } ? B : never);
type searchBatchOperationsOptions = Parameters<typeof Sdk.searchBatchOperations>[0];
type searchBatchOperationsBody = (NonNullable<searchBatchOperationsOptions> extends { body?: infer B } ? B : never);
type searchClientsForGroupOptions = Parameters<typeof Sdk.searchClientsForGroup>[0];
type searchClientsForGroupBody = (NonNullable<searchClientsForGroupOptions> extends { body?: infer B } ? B : never);
type searchClientsForRoleOptions = Parameters<typeof Sdk.searchClientsForRole>[0];
type searchClientsForRoleBody = (NonNullable<searchClientsForRoleOptions> extends { body?: infer B } ? B : never);
type searchClientsForTenantOptions = Parameters<typeof Sdk.searchClientsForTenant>[0];
type searchClientsForTenantBody = (NonNullable<searchClientsForTenantOptions> extends { body?: infer B } ? B : never);
type searchDecisionDefinitionsOptions = Parameters<typeof Sdk.searchDecisionDefinitions>[0];
type searchDecisionDefinitionsBody = (NonNullable<searchDecisionDefinitionsOptions> extends { body?: infer B } ? B : never);
type searchDecisionInstancesOptions = Parameters<typeof Sdk.searchDecisionInstances>[0];
type searchDecisionInstancesBody = (NonNullable<searchDecisionInstancesOptions> extends { body?: infer B } ? B : never);
type searchDecisionRequirementsOptions = Parameters<typeof Sdk.searchDecisionRequirements>[0];
type searchDecisionRequirementsBody = (NonNullable<searchDecisionRequirementsOptions> extends { body?: infer B } ? B : never);
type searchElementInstancesOptions = Parameters<typeof Sdk.searchElementInstances>[0];
type searchElementInstancesBody = (NonNullable<searchElementInstancesOptions> extends { body?: infer B } ? B : never);
type searchGroupIdsForTenantOptions = Parameters<typeof Sdk.searchGroupIdsForTenant>[0];
type searchGroupIdsForTenantBody = (NonNullable<searchGroupIdsForTenantOptions> extends { body?: infer B } ? B : never);
type searchGroupsOptions = Parameters<typeof Sdk.searchGroups>[0];
type searchGroupsBody = (NonNullable<searchGroupsOptions> extends { body?: infer B } ? B : never);
type searchGroupsForRoleOptions = Parameters<typeof Sdk.searchGroupsForRole>[0];
type searchGroupsForRoleBody = (NonNullable<searchGroupsForRoleOptions> extends { body?: infer B } ? B : never);
type searchIncidentsOptions = Parameters<typeof Sdk.searchIncidents>[0];
type searchIncidentsBody = (NonNullable<searchIncidentsOptions> extends { body?: infer B } ? B : never);
type searchJobsOptions = Parameters<typeof Sdk.searchJobs>[0];
type searchJobsBody = (NonNullable<searchJobsOptions> extends { body?: infer B } ? B : never);
type searchMappingRuleOptions = Parameters<typeof Sdk.searchMappingRule>[0];
type searchMappingRuleBody = (NonNullable<searchMappingRuleOptions> extends { body?: infer B } ? B : never);
type searchMappingRulesForGroupOptions = Parameters<typeof Sdk.searchMappingRulesForGroup>[0];
type searchMappingRulesForGroupBody = (NonNullable<searchMappingRulesForGroupOptions> extends { body?: infer B } ? B : never);
type searchMappingRulesForRoleOptions = Parameters<typeof Sdk.searchMappingRulesForRole>[0];
type searchMappingRulesForRoleBody = (NonNullable<searchMappingRulesForRoleOptions> extends { body?: infer B } ? B : never);
type searchMappingsForTenantOptions = Parameters<typeof Sdk.searchMappingsForTenant>[0];
type searchMappingsForTenantBody = (NonNullable<searchMappingsForTenantOptions> extends { body?: infer B } ? B : never);
type searchMessageSubscriptionsOptions = Parameters<typeof Sdk.searchMessageSubscriptions>[0];
type searchMessageSubscriptionsBody = (NonNullable<searchMessageSubscriptionsOptions> extends { body?: infer B } ? B : never);
type searchProcessDefinitionsOptions = Parameters<typeof Sdk.searchProcessDefinitions>[0];
type searchProcessDefinitionsBody = (NonNullable<searchProcessDefinitionsOptions> extends { body?: infer B } ? B : never);
type searchProcessInstanceIncidentsOptions = Parameters<typeof Sdk.searchProcessInstanceIncidents>[0];
type searchProcessInstanceIncidentsBody = (NonNullable<searchProcessInstanceIncidentsOptions> extends { body?: infer B } ? B : never);
type searchProcessInstancesOptions = Parameters<typeof Sdk.searchProcessInstances>[0];
type searchProcessInstancesBody = (NonNullable<searchProcessInstancesOptions> extends { body?: infer B } ? B : never);
type searchRolesOptions = Parameters<typeof Sdk.searchRoles>[0];
type searchRolesBody = (NonNullable<searchRolesOptions> extends { body?: infer B } ? B : never);
type searchRolesForGroupOptions = Parameters<typeof Sdk.searchRolesForGroup>[0];
type searchRolesForGroupBody = (NonNullable<searchRolesForGroupOptions> extends { body?: infer B } ? B : never);
type searchRolesForTenantOptions = Parameters<typeof Sdk.searchRolesForTenant>[0];
type searchRolesForTenantBody = (NonNullable<searchRolesForTenantOptions> extends { body?: infer B } ? B : never);
type searchTenantsOptions = Parameters<typeof Sdk.searchTenants>[0];
type searchTenantsBody = (NonNullable<searchTenantsOptions> extends { body?: infer B } ? B : never);
type searchUsersOptions = Parameters<typeof Sdk.searchUsers>[0];
type searchUsersBody = (NonNullable<searchUsersOptions> extends { body?: infer B } ? B : never);
type searchUsersForGroupOptions = Parameters<typeof Sdk.searchUsersForGroup>[0];
type searchUsersForGroupBody = (NonNullable<searchUsersForGroupOptions> extends { body?: infer B } ? B : never);
type searchUsersForRoleOptions = Parameters<typeof Sdk.searchUsersForRole>[0];
type searchUsersForRoleBody = (NonNullable<searchUsersForRoleOptions> extends { body?: infer B } ? B : never);
type searchUsersForTenantOptions = Parameters<typeof Sdk.searchUsersForTenant>[0];
type searchUsersForTenantBody = (NonNullable<searchUsersForTenantOptions> extends { body?: infer B } ? B : never);
type searchUserTasksOptions = Parameters<typeof Sdk.searchUserTasks>[0];
type searchUserTasksBody = (NonNullable<searchUserTasksOptions> extends { body?: infer B } ? B : never);
type searchUserTaskVariablesOptions = Parameters<typeof Sdk.searchUserTaskVariables>[0];
type searchUserTaskVariablesBody = (NonNullable<searchUserTaskVariablesOptions> extends { body?: infer B } ? B : never);
type searchVariablesOptions = Parameters<typeof Sdk.searchVariables>[0];
type searchVariablesBody = (NonNullable<searchVariablesOptions> extends { body?: infer B } ? B : never);
type suspendBatchOperationOptions = Parameters<typeof Sdk.suspendBatchOperation>[0];
type suspendBatchOperationBody = (NonNullable<suspendBatchOperationOptions> extends { body?: infer B } ? B : never);
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
type updateUserTaskOptions = Parameters<typeof Sdk.updateUserTask>[0];
type updateUserTaskBody = (NonNullable<updateUserTaskOptions> extends { body?: infer B } ? B : never);
// === AUTO-GENERATED CAMUNDA8 SUPPORT TYPES END ===

// Cancelable primitive (kept lightweight & local)
export class CancelError extends Error { constructor(){ super('Cancelled'); this.name='CancelError'; } }
export interface CancelablePromise<T> extends Promise<T> { cancel(): void }
function toCancelable<T>(factory:(signal:AbortSignal)=>Promise<T>): CancelablePromise<T> {
  const ac = new AbortController();
  const p: any = new Promise<T>((resolve,reject)=> { factory(ac.signal).then(resolve,reject); });
  p.cancel = ()=> ac.abort();
  return p as CancelablePromise<T>;
}

export interface Camunda8InputConfig extends Partial<CamundaConfig> {
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  env?: Record<string,string|undefined>;        // optional ad-hoc env map (instance-scoped)
  overrides?: Record<string,string|undefined>;  // optional overrides
  // Direct env-style configuration (1:1 with environment variable names). If any CAMUNDA_* keys
  // are present on the constructor options object they are treated as an implicit env map and
  // hydrated exactly as if passed via the env property. Example:
  //   new Camunda8({ CAMUNDA_SDK_VALIDATION: 'req:warn,res:strict', CAMUNDA_REST_ADDRESS: 'https://api' })
  // This removes guesswork when moving from mapping environment configuration to explicit instance construction.
  CAMUNDA_REST_ADDRESS?: string;
  CAMUNDA_TOKEN_AUDIENCE?: string;
  CAMUNDA_CLIENT_ID?: string;
  CAMUNDA_CLIENT_SECRET?: string;
  CAMUNDA_OAUTH_URL?: string;
  CAMUNDA_OAUTH_GRANT_TYPE?: string;
  CAMUNDA_OAUTH_SCOPE?: string;
  CAMUNDA_OAUTH_TIMEOUT_MS?: string;
  CAMUNDA_OAUTH_RETRY_MAX?: string;
  CAMUNDA_OAUTH_RETRY_BASE_DELAY_MS?: string;
  CAMUNDA_OAUTH_CACHE_DIR?: string;
  CAMUNDA_AUTH_STRATEGY?: string;
  CAMUNDA_BASIC_AUTH_USERNAME?: string;
  CAMUNDA_BASIC_AUTH_PASSWORD?: string;
  CAMUNDA_SDK_VALIDATION?: string;
  CAMUNDA_SDK_VALIDATION_VERBOSE?: string;
  CAMUNDA_SDK_LOG_LEVEL?: string;
  CAMUNDA_MTLS_CERT_PATH?: string;
  CAMUNDA_MTLS_KEY_PATH?: string;
  CAMUNDA_MTLS_CA_PATH?: string;
  CAMUNDA_MTLS_KEY_PASSPHRASE?: string;
  CAMUNDA_MTLS_CERT?: string;
  CAMUNDA_MTLS_KEY?: string;
  CAMUNDA_MTLS_CA?: string;
  CAMUNDA_SDK_EVENTUAL_POLL_DEFAULT_MS?: string;
}

export class Camunda8 {
  private _client: Client;
  private _config: CamundaConfig;
  private _auth: ReturnType<typeof createAuthFacade> = createAuthFacade({
    // Temporary minimal config; replaced in constructor. Using obvious placeholders to avoid accidental use pre-construction.
    restAddress: '',
    auth: { strategy: 'NONE', basic: { username: '', password: '' } } as any,
    validation: { req: 'none', res: 'none', verbose: false },
    oauth: { oauthUrl: '', timeoutMs: 0, retry: { max: 0, baseDelayMs: 0 } } as any,
    tokenAudience: ''
  } as any);
  private _fetch?: (input: RequestInfo | URL, init?: RequestInit)=>Promise<Response>;

  constructor(cfg?: Camunda8InputConfig) {
    // Determine base configuration (instance-scoped)
    let base: CamundaConfig;
    const supplied = cfg || {} as Camunda8InputConfig;
    const { fetch, env, overrides, ...rest } = supplied as any; // rest may contain CAMUNDA_* keys + partial structured overrides
    // Detect inline CAMUNDA_* keys
    const inlineEnvKeys = Object.keys(rest).filter(k => k.startsWith('CAMUNDA_'));
    let effectiveEnv: Record<string,string|undefined> | undefined = env ? { ...env } : undefined;
    if (inlineEnvKeys.length) {
      effectiveEnv = effectiveEnv || {};
      for (const k of inlineEnvKeys) {
        effectiveEnv[k] = (rest as any)[k];
        delete (rest as any)[k]; // prevent leaking raw env keys into structured merge
      }
    }
    if (effectiveEnv || overrides) {
      base = hydrateConfig({ env: effectiveEnv, overrides }).config;
    } else if (supplied && (supplied as any).auth && (supplied as any).validation && (supplied as any).restAddress) {
      base = supplied as any as CamundaConfig; // already structured
    } else {
      const last = getConfig();
      base = last ? last.config : hydrateConfig().config;
    }
    this._config = { ...base, ...rest } as CamundaConfig;
    this._fetch = fetch;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(this._config, { fetch: this._fetch });
  }

  get config() { return this._config; }

  configure(next: Camunda8InputConfig) {
    this._config = { ...this._config, ...(next as any) };
    if (next.fetch) this._fetch = next.fetch;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(this._config, { fetch: this._fetch });
  }

  // Convenience for tests / dynamic injection without re-providing other config
  setFetch(fetchImpl: (input: RequestInfo | URL, init?: RequestInit)=>Promise<Response>) {
    this._fetch = fetchImpl;
    this._client = createClient({ baseUrl: this._config.restAddress, fetch: this._fetch });
    this._auth = createAuthFacade(this._config, { fetch: this._fetch });
  }

  // Instance-scoped validation helpers (preferred over legacy free functions)
  validationConfig() { return { req: this._config.validation.req, res: this._config.validation.res }; }
  requestValidationMode() { return this._config.validation.req; }
  responseValidationMode() { return this._config.validation.res; }
  validationVerbose() { return this._config.validation.verbose; }

  // Auth helpers
  async getAuthHeaders() { return this._auth.getAuthHeaders(); }
  async forceAuthRefresh() { return this._auth.forceRefresh(); }
  clearAuthCache(opts?: { disk?: boolean; memory?: boolean }) { this._auth.clearCache(opts); }
  onAuthHeaders(h: (headers: Record<string,string>) => Record<string,string>|Promise<Record<string,string>>) { this._auth.registerHeadersHook(h); }

  async gateRequest(opId: string, schema: any, data: any) { // schema: ZodTypeAny (typed as any to avoid hard dep here)
    return this.#runValidation(opId, 'request', schema, data, this._config.validation.req);
  }
  async gateResponse(opId: string, schema: any, data: any) {
    return this.#runValidation(opId, 'response', schema, data, this._config.validation.res);
  }

  async #runValidation(opId: string, side: 'request'|'response', schema: any, data: any, mode: 'none'|'warn'|'strict') {
    if (mode === 'none') return data;
    try {
  const parsed = schema?.parseAsync ? await schema.parseAsync(data) : schema?.parse ? schema.parse(data) : data;
  return mode === 'warn' ? data : parsed;
    } catch (err: any) {
      // Lazy import to avoid cost when validation disabled
      const { ZodError } = await import('zod');
      if (err instanceof ZodError) {
        if (mode === 'warn') {
          // Best-effort formatting; avoid pulling full formatting stack for now
            if (this.validationVerbose()) {
              // eslint-disable-next-line no-console
              console.warn(`[camunda-sdk][validation][warn] ${side} ${opId}: ${err.issues?.length||0} issue(s)`);
            }
          return data;
        }
        // Throw minimal error (avoid depending on CamundaValidationError class)
        const e = new Error(`[camunda-sdk][validation][${side}] ${opId} failed validation: ${err.issues?.length||0} issue(s)`);
        (e as any).issues = err.issues;
        throw e;
      }
      throw err;
    }
  }

  // === AUTO-GENERATED CAMUNDA8 METHODS START ===
  // Generated methods (2025-09-01T08:31:55.679Z)
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
        return Sdk.activateAdHocSubProcessActivities({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.activateAdHocSubProcessActivities({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.activateJobs({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.activateJobs({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignClientToGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignClientToTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignGroupToTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignMappingRuleToGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignMappingRuleToTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignRoleToClient({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignRoleToGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignRoleToMappingRule({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignRoleToTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignRoleToUser({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.assignUserTask({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.assignUserTask({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignUserToGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.assignUserToTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.broadcastSignal({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.broadcastSignal({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  cancelBatchOperation(body: cancelBatchOperationBody): CancelablePromise<_DataOf<typeof Sdk.cancelBatchOperation>>;
  cancelBatchOperation(options: cancelBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelBatchOperation>>;
  cancelBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.cancelBatchOperation({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.cancelBatchOperation({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.cancelProcessInstance({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.cancelProcessInstance({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  cancelProcessInstancesBatchOperation(body: cancelProcessInstancesBatchOperationBody): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>>;
  cancelProcessInstancesBatchOperation(options: cancelProcessInstancesBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.cancelProcessInstancesBatchOperation>>;
  cancelProcessInstancesBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.cancelProcessInstancesBatchOperation({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.cancelProcessInstancesBatchOperation({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.completeJob({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.completeJob({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.completeUserTask({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.completeUserTask({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.correlateMessage({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.correlateMessage({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Create admin user
   * Creates a new user and assign the admin role to it. This endpoint is only usable when users are managed in the Orchestration Cluster and while no user is assigned to the admin role.
    *
   * @operationId createAdminUser
   * @tags Setup
   */
  createAdminUser(body: createAdminUserBody): CancelablePromise<_DataOf<typeof Sdk.createAdminUser>>;
  createAdminUser(options: createAdminUserOptions): CancelablePromise<_DataOf<typeof Sdk.createAdminUser>>;
  createAdminUser(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.createAdminUser({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createAdminUser({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createAuthorization({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createAuthorization({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createDeployment({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createDeployment({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createDocument({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createDocument({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createDocumentLink({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createDocumentLink({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createDocuments({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createDocuments({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createElementInstanceVariables({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createElementInstanceVariables({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createGroup({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createGroup({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createMappingRule({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createMappingRule({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createProcessInstance({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createProcessInstance({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createRole({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createRole({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.createTenant({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createTenant({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Create user
   * Create a new user.
    *
   * @operationId createUser
   * @tags User
   */
  createUser(body: createUserBody): CancelablePromise<_DataOf<typeof Sdk.createUser>>;
  createUser(options: createUserOptions): CancelablePromise<_DataOf<typeof Sdk.createUser>>;
  createUser(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.createUser({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.createUser({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  deleteAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.deleteAuthorization({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  deleteDocument(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.deleteDocument({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  deleteGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.deleteGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  deleteMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.deleteMappingRule({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.deleteResource({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.deleteResource({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  deleteRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.deleteRole({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  deleteTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.deleteTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Delete user
   * Deletes a user.
   *
    *
   * @operationId deleteUser
   * @tags User
   */
  deleteUser(options?: deleteUserOptions): CancelablePromise<_DataOf<typeof Sdk.deleteUser>>;
  deleteUser(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.deleteUser({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.evaluateDecision({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.evaluateDecision({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.failJob({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.failJob({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.getAuthentication({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get authorization
   * Get authorization by the given key.
    *
   * @operationId getAuthorization
   * @tags Authorization
   */
  getAuthorization(options?: getAuthorizationOptions): CancelablePromise<_DataOf<typeof Sdk.getAuthorization>>;
  getAuthorization(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getAuthorization({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get batch operation
   * Get batch operation by key.
    *
   * @operationId getBatchOperation
   * @tags Batch operation
   */
  getBatchOperation(options?: getBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.getBatchOperation>>;
  getBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getBatchOperation({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get decision definition
   * Returns a decision definition by key.
   *
    *
   * @operationId getDecisionDefinition
   * @tags Decision definition
   */
  getDecisionDefinition(options?: getDecisionDefinitionOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinition>>;
  getDecisionDefinition(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getDecisionDefinition({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get decision definition XML
   * Returns decision definition as XML.
   *
    *
   * @operationId getDecisionDefinitionXML
   * @tags Decision definition
   */
  getDecisionDefinitionXml(options?: getDecisionDefinitionXmlOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionDefinitionXml>>;
  getDecisionDefinitionXml(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getDecisionDefinitionXml({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get decision instance
   * Returns a decision instance.
   *
    *
   * @operationId getDecisionInstance
   * @tags Decision instance
   */
  getDecisionInstance(options?: getDecisionInstanceOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionInstance>>;
  getDecisionInstance(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getDecisionInstance({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get decision requirements
   * Returns Decision Requirements as JSON.
   *
    *
   * @operationId getDecisionRequirements
   * @tags Decision requirements
   */
  getDecisionRequirements(options?: getDecisionRequirementsOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirements>>;
  getDecisionRequirements(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getDecisionRequirements({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get decision requirements XML
   * Returns decision requirements as XML.
   *
    *
   * @operationId getDecisionRequirementsXML
   * @tags Decision requirements
   */
  getDecisionRequirementsXml(options?: getDecisionRequirementsXmlOptions): CancelablePromise<_DataOf<typeof Sdk.getDecisionRequirementsXml>>;
  getDecisionRequirementsXml(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getDecisionRequirementsXml({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  getDocument(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getDocument({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get element instance
   * Returns element instance as JSON.
   *
    *
   * @operationId getElementInstance
   * @tags Element instance
   */
  getElementInstance(options?: getElementInstanceOptions): CancelablePromise<_DataOf<typeof Sdk.getElementInstance>>;
  getElementInstance(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getElementInstance({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get group
   * Get a group by its ID.
   *
    *
   * @operationId getGroup
   * @tags Group
   */
  getGroup(options?: getGroupOptions): CancelablePromise<_DataOf<typeof Sdk.getGroup>>;
  getGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get incident
   * Returns incident as JSON.
   *
    *
   * @operationId getIncident
   * @tags Incident
   */
  getIncident(options?: getIncidentOptions): CancelablePromise<_DataOf<typeof Sdk.getIncident>>;
  getIncident(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getIncident({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.getLicense({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get a mapping rule
   * Gets the mapping rule with the given ID.
   *
    *
   * @operationId getMappingRule
   * @tags Mapping rule
   */
  getMappingRule(options?: getMappingRuleOptions): CancelablePromise<_DataOf<typeof Sdk.getMappingRule>>;
  getMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getMappingRule({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get process definition
   * Returns process definition as JSON.
   *
    *
   * @operationId getProcessDefinition
   * @tags Process definition
   */
  getProcessDefinition(options?: getProcessDefinitionOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinition>>;
  getProcessDefinition(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getProcessDefinition({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get process definition statistics
   * Get statistics about elements in currently running process instances by process definition key and search filter.
   *
    *
   * @operationId getProcessDefinitionStatistics
   * @tags Process definition
   */
  getProcessDefinitionStatistics(body: getProcessDefinitionStatisticsBody): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
  getProcessDefinitionStatistics(options: getProcessDefinitionStatisticsOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionStatistics>>;
  getProcessDefinitionStatistics(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.getProcessDefinitionStatistics({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.getProcessDefinitionStatistics({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get process definition XML
   * Returns process definition as XML.
   *
    *
   * @operationId getProcessDefinitionXML
   * @tags Process definition
   */
  getProcessDefinitionXml(options?: getProcessDefinitionXmlOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessDefinitionXml>>;
  getProcessDefinitionXml(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getProcessDefinitionXml({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get process instance
   * Get the process instance by the process instance key.
   *
    *
   * @operationId getProcessInstance
   * @tags Process instance
   */
  getProcessInstance(options?: getProcessInstanceOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstance>>;
  getProcessInstance(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getProcessInstance({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get call hierarchy for process instance
   * Returns the call hierarchy for a given process instance, showing its ancestry up to the root instance.
   *
    *
   * @operationId getProcessInstanceCallHierarchy
   * @tags Process instance
   */
  getProcessInstanceCallHierarchy(options?: getProcessInstanceCallHierarchyOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceCallHierarchy>>;
  getProcessInstanceCallHierarchy(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getProcessInstanceCallHierarchy({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get process instance sequence flows
   * Get sequence flows taken by the process instance.
   *
    *
   * @operationId getProcessInstanceSequenceFlows
   * @tags Process instance
   */
  getProcessInstanceSequenceFlows(options?: getProcessInstanceSequenceFlowsOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceSequenceFlows>>;
  getProcessInstanceSequenceFlows(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getProcessInstanceSequenceFlows({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get process instance statistics
   * Get statistics about elements by the process instance key.
   *
    *
   * @operationId getProcessInstanceStatistics
   * @tags Process instance
   */
  getProcessInstanceStatistics(options?: getProcessInstanceStatisticsOptions): CancelablePromise<_DataOf<typeof Sdk.getProcessInstanceStatistics>>;
  getProcessInstanceStatistics(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getProcessInstanceStatistics({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  getResource(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getResource({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  getResourceContent(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getResourceContent({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get role
   * Get a role by its ID.
   *
    *
   * @operationId getRole
   * @tags Role
   */
  getRole(options?: getRoleOptions): CancelablePromise<_DataOf<typeof Sdk.getRole>>;
  getRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getRole({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  getStartProcessForm(options?: getStartProcessFormOptions): CancelablePromise<_DataOf<typeof Sdk.getStartProcessForm>>;
  getStartProcessForm(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getStartProcessForm({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get tenant
   * Retrieves a single tenant by tenant ID.
    *
   * @operationId getTenant
   * @tags Tenant
   */
  getTenant(options?: getTenantOptions): CancelablePromise<_DataOf<typeof Sdk.getTenant>>;
  getTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.getTopology({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get usage metrics
   * Retrieve the usage metrics based on given criteria.
    *
   * @operationId getUsageMetrics
   * @tags System
   */
  getUsageMetrics(options?: getUsageMetricsOptions): CancelablePromise<_DataOf<typeof Sdk.getUsageMetrics>>;
  getUsageMetrics(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getUsageMetrics({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get user
   * Get a user by its username.
   *
    *
   * @operationId getUser
   * @tags User
   */
  getUser(options?: getUserOptions): CancelablePromise<_DataOf<typeof Sdk.getUser>>;
  getUser(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getUser({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get user task
   * Get the user task by the user task key.
   *
    *
   * @operationId getUserTask
   * @tags User task
   */
  getUserTask(options?: getUserTaskOptions): CancelablePromise<_DataOf<typeof Sdk.getUserTask>>;
  getUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getUserTask({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  getUserTaskForm(options?: getUserTaskFormOptions): CancelablePromise<_DataOf<typeof Sdk.getUserTaskForm>>;
  getUserTaskForm(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getUserTaskForm({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Get variable
   * Get the variable by the variable key.
   *
    *
   * @operationId getVariable
   * @tags Variable
   */
  getVariable(options?: getVariableOptions): CancelablePromise<_DataOf<typeof Sdk.getVariable>>;
  getVariable(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.getVariable({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.migrateProcessInstance({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.migrateProcessInstance({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  migrateProcessInstancesBatchOperation(body: migrateProcessInstancesBatchOperationBody): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>>;
  migrateProcessInstancesBatchOperation(options: migrateProcessInstancesBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.migrateProcessInstancesBatchOperation>>;
  migrateProcessInstancesBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.migrateProcessInstancesBatchOperation({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.migrateProcessInstancesBatchOperation({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.modifyProcessInstance({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.modifyProcessInstance({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  modifyProcessInstancesBatchOperation(body: modifyProcessInstancesBatchOperationBody): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>>;
  modifyProcessInstancesBatchOperation(options: modifyProcessInstancesBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.modifyProcessInstancesBatchOperation>>;
  modifyProcessInstancesBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.modifyProcessInstancesBatchOperation({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.modifyProcessInstancesBatchOperation({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.pinClock({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.pinClock({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.publishMessage({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.publishMessage({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.resetClock({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.resolveIncident({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.resolveIncident({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  resolveIncidentsBatchOperation(body: resolveIncidentsBatchOperationBody): CancelablePromise<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>>;
  resolveIncidentsBatchOperation(options: resolveIncidentsBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.resolveIncidentsBatchOperation>>;
  resolveIncidentsBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.resolveIncidentsBatchOperation({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.resolveIncidentsBatchOperation({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  resumeBatchOperation(body: resumeBatchOperationBody): CancelablePromise<_DataOf<typeof Sdk.resumeBatchOperation>>;
  resumeBatchOperation(options: resumeBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.resumeBatchOperation>>;
  resumeBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.resumeBatchOperation({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.resumeBatchOperation({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search authorizations
   * Search for authorizations based on given criteria.
   *
    *
   * @operationId searchAuthorizations
   * @tags Authorization
   */
  searchAuthorizations(body: searchAuthorizationsBody): CancelablePromise<_DataOf<typeof Sdk.searchAuthorizations>>;
  searchAuthorizations(options: searchAuthorizationsOptions): CancelablePromise<_DataOf<typeof Sdk.searchAuthorizations>>;
  searchAuthorizations(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchAuthorizations({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchAuthorizations({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search batch operation items
   * Search for batch operation items based on given criteria.
    *
   * @operationId searchBatchOperationItems
   * @tags Batch operation
   */
  searchBatchOperationItems(body: searchBatchOperationItemsBody): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperationItems>>;
  searchBatchOperationItems(options: searchBatchOperationItemsOptions): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperationItems>>;
  searchBatchOperationItems(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchBatchOperationItems({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchBatchOperationItems({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search batch operations
   * Search for batch operations based on given criteria.
    *
   * @operationId searchBatchOperations
   * @tags Batch operation
   */
  searchBatchOperations(body: searchBatchOperationsBody): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperations>>;
  searchBatchOperations(options: searchBatchOperationsOptions): CancelablePromise<_DataOf<typeof Sdk.searchBatchOperations>>;
  searchBatchOperations(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchBatchOperations({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchBatchOperations({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search group clients
   * Search clients assigned to a group.
   *
    *
   * @operationId searchClientsForGroup
   * @tags Group
   */
  searchClientsForGroup(body: searchClientsForGroupBody): CancelablePromise<_DataOf<typeof Sdk.searchClientsForGroup>>;
  searchClientsForGroup(options: searchClientsForGroupOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForGroup>>;
  searchClientsForGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchClientsForGroup({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchClientsForGroup({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search role clients
   * Search clients with assigned role.
   *
    *
   * @operationId searchClientsForRole
   * @tags Role
   */
  searchClientsForRole(body: searchClientsForRoleBody): CancelablePromise<_DataOf<typeof Sdk.searchClientsForRole>>;
  searchClientsForRole(options: searchClientsForRoleOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForRole>>;
  searchClientsForRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchClientsForRole({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchClientsForRole({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search clients for tenant
   * Retrieves a filtered and sorted list of clients for a specified tenant.
    *
   * @operationId searchClientsForTenant
   * @tags Tenant
   */
  searchClientsForTenant(body: searchClientsForTenantBody): CancelablePromise<_DataOf<typeof Sdk.searchClientsForTenant>>;
  searchClientsForTenant(options: searchClientsForTenantOptions): CancelablePromise<_DataOf<typeof Sdk.searchClientsForTenant>>;
  searchClientsForTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchClientsForTenant({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchClientsForTenant({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search decision definitions
   * Search for decision definitions based on given criteria.
   *
    *
   * @operationId searchDecisionDefinitions
   * @tags Decision definition
   */
  searchDecisionDefinitions(body: searchDecisionDefinitionsBody): CancelablePromise<_DataOf<typeof Sdk.searchDecisionDefinitions>>;
  searchDecisionDefinitions(options: searchDecisionDefinitionsOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionDefinitions>>;
  searchDecisionDefinitions(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchDecisionDefinitions({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchDecisionDefinitions({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search decision instances
   * Search for decision instances based on given criteria.
   *
    *
   * @operationId searchDecisionInstances
   * @tags Decision instance
   */
  searchDecisionInstances(body: searchDecisionInstancesBody): CancelablePromise<_DataOf<typeof Sdk.searchDecisionInstances>>;
  searchDecisionInstances(options: searchDecisionInstancesOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionInstances>>;
  searchDecisionInstances(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchDecisionInstances({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchDecisionInstances({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search decision requirements
   * Search for decision requirements based on given criteria.
   *
    *
   * @operationId searchDecisionRequirements
   * @tags Decision requirements
   */
  searchDecisionRequirements(body: searchDecisionRequirementsBody): CancelablePromise<_DataOf<typeof Sdk.searchDecisionRequirements>>;
  searchDecisionRequirements(options: searchDecisionRequirementsOptions): CancelablePromise<_DataOf<typeof Sdk.searchDecisionRequirements>>;
  searchDecisionRequirements(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchDecisionRequirements({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchDecisionRequirements({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search element instances
   * Search for element instances based on given criteria.
   *
    *
   * @operationId searchElementInstances
   * @tags Element instance
   */
  searchElementInstances(body: searchElementInstancesBody): CancelablePromise<_DataOf<typeof Sdk.searchElementInstances>>;
  searchElementInstances(options: searchElementInstancesOptions): CancelablePromise<_DataOf<typeof Sdk.searchElementInstances>>;
  searchElementInstances(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchElementInstances({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchElementInstances({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search groups for tenant
   * Retrieves a filtered and sorted list of groups for a specified tenant.
    *
   * @operationId searchGroupIdsForTenant
   * @tags Tenant
   */
  searchGroupIdsForTenant(body: searchGroupIdsForTenantBody): CancelablePromise<_DataOf<typeof Sdk.searchGroupIdsForTenant>>;
  searchGroupIdsForTenant(options: searchGroupIdsForTenantOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroupIdsForTenant>>;
  searchGroupIdsForTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchGroupIdsForTenant({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchGroupIdsForTenant({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search groups
   * Search for groups based on given criteria.
   *
    *
   * @operationId searchGroups
   * @tags Group
   */
  searchGroups(body: searchGroupsBody): CancelablePromise<_DataOf<typeof Sdk.searchGroups>>;
  searchGroups(options: searchGroupsOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroups>>;
  searchGroups(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchGroups({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchGroups({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search role groups
   * Search groups with assigned role.
   *
    *
   * @operationId searchGroupsForRole
   * @tags Role
   */
  searchGroupsForRole(body: searchGroupsForRoleBody): CancelablePromise<_DataOf<typeof Sdk.searchGroupsForRole>>;
  searchGroupsForRole(options: searchGroupsForRoleOptions): CancelablePromise<_DataOf<typeof Sdk.searchGroupsForRole>>;
  searchGroupsForRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchGroupsForRole({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchGroupsForRole({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search incidents
   * Search for incidents based on given criteria.
   *
    *
   * @operationId searchIncidents
   * @tags Incident
   */
  searchIncidents(body: searchIncidentsBody): CancelablePromise<_DataOf<typeof Sdk.searchIncidents>>;
  searchIncidents(options: searchIncidentsOptions): CancelablePromise<_DataOf<typeof Sdk.searchIncidents>>;
  searchIncidents(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchIncidents({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchIncidents({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search jobs
   * Search for jobs based on given criteria.
    *
   * @operationId searchJobs
   * @tags Job
   */
  searchJobs(body: searchJobsBody): CancelablePromise<_DataOf<typeof Sdk.searchJobs>>;
  searchJobs(options: searchJobsOptions): CancelablePromise<_DataOf<typeof Sdk.searchJobs>>;
  searchJobs(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchJobs({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchJobs({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search mapping rules
   * Search for mapping rules based on given criteria.
   *
    *
   * @operationId searchMappingRule
   * @tags Mapping rule
   */
  searchMappingRule(body: searchMappingRuleBody): CancelablePromise<_DataOf<typeof Sdk.searchMappingRule>>;
  searchMappingRule(options: searchMappingRuleOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRule>>;
  searchMappingRule(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchMappingRule({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchMappingRule({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search group mapping rules
   * Search mapping rules assigned to a group.
   *
    *
   * @operationId searchMappingRulesForGroup
   * @tags Group
   */
  searchMappingRulesForGroup(body: searchMappingRulesForGroupBody): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForGroup>>;
  searchMappingRulesForGroup(options: searchMappingRulesForGroupOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForGroup>>;
  searchMappingRulesForGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchMappingRulesForGroup({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchMappingRulesForGroup({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search role mapping rules
   * Search mapping rules with assigned role.
   *
    *
   * @operationId searchMappingRulesForRole
   * @tags Role
   */
  searchMappingRulesForRole(body: searchMappingRulesForRoleBody): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForRole>>;
  searchMappingRulesForRole(options: searchMappingRulesForRoleOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingRulesForRole>>;
  searchMappingRulesForRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchMappingRulesForRole({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchMappingRulesForRole({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search mapping rules for tenant
   * Retrieves a filtered and sorted list of MappingRules for a specified tenant.
    *
   * @operationId searchMappingsForTenant
   * @tags Tenant
   */
  searchMappingsForTenant(body: searchMappingsForTenantBody): CancelablePromise<_DataOf<typeof Sdk.searchMappingsForTenant>>;
  searchMappingsForTenant(options: searchMappingsForTenantOptions): CancelablePromise<_DataOf<typeof Sdk.searchMappingsForTenant>>;
  searchMappingsForTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchMappingsForTenant({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchMappingsForTenant({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search message subscriptions
   * Search for message subscriptions based on given criteria.
   *
    *
   * @operationId searchMessageSubscriptions
   * @tags Message subscription
   */
  searchMessageSubscriptions(body: searchMessageSubscriptionsBody): CancelablePromise<_DataOf<typeof Sdk.searchMessageSubscriptions>>;
  searchMessageSubscriptions(options: searchMessageSubscriptionsOptions): CancelablePromise<_DataOf<typeof Sdk.searchMessageSubscriptions>>;
  searchMessageSubscriptions(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchMessageSubscriptions({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchMessageSubscriptions({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search process definitions
   * Search for process definitions based on given criteria.
   *
    *
   * @operationId searchProcessDefinitions
   * @tags Process definition
   */
  searchProcessDefinitions(body: searchProcessDefinitionsBody): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitions>>;
  searchProcessDefinitions(options: searchProcessDefinitionsOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessDefinitions>>;
  searchProcessDefinitions(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchProcessDefinitions({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchProcessDefinitions({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search for incidents associated with a process instance
   * Search for incidents caused by the process instance or any of its called process or decision instances.
   *
    *
   * @operationId searchProcessInstanceIncidents
   * @tags Process instance
   */
  searchProcessInstanceIncidents(body: searchProcessInstanceIncidentsBody): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
  searchProcessInstanceIncidents(options: searchProcessInstanceIncidentsOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstanceIncidents>>;
  searchProcessInstanceIncidents(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchProcessInstanceIncidents({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchProcessInstanceIncidents({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search process instances
   * Search for process instances based on given criteria.
   *
    *
   * @operationId searchProcessInstances
   * @tags Process instance
   */
  searchProcessInstances(body: searchProcessInstancesBody): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstances>>;
  searchProcessInstances(options: searchProcessInstancesOptions): CancelablePromise<_DataOf<typeof Sdk.searchProcessInstances>>;
  searchProcessInstances(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchProcessInstances({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchProcessInstances({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search roles
   * Search for roles based on given criteria.
   *
    *
   * @operationId searchRoles
   * @tags Role
   */
  searchRoles(body: searchRolesBody): CancelablePromise<_DataOf<typeof Sdk.searchRoles>>;
  searchRoles(options: searchRolesOptions): CancelablePromise<_DataOf<typeof Sdk.searchRoles>>;
  searchRoles(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchRoles({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchRoles({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search group roles
   * Search roles assigned to a group.
   *
    *
   * @operationId searchRolesForGroup
   * @tags Group
   */
  searchRolesForGroup(body: searchRolesForGroupBody): CancelablePromise<_DataOf<typeof Sdk.searchRolesForGroup>>;
  searchRolesForGroup(options: searchRolesForGroupOptions): CancelablePromise<_DataOf<typeof Sdk.searchRolesForGroup>>;
  searchRolesForGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchRolesForGroup({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchRolesForGroup({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search roles for tenant
   * Retrieves a filtered and sorted list of roles for a specified tenant.
    *
   * @operationId searchRolesForTenant
   * @tags Tenant
   */
  searchRolesForTenant(body: searchRolesForTenantBody): CancelablePromise<_DataOf<typeof Sdk.searchRolesForTenant>>;
  searchRolesForTenant(options: searchRolesForTenantOptions): CancelablePromise<_DataOf<typeof Sdk.searchRolesForTenant>>;
  searchRolesForTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchRolesForTenant({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchRolesForTenant({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search tenants
   * Retrieves a filtered and sorted list of tenants.
    *
   * @operationId searchTenants
   * @tags Tenant
   */
  searchTenants(body: searchTenantsBody): CancelablePromise<_DataOf<typeof Sdk.searchTenants>>;
  searchTenants(options: searchTenantsOptions): CancelablePromise<_DataOf<typeof Sdk.searchTenants>>;
  searchTenants(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchTenants({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchTenants({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search users
   * Search for users based on given criteria.
   *
    *
   * @operationId searchUsers
   * @tags User
   */
  searchUsers(body: searchUsersBody): CancelablePromise<_DataOf<typeof Sdk.searchUsers>>;
  searchUsers(options: searchUsersOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsers>>;
  searchUsers(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchUsers({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchUsers({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search group users
   * Search users assigned to a group.
   *
    *
   * @operationId searchUsersForGroup
   * @tags Group
   */
  searchUsersForGroup(body: searchUsersForGroupBody): CancelablePromise<_DataOf<typeof Sdk.searchUsersForGroup>>;
  searchUsersForGroup(options: searchUsersForGroupOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForGroup>>;
  searchUsersForGroup(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchUsersForGroup({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchUsersForGroup({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search role users
   * Search users with assigned role.
   *
    *
   * @operationId searchUsersForRole
   * @tags Role
   */
  searchUsersForRole(body: searchUsersForRoleBody): CancelablePromise<_DataOf<typeof Sdk.searchUsersForRole>>;
  searchUsersForRole(options: searchUsersForRoleOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForRole>>;
  searchUsersForRole(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchUsersForRole({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchUsersForRole({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search users for tenant
   * Retrieves a filtered and sorted list of users for a specified tenant.
    *
   * @operationId searchUsersForTenant
   * @tags Tenant
   */
  searchUsersForTenant(body: searchUsersForTenantBody): CancelablePromise<_DataOf<typeof Sdk.searchUsersForTenant>>;
  searchUsersForTenant(options: searchUsersForTenantOptions): CancelablePromise<_DataOf<typeof Sdk.searchUsersForTenant>>;
  searchUsersForTenant(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchUsersForTenant({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchUsersForTenant({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search user tasks
   * Search for user tasks based on given criteria.
   *
    *
   * @operationId searchUserTasks
   * @tags User task
   */
  searchUserTasks(body: searchUserTasksBody): CancelablePromise<_DataOf<typeof Sdk.searchUserTasks>>;
  searchUserTasks(options: searchUserTasksOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTasks>>;
  searchUserTasks(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchUserTasks({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchUserTasks({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search user task variables
   * Search for user task variables based on given criteria.
   *
    *
   * @operationId searchUserTaskVariables
   * @tags User task
   */
  searchUserTaskVariables(body: searchUserTaskVariablesBody): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskVariables>>;
  searchUserTaskVariables(options: searchUserTaskVariablesOptions): CancelablePromise<_DataOf<typeof Sdk.searchUserTaskVariables>>;
  searchUserTaskVariables(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchUserTaskVariables({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchUserTaskVariables({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Search variables
   * Search for process and local variables based on given criteria.
   *
    *
   * @operationId searchVariables
   * @tags Variable
   */
  searchVariables(body: searchVariablesBody): CancelablePromise<_DataOf<typeof Sdk.searchVariables>>;
  searchVariables(options: searchVariablesOptions): CancelablePromise<_DataOf<typeof Sdk.searchVariables>>;
  searchVariables(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.searchVariables({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.searchVariables({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
   */
  suspendBatchOperation(body: suspendBatchOperationBody): CancelablePromise<_DataOf<typeof Sdk.suspendBatchOperation>>;
  suspendBatchOperation(options: suspendBatchOperationOptions): CancelablePromise<_DataOf<typeof Sdk.suspendBatchOperation>>;
  suspendBatchOperation(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.suspendBatchOperation({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.suspendBatchOperation({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.throwJobError({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.throwJobError({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignClientFromGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignClientFromTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignGroupFromTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignMappingRuleFromGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignMappingRuleFromTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignRoleFromClient({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignRoleFromGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignRoleFromMappingRule({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignRoleFromTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignRoleFromUser({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignUserFromGroup({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
      return Sdk.unassignUserFromTenant({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
  unassignUserTask(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      const opts = arg || {};
      return Sdk.unassignUserTask({ ...opts, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.updateAuthorization({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateAuthorization({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.updateGroup({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateGroup({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.updateJob({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateJob({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.updateMappingRule({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateMappingRule({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.updateRole({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateRole({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.updateTenant({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateTenant({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

  /**
   * Update user
   * Updates a user.
   *
    *
   * @operationId updateUser
   * @tags User
   */
  updateUser(body: updateUserBody): CancelablePromise<_DataOf<typeof Sdk.updateUser>>;
  updateUser(options: updateUserOptions): CancelablePromise<_DataOf<typeof Sdk.updateUser>>;
  updateUser(arg: any): CancelablePromise<any> {
    return toCancelable(signal => {
      if (arg && typeof arg === 'object' && ('body' in arg || 'path' in arg || 'query' in arg || 'headers' in arg)) {
        return Sdk.updateUser({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateUser({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
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
        return Sdk.updateUserTask({ ...arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
      }
      return Sdk.updateUserTask({ body: arg, client: this._client, signal } as any).then((r:any)=> r?.data ?? r);
    });
  }

// === AUTO-GENERATED CAMUNDA8 METHODS END ===
}
