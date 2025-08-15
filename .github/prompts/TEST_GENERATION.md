We have an OpenAPI schema that contains semantic types: rest-api.domain.yaml. Request and response fields are defined using a schema that allows reasoning about the relationship between response fields and subsequent requests. 

We want to reason from responses and the required request fields to build a dependency graph to generate test scenarios.

Phase One 
Write a semantic graph extractor to traverse the schema and build the operation dependency graph. 
This operation dependency graph should be written to disk. 
The semantic graph extractor should be written in TypeScript in a subdirectory of the api-test directory.
Question: what is the best format for this graph? We will need to read it back later to generate test scenarios.

Phase Two
Write a parser that can build a complete map of the API, so that we can reason about the coverage of our test scenarios. 
This will need to be compared with our test paths. 
We can easily analyse endpoint coverage, but what about the range of valid and invalid requests?
Some requests are technically invalid, so we are testing things like required vs optional and serialisation type of fields.
There is also another layer: meaningfully valid requests. For example, it's an invalid operation to send a processDefinitionKey value in a processInstanceKey field. Both serialise to string, but the operation is semantically invalid. We want to test the API behaviour in these scenarios for both the correctness of the API and to test its behaviour on the surface. 
How do we reason about these scenarios and the coverage?

Phase Three
Write a program that loads the operation dependency graph, and finds test paths through the graph.
One thing to note here: the root of many paths is going to be deploy resource, to deploy a valid process definition and get a processDefinitionKey. I don't think this is encoded in the semantics of the OpenAPI schema, so we may need to assert this at the root of test paths as a dependency. 
Question: what strategies can we use to generate these?
Question: can we achieve 100% test path coverage?
Question: how do we generate both technically and semantically valid/invalid test scenarios?
We want to output this in an intermediate language format that can later be transformed to specific SDK implementations (like cURL / TypeScript SDK / C# / Python, etc) so that they can function as test suites for the SDK as well as the API. 

-----
We have another layer of semantics that is not currently captured in the schema. There are values that come from the user domain, but they are not arbitrary.

Let me give you two examples, and let's see if we can generalise this into a form that we can encode in the schema, or in combination with a supplementary model, so that we can reason about them.

`processDefinitionId` is a string. It is returned by `deployResources`, but it is in the process model that is deployed, set by the user. So if we call `createProcessInstance` using the "create by id" request body, there is no semantic key constraint, but we still need a dependency on `deployResource` and we need to assert that the returned `processInstanceId` satisfies a constraint for `createProcessInstance`.

This relationship and the nature of `processDefinitionId` is not captured in our current schema or dependency graph.

The second example is `activateJobs`. The `jobType` is a `string` in the schema, but this is again a user-set value in a process model that must be deployed. Additionally, a process instance must be started before a job can be activated. So we have various dependencies that aren't encoded in the specification (and additionally are domain constraints of the implementation and not aspects of the API, so they probably don't belong in the API spec).

In the case of `activateJobs`:

1. A process definition must be deployed.
2. An instance of that process definition must be started (using create process instance with the `processDefinitionKey` or the user-created `processInstanceId` that corresponds with the deployed model).
3. That process model must contain a service task (specific model structure).
4. The job type that we use must be the type of the service task in the model.

These are a set of constraints for meaningful test scenario generation that we need to express somehow.

What are your thoughts?
-----
High‑level: You need to model domain validity/capability states and user‑supplied identifiers distinct from system‑generated keys, then express operations’ prerequisites in terms of those states (not just raw scalar fields). Do it via a sidecar domain model (preferred) or new vendor extensions. Below is a generalized pattern and concrete proposal.

Core gaps you described:

User identifiers (processDefinitionId, job type) are plain strings in the OpenAPI, so today they look “free”, losing the dependency on a deployment that makes them valid.

Structural capabilities (process model contains a service task of type X) are preconditions for later operations (activateJobs) but not represented.

Runtime readiness states (an instance started) also missing.

Current graph only handles simple semantic types (keys); no notion of validity, capability, disjunction, or variable binding (job type value must match deployed model).

General semantic layers to introduce: 

- Layer 1 (existing): System keys (ProcessDefinitionKey, ProcessInstanceKey, JobKey, etc.) 
- Layer 2: User identifiers (ProcessDefinitionId, JobTypeValue) 
- Layer 3: Artifact capability states (ModelHasServiceTaskType[T]) 
- Layer 4: Runtime state transitions (ProcessDefinitionDeployed[Id], ProcessInstanceExists[Definition], JobAvailableForActivation[Type]) 
- Layer 5: Constraint relations / unification (activateJobs(jobType=J) requires ModelHasServiceTaskType[J] AND ProcessInstanceExists for a process containing that task)

Modeling primitives to add: 
- A. Identifier semantic type (class: identifier): user-provided, not “produced” by system, but becomes “valid” only after a binding operation. 
- B. Validity / state semantic types (class: state): produced by operations (e.g., createDeployment produces ProcessDefinitionDeployed(processDefinitionId)). 
- C. Capability semantic types (class: capability): produced by deployment based on artifact structure (ServiceTaskType[Payment], etc.)—can be wildcard/variable if enumerations unknown pre-runtime. 
- D. Derived runtime state types (ProcessInstanceExists[processDefinitionId]). 
- E. Value-parameterized semantic types: Use a variable (e.g., ServiceTaskType[$jobType]) with simple unification when matching operation requirements.

Sidecar domain model (recommended): Create file: domain-semantics.json (or .yaml). Example skeleton:

