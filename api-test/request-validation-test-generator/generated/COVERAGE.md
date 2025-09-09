# Request Validation Coverage

Generated: 2025-09-08T04:26:59.482Z
Spec Commit: 177fb9193d6c4d0ab558734d76c501bbac1f2454

Total scenarios: 46

Scenario kinds generated this run: 2
Average kind coverage per operation: 50.0%
Operations with full kind coverage: 0/25

Kind coverage % = (# kinds present for operation / total scenario kinds this run) * 100.

Average applicable kind coverage (ops with applicability): 10.8%

| OperationId | Method | Path | Total | KindCov% | AppKindCov% | ApplicableKinds | PresentKinds | missing-required | union |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| activateAdHocSubProcessActivities | POST | /element-instances/ad-hoc-activities/{adHocSubProcessInstanceKey}/activation | 1 | 50% | 10% | 10 | 1 | 1 |  |
| activateJobs | POST | /jobs/activation | 3 | 50% | 10% | 10 | 1 | 3 |  |
| broadcastSignal | POST | /signals/broadcast | 1 | 50% | 10% | 10 | 1 | 1 |  |
| cancelProcessInstancesBatchOperation | POST | /process-instances/cancellation | 1 | 50% | 5.9% | 17 | 1 | 1 |  |
| correlateMessage | POST | /messages/correlation | 2 | 50% | 9.1% | 11 | 1 | 2 |  |
| createAuthorization | POST | /authorizations | 5 | 50% | 10% | 10 | 1 | 5 |  |
| createElementInstanceVariables | PUT | /element-instances/{elementInstanceKey}/variables | 1 | 50% | 12.5% | 8 | 1 | 1 |  |
| createGroup | POST | /groups | 2 | 50% | 16.7% | 6 | 1 | 2 |  |
| createMappingRule | POST | /mapping-rules | 1 | 50% | 14.3% | 7 | 1 | 1 |  |
| createProcessInstance | POST | /process-instances | 1 | 50% | 5.6% | 18 | 1 |  | 1 |
| createRole | POST | /roles | 2 | 50% | 16.7% | 6 | 1 | 2 |  |
| createTenant | POST | /tenants | 2 | 50% | 14.3% | 7 | 1 | 2 |  |
| evaluateDecision | POST | /decision-definitions/evaluation | 1 | 50% | 7.1% | 14 | 1 |  | 1 |
| migrateProcessInstance | POST | /process-instances/{processInstanceKey}/migration | 2 | 50% | 8.3% | 12 | 1 | 2 |  |
| migrateProcessInstancesBatchOperation | POST | /process-instances/migration | 2 | 50% | 5.6% | 18 | 1 | 2 |  |
| modifyProcessInstancesBatchOperation | POST | /process-instances/modification | 2 | 50% | 5.6% | 18 | 1 | 2 |  |
| pinClock | PUT | /clock | 1 | 50% | 20% | 5 | 1 | 1 |  |
| publishMessage | POST | /messages/publication | 2 | 50% | 9.1% | 11 | 1 | 2 |  |
| resolveIncidentsBatchOperation | POST | /process-instances/incident-resolution | 1 | 50% | 5.9% | 17 | 1 | 1 |  |
| throwJobError | POST | /jobs/{jobKey}/error | 1 | 50% | 14.3% | 7 | 1 | 1 |  |
| updateAuthorization | PUT | /authorizations/{authorizationKey} | 5 | 50% | 9.1% | 11 | 1 | 5 |  |
| updateGroup | PUT | /groups/{groupId} | 2 | 50% | 12.5% | 8 | 1 | 2 |  |
| updateJob | PATCH | /jobs/{jobKey} | 1 | 50% | 11.1% | 9 | 1 | 1 |  |
| updateRole | PUT | /roles/{roleId} | 2 | 50% | 12.5% | 8 | 1 | 2 |  |
| updateTenant | PUT | /tenants/{tenantId} | 2 | 50% | 14.3% | 7 | 1 | 2 |  |

Missing kinds per operation:
- activateAdHocSubProcessActivities: union
- activateJobs: union
- broadcastSignal: union
- cancelProcessInstancesBatchOperation: union
- correlateMessage: union
- createAuthorization: union
- createElementInstanceVariables: union
- createGroup: union
- createMappingRule: union
- createProcessInstance: missing-required
- createRole: union
- createTenant: union
- evaluateDecision: missing-required
- migrateProcessInstance: union
- migrateProcessInstancesBatchOperation: union
- modifyProcessInstancesBatchOperation: union
- pinClock: union
- publishMessage: union
- resolveIncidentsBatchOperation: union
- throwJobError: union
- updateAuthorization: union
- updateGroup: union
- updateJob: union
- updateRole: union
- updateTenant: union

Endpoint coverage: 25/145 (17.2%) have at least one scenario.

True Gaps Summary (applicable missing kinds aggregated):
| Kind | MissingOps | ApplicableOps | Missing% | SampleMissingOps |
| --- | --- | --- | --- | --- |
| additional-prop-general | 25 | 25 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| body-top-type-mismatch | 25 | 25 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| missing-body | 25 | 25 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| type-mismatch | 25 | 25 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| nested-additional-prop | 16 | 16 | 100.0% | activateAdHocSubProcessActivities, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage, createAuthorization |
| allof-conflict | 15 | 15 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| allof-missing-required | 15 | 15 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| constraint-violation | 14 | 14 | 100.0% | activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage, createElementInstanceVariables |
| missing-required-combo | 14 | 14 | 100.0% | activateJobs, correlateMessage, createAuthorization, createGroup, createRole |
| format-invalid | 13 | 13 | 100.0% | activateAdHocSubProcessActivities, activateJobs, broadcastSignal, cancelProcessInstancesBatchOperation, correlateMessage |
| param-missing | 9 | 9 | 100.0% | activateAdHocSubProcessActivities, createElementInstanceVariables, migrateProcessInstance, throwJobError, updateAuthorization |
| enum-violation | 7 | 7 | 100.0% | cancelProcessInstancesBatchOperation, createAuthorization, createProcessInstance, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| oneof-ambiguous | 6 | 6 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| oneof-cross-bleed | 6 | 6 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| oneof-multi-ambiguous | 6 | 6 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| oneof-none-match | 6 | 6 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, evaluateDecision, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation |
| unique-items-violation | 5 | 5 | 100.0% | cancelProcessInstancesBatchOperation, createProcessInstance, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation, resolveIncidentsBatchOperation |
| union | 4 | 6 | 66.7% | cancelProcessInstancesBatchOperation, migrateProcessInstancesBatchOperation, modifyProcessInstancesBatchOperation, resolveIncidentsBatchOperation |
| param-type-mismatch | 2 | 2 | 100.0% | updateGroup, updateRole |
| discriminator-mismatch | 1 | 1 | 100.0% | createProcessInstance |
| discriminator-structure-mismatch | 1 | 1 | 100.0% | createProcessInstance |
| missing-required | 0 | 23 | 0.0% |  |

<details><summary>Full per-operation True Gaps list</summary>
- activateAdHocSubProcessActivities: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, format-invalid, missing-body, nested-additional-prop, param-missing, type-mismatch
- activateJobs: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, type-mismatch
- broadcastSignal: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, nested-additional-prop, type-mismatch
- cancelProcessInstancesBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- correlateMessage: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, type-mismatch
- createAuthorization: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, enum-violation, missing-body, missing-required-combo, nested-additional-prop, type-mismatch
- createElementInstanceVariables: additional-prop-general, body-top-type-mismatch, constraint-violation, missing-body, nested-additional-prop, param-missing, type-mismatch
- createGroup: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, type-mismatch
- createMappingRule: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, missing-body, type-mismatch
- createProcessInstance: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, discriminator-mismatch, discriminator-structure-mismatch, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, unique-items-violation
- createRole: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, type-mismatch
- createTenant: additional-prop-general, body-top-type-mismatch, constraint-violation, missing-body, missing-required-combo, type-mismatch
- evaluateDecision: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch
- migrateProcessInstance: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, param-missing, type-mismatch
- migrateProcessInstancesBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- modifyProcessInstancesBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- pinClock: additional-prop-general, body-top-type-mismatch, missing-body, type-mismatch
- publishMessage: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, missing-required-combo, nested-additional-prop, type-mismatch
- resolveIncidentsBatchOperation: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, constraint-violation, enum-violation, format-invalid, missing-body, nested-additional-prop, oneof-ambiguous, oneof-cross-bleed, oneof-multi-ambiguous, oneof-none-match, type-mismatch, union, unique-items-violation
- throwJobError: additional-prop-general, body-top-type-mismatch, missing-body, nested-additional-prop, param-missing, type-mismatch
- updateAuthorization: additional-prop-general, allof-conflict, allof-missing-required, body-top-type-mismatch, enum-violation, missing-body, missing-required-combo, nested-additional-prop, param-missing, type-mismatch
- updateGroup: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, param-missing, param-type-mismatch, type-mismatch
- updateJob: additional-prop-general, body-top-type-mismatch, constraint-violation, format-invalid, missing-body, nested-additional-prop, param-missing, type-mismatch
- updateRole: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, param-missing, param-type-mismatch, type-mismatch
- updateTenant: additional-prop-general, body-top-type-mismatch, missing-body, missing-required-combo, param-missing, type-mismatch
</details>

Applicable missing kinds are structurally possible for that operation and should be prioritized.
