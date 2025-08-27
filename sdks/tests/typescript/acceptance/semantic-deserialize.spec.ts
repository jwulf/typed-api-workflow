import { ObjectSerializer, ProcessInstanceKey, ProcessDefinitionKey, ProcessInstanceResult } from '../../../generated/typescript';

describe('semantic key deserialization', () => {
  test('processInstanceKey JSON string becomes branded type', () => {
    // Provide all required properties for ProcessInstanceResult to satisfy Zod validation
    const json = {
      processDefinitionId: 'def',
      processDefinitionKey: '123',
      processDefinitionName: 'n',
      processDefinitionVersion: 1,
      processInstanceKey: '456',
      tenantId: '42',
      state: 'ACTIVE',
      hasIncident: false,
      startDate: new Date().toISOString()
    } as any;
    const obj = ObjectSerializer.deserialize(json, 'ProcessInstanceResult') as ProcessInstanceResult;
    expect((obj as any).processInstanceKey.__type).toBe('ProcessInstanceKey');
    expect(ProcessInstanceKey.getValue((obj as any).processInstanceKey)).toBe('456');
  });

  test('round-trip preserves semantic branding', () => {
    const original = {
      processDefinitionId: 'def',
      processDefinitionKey: ProcessDefinitionKey.create('111'),
      processDefinitionName: 'n',
      processDefinitionVersion: 1,
      processInstanceKey: ProcessInstanceKey.create('222'),
      tenantId: '42',
      state: 'ACTIVE',
      hasIncident: false,
      startDate: new Date()
    } as any;
    const serialized = ObjectSerializer.serialize(original, 'ProcessInstanceResult');
    const deserialized = ObjectSerializer.deserialize(serialized, 'ProcessInstanceResult') as any;
    expect(deserialized.processInstanceKey.__type).toBe('ProcessInstanceKey');
    expect(ProcessInstanceKey.getValue(deserialized.processInstanceKey)).toBe('222');
  });
});
