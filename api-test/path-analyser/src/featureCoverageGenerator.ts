import { OperationGraph, EndpointScenarioCollection, EndpointScenario, OperationRef, FeatureVariantSpec, RequestOneOfGroupSummary } from './types.js';

interface FeatureCoverageOptions {
  maxOptionalPairs: number;
  includeAllOptionalsThreshold: number;
  generateNegative: boolean;
  requestVariants?: RequestOneOfGroupSummary[]; // injected extracted request variant groups
  // Cap for pairwise oneOf negatives per endpoint to avoid explosion
  oneOfPairwiseMax?: number;
}

const DEFAULT_OPTS: FeatureCoverageOptions = {
  maxOptionalPairs: 20,
  includeAllOptionalsThreshold: 5,
  generateNegative: true,
  oneOfPairwiseMax: 10
};

export function generateFeatureCoverageForEndpoint(graph: OperationGraph, endpointOpId: string, opts: Partial<FeatureCoverageOptions> = {}): EndpointScenarioCollection {
  const endpoint = graph.operations[endpointOpId];
  const options = { ...DEFAULT_OPTS, ...opts };
  const required = [...endpoint.requires.required];
  const optional = [...endpoint.requires.optional];
  const variants: FeatureVariantSpec[] = [];

  // Artifact coverage: if domain has artifact rules for this operation, generate a base variant per rule
  const artifactRules = graph.domain?.operationArtifactRules?.[endpointOpId]?.rules || [];
  if (artifactRules.length) {
    for (const r of artifactRules) {
      variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'nonEmpty', artifactRuleId: r.id, artifactKind: r.artifactKind });
    }
  }

  // Base variant (minimal)
  // Generic base variant (only if no artifact rule already covers it)
  if (!artifactRules.length) {
    variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'nonEmpty' });
  }

  // Single optional variants
  for (const o of optional) {
    variants.push({ endpointId: endpointOpId, optionals: [o], disjunctionChoices: [], artifactSemantics: [o], expectedResult: 'nonEmpty' });
  }

  // All optionals variant if under threshold
  if (optional.length > 1 && optional.length <= options.includeAllOptionalsThreshold) {
    variants.push({ endpointId: endpointOpId, optionals: [...optional], disjunctionChoices: [], artifactSemantics: [...optional], expectedResult: 'nonEmpty' });
  }

  // Negative empty-result variant (if no required semantics)
  if (options.generateNegative && required.length === 0) {
    variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'empty', negative: true });
  }

  // Schema-missing-required negatives (fast 400 via request validator): generate combinations
  if (options.generateNegative) {
    try {
      // Derive required request fields from canonical shapes at emit time, so just mark here; combinations created in build
      variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'error', negative: true, schemaMissingRequired: true });
    } catch {}
  }

  // Request oneOf variants (minimal per variant)
  if (options.requestVariants && options.requestVariants.length) {
    for (const group of options.requestVariants) {
      for (const v of group.variants) {
        variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'nonEmpty', requestVariantGroup: group.groupId, requestVariantName: v.variantName, requestVariantRichness: 'minimal' });
        // rich variant (required + optional) if there are optional fields
        if (v.optional.length) {
          variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'nonEmpty', requestVariantGroup: group.groupId, requestVariantName: v.variantName + ':rich', requestVariantRichness: 'rich' });
        }
      }
      // Only generate union violation negatives for genuine polymorphic unions
      const allowUnionNegatives = (group as any).isPolymorphic === true;
      // Union violation negative (all fields) if more than 1 variant and polymorphic
      if (allowUnionNegatives && group.variants.length > 1) {
        variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'error', negative: true, requestVariantGroup: group.groupId, requestVariantName: 'union-all', requestVariantRichness: 'rich' });
      }
      // Pairwise violation negatives only for polymorphic unions
      if (allowUnionNegatives && group.variants.length > 1) {
        const reqFields = group.variants.map(v => ({ name: v.variantName, req: v.required[0] || v.required[1] || v.required[2] || v.required[0] }));
        const pairs: Array<[string,string]> = [];
        for (let i=0;i<reqFields.length;i++) {
          for (let j=i+1;j<reqFields.length;j++) {
            const a = reqFields[i].req; const b = reqFields[j].req;
            if (a && b) pairs.push([a,b]);
          }
        }
        const cap = options.oneOfPairwiseMax ?? 10;
        for (let k=0;k<Math.min(cap, pairs.length); k++) {
          const [a,b] = pairs[k];
          variants.push({ endpointId: endpointOpId, optionals: [], disjunctionChoices: [], artifactSemantics: [], expectedResult: 'error', negative: true, requestVariantGroup: group.groupId, requestVariantName: `pair:${a}+${b}`, requestVariantRichness: 'minimal' });
        }
      }
    }
  }

  const scenarios: EndpointScenario[] = variants.map((v, i) => buildScenarioFromVariant(graph, endpointOpId, v, i + 1));

  return {
    endpoint: toRef(endpoint),
    requiredSemanticTypes: required,
    optionalSemanticTypes: optional,
    scenarios,
    unsatisfied: false
  };
}

