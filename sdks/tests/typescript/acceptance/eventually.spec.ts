
import { ProcessInstanceApi, WithEventuality, WithTracing } from '../../../generated/typescript'

// DO NOT MODIFY - acceptance criteria
test('Has eventually consistent methods', () => {
    const processInstanceApi = new ProcessInstanceApi();
    const enhancedApi = WithEventuality(processInstanceApi);
    expect(typeof enhancedApi.searchProcessInstanceIncidents.eventually).toBe('function');
})

test('Has eventually consistent methods', () => {
    const processInstanceApi = new ProcessInstanceApi();
    const enhancedApi = WithTracing(WithEventuality(processInstanceApi));
    expect(typeof enhancedApi.searchProcessInstanceIncidents.eventually).toBe('function');
})
