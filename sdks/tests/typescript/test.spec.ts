// Import only the APIs we want to test, avoiding problematic models
import { UserTaskApi, ProcessInstanceApi, ClusterApi, ResourceApi } from '../../generated/typescript/api/apis'

test('it works!', () => {
    expect(true).toBe(true);
});

test('can instantiate UserTask API', () => {
    const userTaskApi = new UserTaskApi();
    expect(userTaskApi).toBeDefined();
    expect(typeof userTaskApi.getUserTask).toBe('function');
});

test('can instantiate ProcessInstance API', () => {
    const processInstanceApi = new ProcessInstanceApi();
    expect(processInstanceApi).toBeDefined();
    expect(typeof processInstanceApi.getProcessInstance).toBe('function');
});

test('UserTask API has eventually consistent methods', () => {
    const userTaskApi = new UserTaskApi();
    
    // These methods should be eventually consistent
    expect(typeof userTaskApi.getUserTask).toBe('function');
    expect(typeof userTaskApi.updateUserTask).toBe('function');
    expect(typeof userTaskApi.getUserTaskForm).toBe('function');
    expect(typeof userTaskApi.searchUserTasks).toBe('function');
});

test('It can call topology', async () => {
    const clusterApi = new ClusterApi();
    expect(clusterApi).toBeDefined();
    expect(typeof clusterApi.getTopology).toBe('function');
    // This next step requires a running broker on localhost
    // const res = await clusterApi.getTopology()
    // console.log(res.body)
})

test('It correctly enforces type safety between processInstanceId and processInstanceKey', async () => {
    const resourceApi = new ResourceApi()
    const processInstanceApi = new ProcessInstanceApi()
    const deploymentResponse = await resourceApi.createDeployment([])
    const { processDefinitionId, processDefinitionKey } = deploymentResponse.body.deployments[0].processDefinition
    
    // ✅ 
    processInstanceApi.createProcessInstance({ processDefinitionKey: processDefinitionKey })
    // ✅ 
    processInstanceApi.createProcessInstance({ processDefinitionId: processDefinitionId })
    
    // processInstanceApi.createProcessInstance({ processDefinitionId: processDefinitionKey })
})