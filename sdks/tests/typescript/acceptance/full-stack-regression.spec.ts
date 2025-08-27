import { ProcessInstanceResult, ObjectSerializer, ProcessInstanceKey, ProcessDefinitionKey } from '../../../generated/typescript';

/**
 * Regression test: ensure that a minimal serialized ProcessInstanceResult round-trips with semantic key branding
 * and does NOT attempt any network interaction (previously only the full integration script exposed issues).
 * This guards against a regression where attributeTypeMap sync stripped semantic types causing plain strings.
 */
describe('full stack regression (semantic branding, no network)', () => {
  test('ProcessInstanceResult semantic keys survive serialize/deserialize without broker', () => {
    const minimal: any = {
      processDefinitionId: 'def',
      processDefinitionName: 'name',
      processDefinitionVersion: 1,
      processDefinitionKey: ProcessDefinitionKey.create('101'),
      processInstanceKey: ProcessInstanceKey.create('202'),
      tenantId: '1',
      state: 'ACTIVE',
      hasIncident: false,
      startDate: new Date()
    };
    const serialized = ObjectSerializer.serialize(minimal, 'ProcessInstanceResult');
    const deserialized = ObjectSerializer.deserialize(serialized, 'ProcessInstanceResult') as any as ProcessInstanceResult;
    expect(deserialized.processInstanceKey.__type).toBe('ProcessInstanceKey');
    expect(deserialized.processDefinitionKey.__type).toBe('ProcessDefinitionKey');
  });
});
