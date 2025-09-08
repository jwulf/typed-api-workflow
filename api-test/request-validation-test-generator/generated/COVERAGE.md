# Request Validation Coverage

Generated: 2025-09-08T02:40:57.041Z
Spec Commit: 3445d1d86c2ad361858dc12e734eeb6197e426a5

Total scenarios: 99

Scenario kinds generated this run: 3
Average kind coverage per operation: 34.4%
Operations with full kind coverage: 0/65

Kind coverage % = (# kinds present for operation / total scenario kinds this run) * 100.

Average applicable kind coverage (ops with applicability): 21.2%

| OperationId | Method | Path | Total | KindCov% | AppKindCov% | ApplicableKinds | PresentKinds | missing-required | type-mismatch | union |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| activateAdHocSubProcessActivities | POST | /element-instances/ad-hoc-activities/{adHocSubProcessInstanceKey}/activation | 1 | 33% | 14.3% | 7 | 1 | 1 |  |  |
| activateJobs | POST | /jobs/activation | 3 | 33% | 10% | 10 | 1 | 3 |  |  |
| assignClientToGroup | PUT | /groups/{groupId}/clients/{clientId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| assignClientToTenant | PUT | /tenants/{tenantId}/clients/{clientId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| assignGroupToTenant | PUT | /tenants/{tenantId}/groups/{groupId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| assignMappingRuleToGroup | PUT | /groups/{groupId}/mapping-rules/{mappingRuleId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| assignMappingRuleToTenant | PUT | /tenants/{tenantId}/mapping-rules/{mappingRuleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| assignRoleToClient | PUT | /roles/{roleId}/clients/{clientId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| assignRoleToGroup | PUT | /roles/{roleId}/groups/{groupId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| assignRoleToMappingRule | PUT | /roles/{roleId}/mapping-rules/{mappingRuleId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| assignRoleToTenant | PUT | /tenants/{tenantId}/roles/{roleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| assignRoleToUser | PUT | /roles/{roleId}/users/{username} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| assignUserToGroup | PUT | /groups/{groupId}/users/{username} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| broadcastSignal | POST | /signals/broadcast | 1 | 33% | 10% | 10 | 1 | 1 |  |  |
| cancelProcessInstancesBatchOperation | POST | /process-instances/cancellation | 1 | 33% | 5.9% | 17 | 1 | 1 |  |  |
| correlateMessage | POST | /messages/correlation | 2 | 33% | 9.1% | 11 | 1 | 2 |  |  |
| createAuthorization | POST | /authorizations | 5 | 33% | 10% | 10 | 1 | 5 |  |  |
| createDocumentLink | POST | /documents/{documentId}/links | 1 | 33% | 16.7% | 6 | 1 |  | 1 |  |
| createElementInstanceVariables | PUT | /element-instances/{elementInstanceKey}/variables | 1 | 33% | 12.5% | 8 | 1 | 1 |  |  |
| createGroup | POST | /groups | 2 | 33% | 16.7% | 6 | 1 | 2 |  |  |
| createMappingRule | POST | /mapping-rules | 1 | 33% | 14.3% | 7 | 1 | 1 |  |  |
| createProcessInstance | POST | /process-instances | 1 | 33% | 5.6% | 18 | 1 |  |  | 1 |
| createRole | POST | /roles | 2 | 33% | 16.7% | 6 | 1 | 2 |  |  |
| createTenant | POST | /tenants | 2 | 33% | 14.3% | 7 | 1 | 2 |  |  |
| deleteGroup | DELETE | /groups/{groupId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| deleteMappingRule | DELETE | /mapping-rules/{mappingRuleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| deleteRole | DELETE | /roles/{roleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| evaluateDecision | POST | /decision-definitions/evaluation | 1 | 33% | 7.1% | 14 | 1 |  |  | 1 |
| getDocument | GET | /documents/{documentId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| getGroup | GET | /groups/{groupId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| getMappingRule | GET | /mapping-rules/{mappingRuleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| getRole | GET | /roles/{roleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| getUsageMetrics | GET | /system/usage-metrics | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| migrateProcessInstance | POST | /process-instances/{processInstanceKey}/migration | 2 | 33% | 8.3% | 12 | 1 | 2 |  |  |
| migrateProcessInstancesBatchOperation | POST | /process-instances/migration | 2 | 33% | 5.6% | 18 | 1 | 2 |  |  |
| modifyProcessInstancesBatchOperation | POST | /process-instances/modification | 2 | 33% | 5.6% | 18 | 1 | 2 |  |  |
| pinClock | PUT | /clock | 1 | 33% | 20% | 5 | 1 | 1 |  |  |
| publishMessage | POST | /messages/publication | 2 | 33% | 9.1% | 11 | 1 | 2 |  |  |
| resolveIncidentsBatchOperation | POST | /process-instances/incident-resolution | 1 | 33% | 5.9% | 17 | 1 | 1 |  |  |
| searchClientsForGroup | POST | /groups/{groupId}/clients/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| searchClientsForRole | POST | /roles/{roleId}/clients/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| searchGroupsForRole | POST | /roles/{roleId}/groups/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| searchMappingRulesForGroup | POST | /groups/{groupId}/mapping-rules/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| searchMappingRulesForRole | POST | /roles/{roleId}/mapping-rules/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| searchRolesForGroup | POST | /groups/{groupId}/roles/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| searchUsersForGroup | POST | /groups/{groupId}/users/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| searchUsersForRole | POST | /roles/{roleId}/users/search | 1 | 33% | 5.9% | 17 | 1 |  | 1 |  |
| throwJobError | POST | /jobs/{jobKey}/error | 1 | 33% | 14.3% | 7 | 1 | 1 |  |  |
| unassignClientFromGroup | DELETE | /groups/{groupId}/clients/{clientId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| unassignClientFromTenant | DELETE | /tenants/{tenantId}/clients/{clientId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| unassignGroupFromTenant | DELETE | /tenants/{tenantId}/groups/{groupId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| unassignMappingRuleFromGroup | DELETE | /groups/{groupId}/mapping-rules/{mappingRuleId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| unassignMappingRuleFromTenant | DELETE | /tenants/{tenantId}/mapping-rules/{mappingRuleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| unassignRoleFromClient | DELETE | /roles/{roleId}/clients/{clientId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| unassignRoleFromGroup | DELETE | /roles/{roleId}/groups/{groupId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| unassignRoleFromMappingRule | DELETE | /roles/{roleId}/mapping-rules/{mappingRuleId} | 2 | 33% | 33.3% | 3 | 1 |  | 2 |  |
| unassignRoleFromTenant | DELETE | /tenants/{tenantId}/roles/{roleId} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| unassignRoleFromUser | DELETE | /roles/{roleId}/users/{username} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| unassignUserFromGroup | DELETE | /groups/{groupId}/users/{username} | 1 | 33% | 33.3% | 3 | 1 |  | 1 |  |
| updateAuthorization | PUT | /authorizations/{authorizationKey} | 5 | 33% | 9.1% | 11 | 1 | 5 |  |  |
| updateGroup | PUT | /groups/{groupId} | 3 | 67% | 25% | 8 | 2 | 2 | 1 |  |
| updateJob | PATCH | /jobs/{jobKey} | 1 | 33% | 11.1% | 9 | 1 | 1 |  |  |
| updateMappingRule | PUT | /mapping-rules/{mappingRuleId} | 1 | 33% | 12.5% | 8 | 1 |  | 1 |  |
| updateRole | PUT | /roles/{roleId} | 3 | 67% | 25% | 8 | 2 | 2 | 1 |  |
| updateTenant | PUT | /tenants/{tenantId} | 2 | 33% | 14.3% | 7 | 1 | 2 |  |  |

Missing kinds per operation:
- activateAdHocSubProcessActivities: type-mismatch, union
- activateJobs: type-mismatch, union
- assignClientToGroup: missing-required, union
- assignClientToTenant: missing-required, union
- assignGroupToTenant: missing-required, union
- assignMappingRuleToGroup: missing-required, union
- assignMappingRuleToTenant: missing-required, union
- assignRoleToClient: missing-required, union
- assignRoleToGroup: missing-required, union
- assignRoleToMappingRule: missing-required, union
- assignRoleToTenant: missing-required, union
- assignRoleToUser: missing-required, union
- assignUserToGroup: missing-required, union
- broadcastSignal: type-mismatch, union
- cancelProcessInstancesBatchOperation: type-mismatch, union
- correlateMessage: type-mismatch, union
- createAuthorization: type-mismatch, union
- createDocumentLink: missing-required, union
- createElementInstanceVariables: type-mismatch, union
- createGroup: type-mismatch, union
- createMappingRule: type-mismatch, union
- createProcessInstance: missing-required, type-mismatch
- createRole: type-mismatch, union
- createTenant: type-mismatch, union
- deleteGroup: missing-required, union
- deleteMappingRule: missing-required, union
- deleteRole: missing-required, union
- evaluateDecision: missing-required, type-mismatch
- getDocument: missing-required, union
- getGroup: missing-required, union
- getMappingRule: missing-required, union
- getRole: missing-required, union
- getUsageMetrics: missing-required, union
- migrateProcessInstance: type-mismatch, union
- migrateProcessInstancesBatchOperation: type-mismatch, union
- modifyProcessInstancesBatchOperation: type-mismatch, union
- pinClock: type-mismatch, union
- publishMessage: type-mismatch, union
- resolveIncidentsBatchOperation: type-mismatch, union
- searchClientsForGroup: missing-required, union
- searchClientsForRole: missing-required, union
- searchGroupsForRole: missing-required, union
- searchMappingRulesForGroup: missing-required, union
- searchMappingRulesForRole: missing-required, union
- searchRolesForGroup: missing-required, union
- searchUsersForGroup: missing-required, union
- searchUsersForRole: missing-required, union
- throwJobError: type-mismatch, union
- unassignClientFromGroup: missing-required, union
- unassignClientFromTenant: missing-required, union
- unassignGroupFromTenant: missing-required, union
- unassignMappingRuleFromGroup: missing-required, union
- unassignMappingRuleFromTenant: missing-required, union
- unassignRoleFromClient: missing-required, union
- unassignRoleFromGroup: missing-required, union
- unassignRoleFromMappingRule: missing-required, union
- unassignRoleFromTenant: missing-required, union
- unassignRoleFromUser: missing-required, union
- unassignUserFromGroup: missing-required, union
- updateAuthorization: type-mismatch, union
- updateGroup: union
- updateJob: type-mismatch, union
- updateMappingRule: missing-required, union
- updateRole: union
- updateTenant: type-mismatch, union

Endpoint coverage: 65/145 (44.8%) have at least one scenario.

True Gaps Summary (applicable missing kinds aggregated):
| Kind | MissingOps | ApplicableOps | Missing% | SampleMissingOps |
| --- | --- | --- | --- | --- |
| param-missing | 49 | 49 | 100.0% | activateAdHocSubProcessActivities, assignClientToGroup, assignClientToTenant, assignGroupToTenant, assignMappingRuleToGroup |
| param-type-mismatch | 42 | 42 | 100.0% | assignClientToGroup, assignClientToTenant, assignGroupToTenant, assignMappingRuleToGroup, assignMappingRuleToTenant |
| additional-prop-general | 35 | 35 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| body-top-type-mismatch | 35 | 35 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| missing-body | 35 | 35 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| nested-additional-prop | 24 | 24 | 100.0% | activateAdHocSubProcessActivities, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage, createAuthorization |
| allof-conflict | 23 | 23 | 100.0% | activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage, createAuthorization |
| allof-missing-required | 23 | 23 | 100.0% | activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage, createAuthorization |
| type-mismatch | 23 | 65 | 35.4% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| constraint-violation | 22 | 22 | 100.0% | activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage, createElementInstanceVariables |
| format-invalid | 20 | 20 | 100.0% | activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage, createProcessInstance |
| enum-violation | 15 | 15 | 100.0% | cancelProcessInstancesBatchOperation, createAuthorization, createProcessInstance, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| missing-required-combo | 14 | 14 | 100.0% | activateJobs, correlateMessage, createAuthorization, createGroup, createRole |
| oneof-ambiguous | 14 | 14 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| oneof-cross-bleed | 14 | 14 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| oneof-multi-ambiguous | 14 | 14 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| oneof-none-match | 14 | 14 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| union | 12 | 14 | 85.7% | cancelProcessInstancesBatchOperation, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation, resolveIncidentsBatchOperation, searchClientsForGroup |
| unique-items-violation | 5 | 5 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation, resolveIncidentsBatchOperation |
| discriminator-mismatch | 1 | 1 | 100.0% | createProcessInstance |
| discriminator-structure-mismatch | 1 | 1 | 100.0% | createProcessInstance |
| missing-required | 0 | 23 | 0.0% |  |

<details><summary>Full per-operation True Gaps list</summary>
- activateAdHocSubProcessActivities: additional-prop-general, body-top-type-mismatch, missing-body, nested-additional-prop, param-missing, type-mismatch
- activateJobs: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, type-mismatch
- assignClientToGroup: param-missing, param-type-mismatch
- assignClientToTenant: param-missing, param-type-mismatch
- assignGroupToTenant: param-missing, param-type-mismatch
- assignMappingRuleToGroup: param-missing, param-type-mismatch
- assignMappingRuleToTenant: param-missing, param-type-mismatch
- assignRoleToClient: param-missing, param-type-mismatch
- assignRoleToGroup: param-missing, param-type-mismatch
- assignRoleToMappingRule: param-missing, param-type-mismatch
- assignRoleToTenant: param-missing, param-type-mismatch
- assignRoleToUser: param-missing, param-type-mismatch
- assignUserToGroup: param-missing, param-type-mismatch
- broadcastSignal: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, nested-additional-prop, type-mismatch
- cancelProcessInstancesBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- correlateMessage: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, type-mismatch
- createAuthorization: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, enum-violation, missing-body, missing-required-combo, nested-additional-prop, type-mismatch
- createDocumentLink: additional-prop-general, body-top-type-mismatch, missing-body, param-missing, param-type-mismatch
- createElementInstanceVariables: additional-prop-general, body-top-type-mismatch, constraint-violation, missing-body, nested-additional-prop, param-missing, type-mismatch
- createGroup: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, type-mismatch
- createMappingRule: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, missing-body, type-mismatch
- createProcessInstance: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, discriminator-mismatch, discriminator-structure-mismatch, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, unique-items-violation
- createRole: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, type-mismatch
- createTenant: additional-prop-general, body-top-type-mismatch, constraint-violation, missing-body, missing-required-combo, type-mismatch
- deleteGroup: param-missing, param-type-mismatch
- deleteMappingRule: param-missing, param-type-mismatch
- deleteRole: param-missing, param-type-mismatch
- evaluateDecision: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch
- getDocument: param-missing, param-type-mismatch
- getGroup: param-missing, param-type-mismatch
- getMappingRule: param-missing, param-type-mismatch
- getRole: param-missing, param-type-mismatch
- getUsageMetrics: param-missing, param-type-mismatch
- migrateProcessInstance: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, param-missing, type-mismatch
- migrateProcessInstancesBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- modifyProcessInstancesBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- pinClock: additional-prop-general, body-top-type-mismatch, missing-body, type-mismatch
- publishMessage: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, type-mismatch
- resolveIncidentsBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- searchClientsForGroup: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- searchClientsForRole: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- searchGroupsForRole: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- searchMappingRulesForGroup: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- searchMappingRulesForRole: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- searchRolesForGroup: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- searchUsersForGroup: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- searchUsersForRole: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, param-missing, param-type-mismatch, union
- throwJobError: additional-prop-general, body-top-type-mismatch, missing-body, nested-additional-prop, param-missing, type-mismatch
- unassignClientFromGroup: param-missing, param-type-mismatch
- unassignClientFromTenant: param-missing, param-type-mismatch
- unassignGroupFromTenant: param-missing, param-type-mismatch
- unassignMappingRuleFromGroup: param-missing, param-type-mismatch
- unassignMappingRuleFromTenant: param-missing, param-type-mismatch
- unassignRoleFromClient: param-missing, param-type-mismatch
- unassignRoleFromGroup: param-missing, param-type-mismatch
- unassignRoleFromMappingRule: param-missing, param-type-mismatch
- unassignRoleFromTenant: param-missing, param-type-mismatch
- unassignRoleFromUser: param-missing, param-type-mismatch
- unassignUserFromGroup: param-missing, param-type-mismatch
- updateAuthorization: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, enum-violation, missing-body, missing-required-combo, nested-additional-prop, param-missing, type-mismatch
- updateGroup: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, param-missing, param-type-mismatch
- updateJob: additional-prop-general, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, nested-additional-prop, param-missing, type-mismatch
- updateMappingRule: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, missing-body, param-missing, param-type-mismatch
- updateRole: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, param-missing, param-type-mismatch
- updateTenant: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, param-missing, type-mismatch
</details>

Applicable missing kinds are structurally possible for that operation and should be prioritized.