```json
{ 
    "identifiers": { 
        "ProcessDefinitionId": { 
            "kind": "identifier", 
            "validityState": "ProcessDefinitionDeployed", 
            "boundBy": ["createDeployment"], // ops producing the validity state 
            "fieldPaths": ["deployment.resources[].processes[].bpmnProcessId"] 
        }, 
        "JobTypeValue": { 
            "kind": "identifier", 
            "derivedVia": "ModelHasServiceTaskType", 
            "boundBy": ["createDeployment"] 
        } 
    }, 
    "capabilities": { 
        "ModelHasServiceTaskType": { 
            "kind": "capability", 
            "parameter": "jobType", 
            "producedBy": ["createDeployment"], // implies scan of model or test fixture enumeration
            "dependsOn": ["ProcessDefinitionDeployed"] 
        } 
    }, 
    "runtimeStates": { 
        "ProcessDefinitionDeployed": { 
            "kind": "state", 
            "parameter": "processDefinitionId", 
            "producedBy": ["createDeployment"] 
        }, 
        "ProcessInstanceExists": { 
            "kind": "state", 
            "parameter": "processDefinitionId", 
            "producedBy": ["createProcessInstance"], 
            "requires": ["ProcessDefinitionDeployed"] }, 
            "JobAvailableForActivation": { "kind": "state", "parameters": ["jobType","processDefinitionId"], 
            "producedBy": ["activateJobs"], 
            "requires": ["ProcessInstanceExists","ModelHasServiceTaskType"] 
        } 
    }, 
    "operationRequirements": { 
        "createProcessInstance": { 
            "disjunctions": [ 
                ["ProcessDefinitionKey","ProcessDefinitionDeployed"] // satisfy at least one 
            ], 
            "implicitAdds": ["ProcessInstanceExists"] // produced on success 
        }, 
        "activateJobs": { 
            "requires": ["ProcessInstanceExists","ModelHasServiceTaskType"], 
            "valueBindings": { 
                "request.jobType": "ModelHasServiceTaskType.jobType" 
            }, 
            "produces": ["JobAvailableForActivation"] 
        } 
    } 
}
```

Algorithm extension ideas:

- Ingest sidecar; expand graph with synthetic nodes for state/capability production (or attach producedStates / requiredStates arrays to existing operation nodes).
- Add requirement groups (disjunctions): BFS must cover each group by at least one satisfied member.
- Treat identifier vs validity: Operations never require bare identifier; they require its validity state (e.g., ProcessDefinitionDeployed). If request allows raw ID path without key, you still encode dependency via validity state.
- Variable binding: When first producing a parameterized capability (ServiceTaskType[Payment]), bind the variable value; later requirements with same symbolic variable unify; if unmatched value appears, branch separate scenario.
- Incidental vs authoritative producers: For new states, mark deployment as authoritative (provider:true) so incidental appearances (like processDefinitionKey echoed elsewhere) don’t create redundant chains.
- If BPMN parsing is out-of-scope: Option: Provide test fixture enumerations of service task types in sidecar (static list per deployment fixture). Or: Allow placeholder wildcard (ServiceTaskType[*]) and still enforce ordering without enumerating actual types.

Vendor extension alternative (if you want everything inside OpenAPI):

x-domain-identifier: { name: "ProcessDefinitionId", validity: "ProcessDefinitionDeployed" }
x-produces-states: [ { state: "ProcessDefinitionDeployed", paramFrom: "response.processes[].bpmnProcessId" } ]
x-requires-states: [...] But this pollutes the API spec with internal test semantics; sidecar keeps separation cleaner.

Migration path (incremental): Step 1: Introduce sidecar with identifiers + runtimeStates for ProcessDefinitionId / ProcessDefinitionDeployed / ProcessInstanceExists. Step 2: Modify graph loader to add these as semantic types; update generator to treat disjunction (Key OR DeployedId). Step 3: Add capabilities (ServiceTaskType[jobType]) using wildcard; enforce ordering for activateJobs. Step 4: Add variable binding & refine jobType matching. Step 5: Optimize scenario explosion (dedupe by bound variable map).

Data structures to add in types: 
```typescript
interface DomainAugmentation { 
    identifiers: Record<string, IdentifierSpec>; 
    capabilities: Record<string, CapabilitySpec>; 
    runtimeStates: Record<string, StateSpec>; 
    operationRequirements: Record<string, OperationDomainRequirements>; 
} 
```
Add to `OperationNode`: 
```typescript
domainRequires?: DomainRequirementClause; // with disjunction groups + strict requires domainProduces?: string[]; variableBindings?: Record<string,string>;
```
Edge cases:

- Multiple deployments of same ProcessDefinitionId (user must keep unique) – treat latest as producing same state; scenario generator doesn’t need to duplicate.
- JobType absent in model → scenario invalid; generator should only propose jobType variable after capability produced; else skip.
- Optional filter usage: If ProcessDefinitionKey optional, scenario with no prior deployment still valid but less meaningful; you can rank scenarios preferring satisfaction of domain states.
- Ranking heuristic improvement: Score scenario = (# satisfied optional domain states) + weight(provider authoritative). Keep top N.

Deliverable next (if you want implementation):

- Create domain-semantics.json with initial ProcessDefinitionId / states.
- Extend loader & generator as above.
- Regenerate; verify `searchProcessDefinitions` scenarios now start with createDeployment (no activateJobs substitution just for incidental `ProcessDefinitionKey` unless combined with other needed states).

Tell me if you’d like me to scaffold the sidecar file and the loader changes; I can proceed. 