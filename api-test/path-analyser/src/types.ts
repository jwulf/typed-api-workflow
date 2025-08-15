export interface OperationRef {
  operationId: string;
  method: string;
  path: string;
  eventuallyConsistent?: boolean;
}

export interface OperationNode extends OperationRef {
  requires: {
    required: string[];
    optional: string[];
  };
  produces: string[];
  edges?: string[]; // adjacency (if present in graph)
  // Map of semantic type -> whether this operation is an authoritative provider for it
  providerMap?: Record<string, boolean>;
  eventuallyConsistent?: boolean; // indicates need to await stabilization after invocation
  // Domain augmentation (optional)
  domainRequiresAll?: string[];             // additional domain state requirements (strict)
  domainDisjunctions?: string[][];          // each inner array: satisfy at least one
  domainProduces?: string[];                // domain states/capabilities produced
  domainImplicitAdds?: string[];            // implicit states added on success
}

export interface OperationGraph {
  operations: Record<string, OperationNode>;
  bySemanticProducer: Record<string, string[]>;
  bootstrapSequences?: BootstrapSequence[];
  domain?: DomainSemantics; // loaded sidecar
  domainProducers?: Record<string, string[]>; // domain state -> operations
}

export interface BootstrapSequence {
  name: string;
  description?: string;
  operations: string[]; // ordered operationIds
  produces: string[];   // declared semantic types produced by the full sequence
}

export interface EndpointScenario {
  id: string;
  name?: string;                     // human-friendly short name
  description?: string;              // human-readable description of scenario intent & composition
  operations: OperationRef[];            // ordered (final endpoint last)
  producedSemanticTypes: string[];
  satisfiedSemanticTypes: string[];      // semantic types endpoint needs
  missingSemanticTypes?: string[];       // only for unsatisfied scenario
  cycleInvolved?: boolean;
  productionMap?: Record<string, string>; // semanticType -> operationId
  providerList?: Record<string,string[]>; // semanticType -> all producing opIds encountered
  bootstrapSequencesUsed?: string[];     // names of bootstrap sequences contributing
  bootstrapFull?: boolean;               // true if a single bootstrap sequence satisfied all required semantic types
  hasEventuallyConsistent?: boolean;     // true if any operation in chain is eventually consistent
  eventuallyConsistentCount?: number;    // count of operations in chain that are eventually consistent
  // Domain scenario augmentation
  domainStatesProduced?: string[];       // domain states realized along chain
  domainStatesRequired?: string[];       // domain states required (flattened)
  models?: GeneratedModelSpec[];         // synthesized models needed
  bindings?: Record<string,string>;      // symbolic variable bindings for identifiers / types
  artifactsApplied?: string[];           // ids of artifact rules applied
  eventualConsistencyOps?: string[];     // operationIds that are eventually consistent in chain
  // Feature coverage strategy additions
  strategy?: 'integrationPath' | 'featureCoverage';
  variantKey?: string;                  // structured key summarizing variant dimensions
  expectedResult?: { kind: 'nonEmpty' | 'empty' | 'error'; code?: string };
  coverageTags?: string[];              // dimension tags e.g. optional:FormKey, disjunction:alt-1
  filtersUsed?: string[];               // semantic / parameter filters applied
  syntheticBindings?: string[];         // variables created without a producing op
  // Request variant / filter coverage enrichments
  requestVariants?: { groupId: string; variant: string; richness: 'minimal' | 'rich'; }[];
  exclusivityViolations?: string[];    // for negative mutual exclusivity tests
  filtersDetail?: FilterDetail[];      // structured filter dimension info
  // Response shape (for future assertion synthesis)
  responseShapeSemantics?: string[];   // semantic types inferred from response fields
  responseShapeFields?: { name: string; type: string; semantic?: string; required?: boolean; }[];
  requestPlan?: RequestStep[];          // concrete request assembly plan per operation (ordered)
}

export interface EndpointScenarioCollection {
  endpoint: OperationRef;
  requiredSemanticTypes: string[];
  optionalSemanticTypes: string[];
  scenarios: EndpointScenario[];
  unsatisfied?: boolean;
}

export interface GenerationSummaryEntry {
  operationId: string;
  method: string;
  path: string;
  scenarioCount: number;
  unsatisfied: boolean;
  missingSemanticTypes?: string[];
}

// Feature coverage variant spec (internal planning structure)
export interface FeatureVariantSpec {
  endpointId: string;
  optionals: string[];        // optional semantics included
  disjunctionChoices: string[]; // chosen element per disjunction group (flattened)
  artifactSemantics: string[]; // semantics that require artifact production
  negative?: boolean;         // expect empty or error
  expectedResult: 'nonEmpty' | 'empty' | 'error';
  requestVariantGroup?: string; // oneOf group id
  requestVariantName?: string;  // specific variant id/name
  requestVariantRichness?: 'minimal' | 'rich';
}

