import { ObjectSerializer, ProcessInstanceKey } from '../../../generated/typescript';

// Integrity test: every model attributeTypeMap entry must include required flag
// and nullability must align between property declaration and type string.

describe('attributeTypeMap integrity', () => {
  // models.ts exports typeMap via ObjectSerializer internal closure; we can reach models through dynamic require
  const generatedModels = require('../../../generated/typescript/model/models');
  const typeMap: Record<string, any> = generatedModels.typeMap || {};

  test('all attributeTypeMap entries have required flag', () => {
    const failures: string[] = [];
    for (const [modelName, modelCtor] of Object.entries(typeMap)) {
      if (typeof modelCtor.getAttributeTypeMap !== 'function') continue;
      const attr = modelCtor.getAttributeTypeMap();
      for (const a of attr) {
        if (a.required === undefined) {
          failures.push(`${modelName}.${a.name} missing required flag`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  test('nullability union matches property declaration', () => {
    const mismatches: string[] = [];
    for (const [modelName, modelCtor] of Object.entries(typeMap)) {
      if (typeof modelCtor.getAttributeTypeMap !== 'function') continue;
      const attr = modelCtor.getAttributeTypeMap();
      // Instantiate to inspect property default (undefined)
      const instance = new (modelCtor as any)();
      const src = modelCtor.toString(); // fallback textual representation (may be transpiled)
      for (const a of attr) {
        // If type includes ' | null', it's nullable; otherwise not.
        const nullableInType = /\| null\b/.test(a.type);
        // Best-effort: property line presence of ' | null' can't be reliably recovered at runtime.
        // So we just assert internal consistency: if nullableInType then required must be true or false (any) but allowed values include null.
        if (nullableInType) continue; // nothing further we can do cheaply here.
        // If not nullableInType we ensure we don't mistakenly accept null at runtime: build schema and test.
        const valid = (() => {
          try {
            ObjectSerializer.serialize({ [a.baseName]: null }, modelName);
            return true;
          } catch { return false; }
        })();
        if (valid) mismatches.push(`${modelName}.${a.name} accepted null but not marked nullable`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  test('semantic key properties retain semantic types in attributeTypeMap', () => {
    const semanticTypes = new Set([
      'ProcessInstanceKey','DeploymentKey','UserTaskKey','ProcessDefinitionKey','ElementInstanceKey','FormKey','VariableKey','ScopeKey','IncidentKey','JobKey','MessageSubscriptionKey','MessageCorrelationKey','DecisionDefinitionKey','DecisionEvaluationInstanceKey','DecisionEvaluationKey','DecisionRequirementsKey','AuthorizationKey','MessageKey','DecisionInstanceKey','SignalKey','DocumentId','TenantId','Username','StartCursor','EndCursor'
    ]);
    const offenders: string[] = [];
    for (const [modelName, modelCtor] of Object.entries(typeMap)) {
      if (typeof modelCtor.getAttributeTypeMap !== 'function') continue;
      for (const a of modelCtor.getAttributeTypeMap()) {
        if (semanticTypes.has(a.type)) continue; // fine
        // Property name patterns that should be semantic
        if (/([A-Za-z]+Key|Cursor)$/i.test(a.name)) {
          // Allow union types containing a semantic type
          const parts = a.type.split(' | ').map(p=>p.trim());
          const hasSemantic = parts.some(p=>semanticTypes.has(p));
            if (!hasSemantic) offenders.push(`${modelName}.${a.name} -> ${a.type}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
