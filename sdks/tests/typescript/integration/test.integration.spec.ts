import {ProcessInstanceApi, ResourceApi, WithEventuality, ProcessInstanceSearchQuery} from '../../../generated/typescript/'
import * as fs from 'fs'
import * as path from 'path'

// This test needs a running broker on localhost
test("It all just works...", async () => {
    const processApi = WithEventuality(new ProcessInstanceApi());
    const resourceApi = new ResourceApi();
    
    // Load the test BPMN file
    const bpmnPath = path.join(__dirname, 'resources', 'test.bpmn')
    const bpmnContent = fs.readFileSync(bpmnPath)
    
    // Deploy the process
    console.log('Deploying process...')
 
        const deploymentResponse = await resourceApi.createDeployment([{
            value: bpmnContent,
            options: {
                filename: 'test.bpmn',
                contentType: 'application/xml'
            }
        }])
        const deployment = deploymentResponse.body
        
        expect(deployment.deployments).toBeDefined()
        expect(deployment.deployments.length).toBeGreaterThan(0)
        
        const processDefinition = deployment.deployments[0].processDefinition
        expect(processDefinition).toBeDefined()
        expect(processDefinition?.processDefinitionId).toBe('hello-world-complete-rest')
        
        console.log(`Deployed process: ${processDefinition?.processDefinitionId} (key: ${processDefinition?.processDefinitionKey})`)

    
    // Create a process instance
    console.log('Creating process instance...')
    const createResponse = await processApi.createProcessInstance({
        processDefinitionKey: processDefinition?.processDefinitionKey
    })
    const processInstance = createResponse.body
    
    expect(processInstance.processInstanceKey).toBeDefined()
    expect(processInstance.processDefinitionKey).toBe(processDefinition?.processDefinitionKey)
    
    console.log(`Created process instance: ${processInstance.processInstanceKey}`)
    
    // Wait a moment for eventual consistency
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Search for the process instance we just created
    console.log('Searching for process instances...')
    const searchQuery: ProcessInstanceSearchQuery = {
        filter: {
            // Also works:
            // processDefinitionId: {
            //     $eq: processDefinition?.processDefinitionId
            // }
            // processDefinitionId: processDefinition?.processDefinitionId,
            processDefinitionKey: processDefinition.processDefinitionKey
        }
    }
    
    console.log('Search query:', JSON.stringify(searchQuery, null, 2))

    await new Promise((res => setTimeout(() => res, 1000)))

    const searchResponse = await processApi.searchProcessInstances.eventually({filter: { processInstanceKey: processInstance.processInstanceKey}})
    const searchResults = searchResponse.body
    
    console.log(`Found ${searchResults.items?.length || 0} process instances`)
    console.log('Search results:', searchResults.items?.map(item => ({
        processInstanceKey: item.processInstanceKey,
        processDefinitionKey: item.processDefinitionKey,
        processDefinitionId: item.processDefinitionId
    })))

    const searchResponse2 = await processApi.searchProcessInstances({filter: { processInstanceKey: { $in: [processInstance.processInstanceKey] }}})
    const searchResults2 = searchResponse2.body

    console.log(`Found ${searchResults2.items?.length || 0} process instances`)
    console.log('Search results:', searchResults2.items?.map(item => ({
        processInstanceKey: item.processInstanceKey,
        processDefinitionKey: item.processDefinitionKey,
        processDefinitionId: item.processDefinitionId
    })))

    expect(searchResults2.items).toBeDefined()
    expect(searchResults2.items.length).toBeGreaterThan(0)

    console.log('Integration test completed successfully!')
}, 30000) // 30 second timeout for the full workflow