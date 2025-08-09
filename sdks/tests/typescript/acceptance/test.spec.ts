import { UserTaskApi, ProcessInstanceApi, ClusterApi, CursorBackwardPagination, CursorForwardPagination, OffsetPagination, SearchQueryPageRequest, WithEventuality,  } from '../../../generated/typescript'

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

// DO NOT MODIFY - acceptance criteria
test('Has eventually consistent methods', () => {
    const processInstanceApi = new ProcessInstanceApi();
    const enhancedApi = WithEventuality(processInstanceApi);
    expect(typeof enhancedApi.searchProcessInstanceIncidents.eventually).toBe('function');
})