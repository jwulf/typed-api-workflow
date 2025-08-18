/* eslint-disable @typescript-eslint/no-explicit-any */
// Import tracing setup FIRST - this must be done before any other imports
import './tracing';
import { tracer } from './tracing';

import { ProcessInstanceApi, ResourceApi, WithEventuality, WithTracing, ProcessDefinitionKey, ProcessInstanceKey, ClusterApi, LicenseApi, UserApi, JobApi } from '../../../generated/typescript'
import * as fs from 'fs'
import * as path from 'path'
import { SpanStatusCode } from '@opentelemetry/api';

// This test needs a running broker on localhost AND demonstrates OpenTelemetry tracing
main()

// type guards for runtime inspection of CamundaKey types
function isProcessInstanceKey(value: any): value is ProcessInstanceKey {
    return value && typeof value === 'object' && value.__type === 'ProcessInstanceKey';
}

function isProcessDefinitionKey(value: any): value is ProcessDefinitionKey {
    return value && typeof value === 'object' && value.__type === 'ProcessDefinitionKey';
}

async function main() {
    console.log('🔍 Starting traced Camunda API test...');

    // Create a root span for the entire test
    const rootSpan = tracer.startSpan('camunda-integration-test');

    try {
        // Test both WithEventuality and WithTracing together
        // WithTracing will now work because we initialized the SDK above
        const processApi = WithTracing(WithEventuality(new ProcessInstanceApi()));
        const resourceApi = WithTracing(new ResourceApi());
        const clusterApi = new ClusterApi();
        const licenseApi = new LicenseApi();
        const userApi = new UserApi();
        const jobs = new JobApi();

        const topology = await clusterApi.getTopology();
        console.log('Cluster topology:', JSON.stringify(topology.body, null, 2));

        const license = await licenseApi.getLicense()
        console.log('License information:', JSON.stringify(license.body, null, 2))

        const user = await userApi.searchUsers({
            page: {
                // after: "0",
                from: 130,
                // before: "2",
                limit: 100,
            }
        })
        console.log('User information:', JSON.stringify(user.body, null, 2))

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

        // Search for the process instance we just created
        console.log('Searching for process instances...')
  
        const processInstanceKey = processInstance.processInstanceKey

        // const searchResponse = await processApi
        //     .searchProcessInstances({
        //         filter: {
        //             processInstanceKey
        //         },
        // })
        
        const searchResponse = await processApi
            .searchProcessInstances
            .eventually({
                filter: {
                    processInstanceKey
                }
            }, undefined, { timeout: 10000 }) // return result as soon as available or timeout after 10s
            .catch(e => {
                console.error(`Failed to find process instance in search within 5s, with error message: ${e.message}`)
                process.exit(1)
            })

        const searchResults = searchResponse.body

        console.log(`Found ${searchResults.items?.length || 0} process instances`)

        console.log(JSON.stringify(searchResults.items, null, 2))

        // Proper way to validate a ProcessInstanceKey
        const firstProcessInstanceKey = searchResults?.items?.[0].processInstanceKey;
        const isValidProcessInstanceKey = firstProcessInstanceKey ?
            ProcessInstanceKey.isValid(ProcessInstanceKey.getValue(firstProcessInstanceKey)) : false;

            console.log(`\nEven Chuck Norris, coding in vi on the production instance, gets type-safety at runtime:`)
        console.log(`- First result has valid ProcessInstanceKey: ${isValidProcessInstanceKey}`);

        console.log(`- First result ProcessInstanceKey is ProcessDefinitionKey: ${isProcessDefinitionKey(processInstanceKey)}`);
        console.log(`- First result ProcessInstanceKey is ProcessInstanceKey: ${isProcessInstanceKey(processInstanceKey)}`);

        const job = await jobs.activateJobs({
                type: 'console-log-complete-rest',
                maxJobsToActivate: 100,
                timeout: 30000,
                requestTimeout: 10000
            })

        console.log(`Activated job: ${job.body.jobs?.length} jobs`)

        await Promise.all(job.body.jobs.map(job => jobs.completeJob(job.jobKey!, {
            variables: {
                foo: 'bar'
            }
        })))

        console.log(`Completed job ${job.body.jobs![0].jobKey}`)
        
        console.log('\nIntegration test completed successfully!')

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