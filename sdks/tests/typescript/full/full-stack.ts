// Import tracing setup FIRST - this must be done before any other imports
import './tracing';
import { tracer } from './tracing';

import {ProcessInstanceApi, ResourceApi, WithEventuality, ProcessInstanceSearchQuery, ObjectSerializer, WithTracing, ProcessDefinitionKey} from '../../../generated/typescript'
import * as fs from 'fs'
import * as path from 'path'
import { trace, SpanStatusCode } from '@opentelemetry/api';

// This test needs a running broker on localhost AND demonstrates OpenTelemetry tracing
main()
async function main() {
    console.log('🔍 Starting traced Camunda API test...');
    
    // Create a root span for the entire test
    const rootSpan = tracer.startSpan('camunda-integration-test');
    
    try {
        // Test both WithEventuality and WithTracing together
        // WithTracing will now work because we initialized the SDK above
        const processApi = WithTracing(WithEventuality(new ProcessInstanceApi()));
        const resourceApi = WithTracing(new ResourceApi());
    
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
        
        if (!deployment.deployments || deployment.deployments.length === 0) {
            throw new Error('No deployments found in response');
        }

        const processDefinition = deployment.deployments[0].processDefinition!;

        if (!processDefinition) {
            throw new Error('No process definition found in deployment');
        }
        
        console.log(`Deployed process: ${processDefinition.processDefinitionId} (key: ${processDefinition.processDefinitionKey})`)

    // Create a process instance
    const createResponse = await processApi.createProcessInstance({
        processDefinitionKey: processDefinition.processDefinitionKey,
    })

    const processInstance = createResponse.body
    
    if (!processInstance.processInstanceKey) {
        throw new Error('No process instance key returned');
    }
    
    console.log(`Created process instance: ${processInstance.processInstanceKey}`)

    const processDefinitionKey: ProcessDefinitionKey = processDefinition.processDefinitionKey!;
    // Search for the process instance we just created
    console.log('Searching for process instances...')
    const searchQuery: ProcessInstanceSearchQuery = {
        filter: {
            processDefinitionKey
        }
    }

    const processInstanceKey = processInstance.processInstanceKey

    const searchResponse = await processApi
        .searchProcessInstances
        .eventually({
            filter: { 
                processInstanceKey
            }
        }, undefined, {timeout: 3000})

    const searchResults = searchResponse.body
    
    console.log(`Found ${searchResults.items?.length || 0} process instances`)

    console.log('Integration test completed successfully!')
    
    // Mark the root span as successful
    rootSpan.setStatus({ code: SpanStatusCode.OK });
    
} catch (error) {
    console.error('Test failed:', error);
    rootSpan.recordException(error as Error);
    rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message });
    throw error;
} finally {
    // Always end the root span
    rootSpan.end();
    console.log('🔍 Root span completed');
}
}