function buildScenarioFromVariant(graph: OperationGraph, endpointId: string, variant: FeatureVariantSpec, index: number): EndpointScenario {
  const endpoint = graph.operations[endpointId];
  const opRefs: OperationRef[] = [toRef(endpoint)];
  const produced = new Set<string>();
  const bindings: Record<string,string> = {};
  // Heuristic: search-style endpoints (POST .../search) are lenient and return 200 on oneOf violations
  const isSearchStyle = endpoint && endpoint.method.toUpperCase() === 'POST' && /\/search$/.test(endpoint.path);
  // Synthetic bindings for negative variant
  if (variant.negative) {
    for (const o of variant.optionals) {
      const varName = camelLower(o) + 'Var';
      bindings[varName + 'Nonexistent'] = `${camelLower(o)}_nonexistent_${Math.random().toString(36).slice(2,6)}`;
    }
  } else {
    for (const o of variant.optionals) {
      produced.add(o);
      const varName = camelLower(o) + 'Var';
      bindings[varName] = `${camelLower(o)}_${Math.random().toString(36).slice(2,6)}`;
    }
  }
  const scenario: EndpointScenario = {
    id: `feature-${index}`,
  name: buildFeatureScenarioName(endpoint.operationId, variant, index),
  description: buildFeatureScenarioDescription(endpoint, variant),
    operations: opRefs,
    producedSemanticTypes: [...produced],
    satisfiedSemanticTypes: [...new Set([...endpoint.requires.required, ...variant.optionals])],
    strategy: 'featureCoverage',
    variantKey: buildVariantKey(variant),
  // For negative oneOf violations (union-all or pairwise), explicitly expect HTTP 400
  expectedResult: (variant.negative && variant.requestVariantGroup && (
    variant.requestVariantName === 'union-all' ||
    (typeof variant.requestVariantName === 'string' && variant.requestVariantName.startsWith('pair:'))
  )) ? (isSearchStyle ? { kind: 'nonEmpty' } : { kind: 'error', code: '400' })
    : (variant.schemaMissingRequired ? { kind: 'error', code: '400' } : { kind: variant.expectedResult }),
    coverageTags: buildCoverageTags(variant),
    filtersUsed: variant.optionals,
    syntheticBindings: variant.negative ? Object.keys(bindings) : undefined,
    bindings
  };
  if (variant.requestVariantGroup && variant.requestVariantName) {
    scenario.requestVariants = [{ groupId: variant.requestVariantGroup, variant: variant.requestVariantName, richness: variant.requestVariantRichness || 'minimal' }];
    if (variant.negative && variant.requestVariantName === 'union-all') scenario.exclusivityViolations = [`oneOf:${variant.requestVariantGroup}:union-all`];
  }
  // Tag artifact selection in scenario for downstream request planning
  if (variant.artifactRuleId || variant.artifactKind) {
    scenario.artifactsApplied = variant.artifactRuleId ? [variant.artifactRuleId] : [];
  }
  return scenario;
}

function buildVariantKey(v: FeatureVariantSpec): string {
  const parts: string[] = [];
  if (v.optionals.length) parts.push('opt=' + v.optionals.sort().join('+'));
  if (v.negative) parts.push('neg');
  if (v.schemaMissingRequired) parts.push('schemaMissingRequired');
  if (v.requestVariantGroup) parts.push(`oneOf=${v.requestVariantGroup}:${v.requestVariantName}`);
  return parts.join('|') || 'base';
}

