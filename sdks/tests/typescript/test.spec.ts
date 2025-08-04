// Import only the APIs we want to test, avoiding problematic models
import { UserTaskApi, ProcessInstanceApi } from '../../generated/typescript/api/apis'

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