export interface GenerationSummary {
  generatedAt: string;
  nodeVersion: string;
  endpoints: GenerationSummaryEntry[];
}

// -------- Response schema extraction ---------

export interface ResponseShapeField {
  name: string;
  type: string; // string|integer|boolean|object|array|unknown
  required?: boolean;
  semantic?: string; // mapped semantic type if recognized
  elementType?: string; // for arrays
  objectRef?: string;   // referenced schema name
}

export interface ResponseShapeSummary {
  operationId: string;
  contentTypes: string[];
  fields: ResponseShapeField[]; // flattened top-level fields
  producedSemantics?: string[];
  successStatus?: number; // primary success HTTP status code
}

// -------- Request oneOf variant extraction ---------

export interface RequestOneOfVariant {
  groupId: string;
  variantName: string;
  required: string[];
  optional: string[];
  discriminator?: { field: string; value: string };
}

export interface RequestOneOfGroupSummary {
  operationId: string;
  groupId: string;
  variants: RequestOneOfVariant[];
  unionFields: string[]; // all distinct field names across variants
}

export interface ExtractedRequestVariantsIndex {
  byOperation: Record<string, RequestOneOfGroupSummary[]>;
}

export interface RequestStep {
  operationId: string;
  method: string;
  pathTemplate: string;
  pathParams?: { name: string; var: string }[];
  bodyTemplate?: any; // object with ${var} placeholders
  expect: { status: number };
  extract?: { fieldPath: string; bind: string; semantic?: string }[];
  notes?: string;
}

// Filter dimension details for feature coverage
export interface FilterDetail {
  field: string;
  operator: string;
  valueVar: string | string[];
  negative?: boolean;
}

// -------- Domain semantics sidecar ---------

export interface DomainSemantics {
  version: number;
  identifiers?: Record<string, IdentifierSpec>;
  capabilities?: Record<string, CapabilitySpec>;
  runtimeStates?: Record<string, RuntimeStateSpec>;
  operationRequirements?: Record<string, OperationDomainRequirements>;
  artifactKinds?: Record<string, ArtifactKindSpec>;
  semanticTypeToArtifactKind?: Record<string,string>;
  operationArtifactRules?: Record<string, OperationArtifactRuleSpec>;
}

export interface IdentifierSpec {
  kind: 'identifier';
  validityState: string;           // state name produced when bound
  boundBy: string[];               // operations producing validity state
  fieldPaths?: string[];           // where value appears in responses
  derivedVia?: string;             // capability linking
}

export interface CapabilitySpec {
  kind: 'capability';
  parameter: string;               // parameter variable name
  producedBy: string[];            // operations producing capability
  dependsOn?: string[];            // prerequisite states
}

export interface RuntimeStateSpec {
  kind: 'state';
  producedBy: string[];            // operations producing state
  parameter?: string;              // single parameter name
  parameters?: string[];           // multi parameters
  requires?: string[];             // prerequisite states
}

export interface OperationDomainRequirements {
  requires?: string[];             // states that must be present
  disjunctions?: string[][];       // sets where one of each required
  implicitAdds?: string[];         // states produced implicitly on success
  produces?: string[];             // produced states (override)
  valueBindings?: Record<string,string>; // request field -> state.parameter mapping
}

export interface ArtifactKindSpec {
  producesStates?: string[];
  producesSemantics?: string[];
  identifierType?: string;
}

export interface OperationArtifactRuleSpec {
  rules?: ArtifactRule[];           // optional when composable
  composable?: boolean;             // if true, generator composes artifacts via set cover
}

export interface ArtifactRule {
  id?: string;                 // optional identifier for rule referencing in scenarios
  artifactKind: string;        // key into artifactKinds
  priority?: number;           // lower number = higher priority
  producesSemantics?: string[]; // explicit override semantics; else derive from artifactKinds + semanticTypeToArtifactKind
  producesStates?: string[];   // additional domain states produced
}

export interface LongChainConfig {
  enabled: boolean;
  maxPreOps: number;          // maximum operations before endpoint (excluding endpoint)
  retainPerCluster?: { baseline?: number; longest?: number; highConsistency?: number; highDiversity?: number };
  minDeltaScore?: number;     // threshold for keeping further expansion
}

export interface ExtendedGenerationOpts {
  maxScenarios: number;
  longChains?: LongChainConfig;
}

export type GeneratedModelSpec = BpmnModelSpec | FormModelSpec;

export interface BpmnModelSpec {
  kind: 'bpmn';
  processDefinitionIdVar: string;
  serviceTasks?: { id: string; typeVar: string; }[];
}

export interface FormModelSpec {
  kind: 'form';
  formKeyVar: string;
}