function buildCoverageTags(v: FeatureVariantSpec): string[] {
  const tags: string[] = [];
  v.optionals.forEach(o => tags.push('optional:' + o));
  if (v.negative) tags.push('negative');
  if (v.requestVariantGroup) tags.push(`oneOf:${v.requestVariantGroup}:${v.requestVariantName}`);
  return tags;
}

function buildFeatureScenarioName(operationId: string, v: FeatureVariantSpec, index: number): string {
  if (v.artifactRuleId) return `${operationId} - ${v.artifactRuleId} (${index})`;
  // Special-case union-all negative before generic negative naming
  if (v.requestVariantGroup && typeof v.requestVariantName === 'string' && v.requestVariantName.startsWith('pair:')) {
    const pair = v.requestVariantName.slice('pair:'.length);
    return `${operationId} - oneOf ${v.requestVariantGroup} pair violation (${pair}) (${index})`;
  }
  if (v.requestVariantGroup && v.requestVariantName === 'union-all') {
    return `${operationId} - oneOf ${v.requestVariantGroup} union violation (${index})`;
  }
  if (v.schemaMissingRequired) return `${operationId} - negative missing required (${index})`;
  if (v.negative) return `${operationId} - negative empty (${index})`;
  if (v.requestVariantGroup) {
    if (v.requestVariantName === 'union-all') return `${operationId} - oneOf ${v.requestVariantGroup} union violation (${index})`;
    const base = `${operationId} - oneOf ${v.requestVariantGroup} ${v.requestVariantName}`;
    return v.requestVariantRichness === 'rich' ? `${base} rich (${index})` : `${base} (${index})`;
  }
  if (v.optionals.length === 0) return `${operationId} - base (${index})`;
  if (v.optionals.length === 1) return `${operationId} - with ${v.optionals[0]} (${index})`;
  return `${operationId} - with ${v.optionals.length} optionals (${index})`;
}

function buildFeatureScenarioDescription(endpoint: any, v: FeatureVariantSpec): string {
  const base = `Invoke ${endpoint.operationId} (${endpoint.method.toUpperCase()} ${endpoint.path})`;
  const isSearchStyle = endpoint && endpoint.method.toUpperCase() === 'POST' && /\/search$/.test(endpoint.path);
  if (v.artifactRuleId) return `${base} deploying ${v.artifactRuleId.toUpperCase()} artifact.`;
  // Special-case union-all negative before generic negative description
  if (v.requestVariantGroup && typeof v.requestVariantName === 'string' && v.requestVariantName.startsWith('pair:')) {
    const pair = v.requestVariantName.slice('pair:'.length);
    return `${base} with invalid oneOf payload containing conflicting fields (${pair}) from two different variants (pair union violation)${isSearchStyle ? '' : ' expecting 400 error'}.`;
  }
  if (v.requestVariantGroup && v.requestVariantName === 'union-all') {
    return `${base} with invalid oneOf payload containing ALL fields from group '${v.requestVariantGroup}' variants (union violation)${isSearchStyle ? '' : ' expecting 400 error'}.`;
  }
  if (v.schemaMissingRequired) return `${base} with a required field omitted to provoke 400 schema validation error.`;
  if (v.negative) return `${base} expecting empty result set; no producing setup provided for optionals.`;
  if (v.requestVariantGroup) {
  if (v.requestVariantName === 'union-all') return `${base} with invalid oneOf payload containing ALL fields from group '${v.requestVariantGroup}' variants (union violation) expecting 400 error.`;
    if (v.requestVariantRichness === 'rich') return `${base} using oneOf group '${v.requestVariantGroup}' variant '${v.requestVariantName}' with all optional fields present.`;
    return `${base} using oneOf group '${v.requestVariantGroup}' variant '${v.requestVariantName}' with minimal required fields.`;
  }
  if (v.optionals.length === 0) return `${base} with only required semantics.`;
  if (v.optionals.length === 1) return `${base} including optional semantic '${v.optionals[0]}'.`;
  return `${base} including all ${v.optionals.length} optional semantics: ${v.optionals.join(', ')}.`;
}

function camelLower(s: string): string { return s.charAt(0).toLowerCase() + s.slice(1); }

function toRef(op: { operationId: string; method: string; path: string; eventuallyConsistent?: boolean }): OperationRef {
  return { operationId: op.operationId, method: op.method, path: op.path, eventuallyConsistent: op.eventuallyConsistent };
}
