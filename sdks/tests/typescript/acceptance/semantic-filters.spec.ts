import { DecisionInstanceFilter, DecisionDefinitionKey, ProcessDefinitionKey, ProcessInstanceFilterFields, ProcessInstanceKey, ProcessInstanceSearchQuery, ProcessDefinitionSearchQuery, ElementInstanceKey, ElementInstanceSearchQuery, AdvancedProcessInstanceKeyFilter, ObjectSerializer, } from '../../../generated/typescript/'

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
            // @ts-expect-error - This *should* fail because we don't allow raw strings in advanced filters
            processDefinitionKey: { $in: ["this_shouldn't_work"] }
        }
    }
    const elementInstanceKey = ElementInstanceKey.create("213431341")
    const elementInstanceSearchQuery: ElementInstanceSearchQuery = {
        filter: {
            elementInstanceKey
        }
    }

    const elementInstanceSearchAdvancedFilter: ProcessInstanceSearchQuery = {
        filter: { parentElementInstanceKey: { $in: [elementInstanceKey] } }
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
    expect(case1.filter.processInstanceKey).toEqual(processInstanceKey)
    expect((case2.filter.processInstanceKey as AdvancedProcessInstanceKeyFilter).$in).toEqual([processInstanceKey])
})

test('Additional acceptance criteria for AdvancedFilters typing', () => {
    const opaqueValue = "234321234"
    const processDefinitionKey: ProcessDefinitionKey = ProcessDefinitionKey.create(opaqueValue);
    const searchQuery: ProcessInstanceSearchQuery = {
        filter: {
            processDefinitionKey: processDefinitionKey
        }
    }
    expect(searchQuery).toBeDefined()
    expect(processDefinitionKey.__type).toBe('ProcessDefinitionKey')
    expect(searchQuery.filter.processDefinitionKey).toEqual(processDefinitionKey)
    const serialised = ObjectSerializer.serialize(searchQuery, 'ProcessInstanceSearchQuery')
    expect(serialised.filter.processDefinitionKey).toBe(opaqueValue)

    const processInstanceKey = ProcessInstanceKey.create(opaqueValue)
    const case2: ProcessInstanceSearchQuery = { filter: { processInstanceKey: { $in: [processInstanceKey] } } }
    console.log(ProcessDefinitionKey.getValue(processInstanceKey as any))

    expect(processDefinitionKey as any === processInstanceKey).toBe(false) // We have type safety in the IDE, we want to validate runtime safety
})