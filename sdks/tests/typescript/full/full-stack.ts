import {ProcessInstanceApi, ResourceApi, WithEventuality, ProcessInstanceSearchQuery, ObjectSerializer, WithTracing} from '../../../generated/typescript/dist/api'
import * as fs from 'fs'
import * as path from 'path'

// This test needs a running broker on localhost
main()
async function main() {
    const processApi = WithTracing(WithEventuality(new ProcessInstanceApi()));
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
        
        const processDefinition = deployment.deployments[0].processDefinition

        
        console.log(`Deployed process: ${processDefinition.processDefinitionId} (key: ${processDefinition.processDefinitionKey})`)

    // Create a process instance
    const createResponse = await processApi.createProcessInstance({
        processDefinitionKey: processDefinition?.processDefinitionKey
    })
    const processInstance = createResponse.body
    
    console.log(`Created process instance: ${processInstance.processInstanceKey}`)
    
    // Wait a moment for eventual consistency
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Search for the process instance we just created
    console.log('Searching for process instances...')
    const searchQuery: ProcessInstanceSearchQuery = {
        filter: {
            processDefinitionKey: processDefinition.processDefinitionKey
        }
    }

    console.log('Search query:', JSON.stringify(ObjectSerializer.serialize(searchQuery, 'ProcessInstanceSearchQuery'), null, 2))

    // await new Promise((res => setTimeout(() => res(null), 1000)))

    const searchResponse = await processApi.searchProcessInstances({filter: { processInstanceKey: processInstance.processInstanceKey}})
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

    console.log('Integration test completed successfully!')
}