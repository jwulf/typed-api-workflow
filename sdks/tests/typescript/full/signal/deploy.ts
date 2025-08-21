/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path'
import fs from 'fs'
import {
    ResourceApi,
    ProcessInstanceApi
} from '../../../../generated/typescript/dist/api'

deployProcess()
async function deployProcess() {

    // Load the test BPMN file
    const bpmnPath = path.join(__dirname, '..', 'resources', 'signal.bpmn')
    const bpmnContent = fs.readFileSync(bpmnPath)

    // Deploy the process    
    const deploymentResponse = await new ResourceApi().createDeployment([{
        value: bpmnContent,
        options: {
            filename: 'test.bpmn',
            contentType: 'application/xml'
        }
    }], undefined).catch((e: Error) => {
        console.log(`Deployment failed: ${e.message}`);
        process.exit(1)
    })

    const processDefinitionKey = deploymentResponse.body.deployments[0].processDefinition!.processDefinitionKey;

    const processInstanceApi = new ProcessInstanceApi()
    for (let i = 0; i < 10; i++) {
        const response = await processInstanceApi.createProcessInstance({
            processDefinitionKey,
            variables: {
                // Set any process variables here
            }
        })
        console.log(`Process instance created: ${JSON.stringify(response.body)}`);
    }
}