import { DecisionInstanceFilter, DecisionDefinitionKey, ProcessDefinitionKey, ProcessInstanceFilterFields, ProcessInstanceKey, ProcessInstanceSearchQuery, } from '../../../generated/typescript/'

test.skip('can instantiate DecisionInstanceFilter', () => {
    const decisionInstanceFilter = new DecisionInstanceFilter();
    // @ts-expect-error
    decisionInstanceFilter.decisionInstanceKey = 'decisionInstanceKey123';
    decisionInstanceFilter.decisionDefinitionKey = DecisionDefinitionKey.create('decisionKey123');
    // @ts-expect-error
    decisionInstanceFilter.elementInstanceKey = 'elementInstanceKey123';
    expect(decisionInstanceFilter).toBeDefined();
});



// This test case should FAIL to compile when TypeScript is properly checking:
test.skip("This should NOT compile - raw strings in advanced filters", () => {
    const searchQuery2: ProcessInstanceSearchQuery = {
        filter: {
            // @ts-expect-error - This should fail because we don't allow raw strings in advanced filters
            processDefinitionKey: { $in: ["this_shouldn't_work"] }
        }
    }

    // This test should never run because the TypeScript should fail to compile
    expect(true).toBe(false)
})

test('Acceptance criteria for AdvancedFilters typing', () => {
    const processInstanceKey = ProcessInstanceKey.create("1234323")
    // Simple key search
    const case1: ProcessInstanceSearchQuery = { filter: { processInstanceKey } }
    // Advanced filter search
    const case2: ProcessInstanceSearchQuery = { filter: { processInstanceKey: { $in: [processInstanceKey] } } }
    expect(case1).toBeDefined()
    expect(case2).toBeDefined()
})