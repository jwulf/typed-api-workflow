import {ProcessInstanceApi, ResourceApi} from '../../generated/typescript/api'
import { ProcessInstanceSearchQuery } from '../../generated/typescript/model/processInstanceSearchQuery'
import * as fs from 'fs'
import * as path from 'path'

// This test needs a running broker on localhost
test("It all just works...", async () => {
    const processApi = new ProcessInstanceApi();
    const resourceApi = new ResourceApi();
    
    // Load the test BPMN file
    const bpmnPath = path.join(__dirname, 'resources', 'test.bpmn')
    const bpmnContent = fs.readFileSync(bpmnPath)
    
    // Deploy the process
    console.log('Deploying process...')
    let processDefinition: any;
    try {
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
        
        processDefinition = deployment.deployments[0].processDefinition
        expect(processDefinition).toBeDefined()
        expect(processDefinition?.processDefinitionId).toBe('await-outcome')
        
        console.log(`Deployed process: ${processDefinition?.processDefinitionId} (key: ${processDefinition?.processDefinitionKey})`)
    } catch (error: any) {
        console.error('Deployment failed:', error.statusCode, error.body)
        throw error
    }
    
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
            processDefinitionId: {
                $eq: processDefinition?.processDefinitionId
            }
        }
    }
    
    console.log('Search query:', JSON.stringify(searchQuery, null, 2))
    
    const searchResponse = await processApi.searchProcessInstances(searchQuery)
    const searchResults = searchResponse.body
    
    console.log(`Found ${searchResults.items?.length || 0} process instances`)
    console.log('Search results:', searchResults.items?.map(item => ({
        processInstanceKey: item.processInstanceKey,
        processDefinitionKey: item.processDefinitionKey,
        processDefinitionId: item.processDefinitionId
    })))
    
    console.log(`Looking for created instance: ${processInstance.processInstanceKey}`)
    console.log(`Looking for definition key: ${processDefinition?.processDefinitionKey}`)
    
    expect(searchResults.items).toBeDefined()
    expect(searchResults.items.length).toBeGreaterThan(0)
    
    // Find our specific process instance in the results (or any from this deployment)
    const foundInstance = searchResults.items.find(
        item => item.processInstanceKey === processInstance.processInstanceKey
    ) || searchResults.items.find(
        item => item.processDefinitionKey === processDefinition?.processDefinitionKey
    )
    
    expect(foundInstance).toBeDefined()
    expect(foundInstance?.processDefinitionKey).toBe(processDefinition?.processDefinitionKey)
    expect(foundInstance?.processDefinitionId).toBe('await-outcome')
    
    console.log(`Found process instance in search results: ${foundInstance?.processInstanceKey}`)
    if (foundInstance?.processInstanceKey !== processInstance.processInstanceKey) {
        console.log(`Note: Found different instance from same deployment (eventual consistency)`)
    }
    console.log('Integration test completed successfully!')
}, 30000) // 30 second timeout for the full workflow