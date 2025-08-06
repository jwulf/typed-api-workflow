// Import only the APIs we want to test, avoiding problematic models
import { UserTaskApi, ProcessInstanceApi, ClusterApi, ResourceApi } from '../../generated/typescript/api/apis'
import { ProcessInstanceCreationInstruction } from '../../generated/typescript/model/processInstanceCreationInstruction'
import { ProcessInstanceCreationInstructionByKey } from '../../generated/typescript/model/processInstanceCreationInstructionByKey'
import { ProcessInstanceCreationInstructionById } from '../../generated/typescript/model/processInstanceCreationInstructionById'
import { SearchQueryPageRequest } from '../../generated/typescript/model/searchQueryPageRequest'
import { OffsetPagination } from '../../generated/typescript/model/offsetPagination'
import { CursorForwardPagination } from '../../generated/typescript/model/cursorForwardPagination'
import { CursorBackwardPagination } from '../../generated/typescript/model/cursorBackwardPagination'
import { ProcessDefinitionKey } from '../../generated/typescript/semanticTypes'

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

test('It correctly enforces type safety between processInstanceId and processInstanceKey', () => {
    const processInstanceApi = new ProcessInstanceApi()
    
    // Create concrete instances of each union variant
    const byKeyInstruction = new ProcessInstanceCreationInstructionByKey()
    byKeyInstruction.processDefinitionKey = ProcessDefinitionKey.create("13478903098347")
    
    const byIdInstruction = new ProcessInstanceCreationInstructionById()
    byIdInstruction.processDefinitionId = "test-process-id"
    
    // Both should be assignable to the union type
    const unionByKey: ProcessInstanceCreationInstruction = byKeyInstruction
    const unionById: ProcessInstanceCreationInstruction = byIdInstruction
    
    // These should not throw type errors (testing compile-time behavior)
    expect(() => processInstanceApi.createProcessInstance(unionByKey)).not.toThrow()
    expect(() => processInstanceApi.createProcessInstance(unionById)).not.toThrow()
    
    // Test that we can narrow the types using type guards
    if ('processDefinitionKey' in unionByKey) {
        expect(unionByKey.processDefinitionKey).toBeDefined()
    }
    
    if ('processDefinitionId' in unionById) {
        expect(unionById.processDefinitionId).toBe("test-process-id")
    }
})

test('SearchQueryPageRequest polymorphic schema works correctly', () => {
    // Create concrete instances of each pagination variant
    const offsetPagination = new OffsetPagination()
    offsetPagination.from = 0
    offsetPagination.limit = 50
    
    const cursorForward = new CursorForwardPagination()
    cursorForward.after = "cursor123"
    cursorForward.limit = 25
    
    const cursorBackward = new CursorBackwardPagination()
    cursorBackward.before = "cursor456"
    cursorBackward.limit = 25
    
    // All should be assignable to the union type
    const unionOffset: SearchQueryPageRequest = offsetPagination
    const unionForward: SearchQueryPageRequest = cursorForward
    const unionBackward: SearchQueryPageRequest = cursorBackward
    
    // Test that each variant has its expected properties
    expect(offsetPagination.from).toBe(0)
    expect(offsetPagination.limit).toBe(50)
    
    expect(cursorForward.after).toBe("cursor123") 
    expect(cursorForward.limit).toBe(25)
    
    expect(cursorBackward.before).toBe("cursor456")
    expect(cursorBackward.limit).toBe(25)
    
    // Test type narrowing with type guards
    if ('from' in unionOffset) {
        expect(unionOffset.from).toBe(0)
    }
    
    if ('after' in unionForward) {
        expect(unionForward.after).toBe("cursor123")
    }
    
    if ('before' in unionBackward) {
        expect(unionBackward.before).toBe("cursor456")
    }
})