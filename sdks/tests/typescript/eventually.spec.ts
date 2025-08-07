import { ProcessInstanceApi } from '../../generated/typescript/api/apis'

// DO NOT MODIFY - This is the acceptance criteria for the feature
test('Has eventually consistent methods', () => {
    const processInstanceApi = new ProcessInstanceApi();
    expect(typeof (processInstanceApi.searchProcessInstanceIncidents as any).eventually).toBe('function');
})

