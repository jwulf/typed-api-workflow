import { describe, it, expect } from 'vitest';
import createCamundaClient from '../dist'
import fs from 'fs'

describe('acceptance', () => {
    it.skip('can get the the current CamundaUser', async () => {
        const camunda = createCamundaClient() 
        const res = await camunda.getAuthentication()
        console.log(JSON.stringify(res, null, 2))
        expect(res).toBeDefined()
    })
    it('can deploy a process model', async () => {
    const buffer = await fs.promises.readFile('./tests-integration/fixtures/test-process.bpmn');

    const copied = Uint8Array.from(buffer);
    const file = new File([copied], 'test-process.bpmn', { type: 'application/xml' });

        const camunda = createCamundaClient();

        // const result = await camunda.createDeployment(
        //   { resources: [file] }    
        // );

        const result = await camunda.deployResourcesFromFiles(['./tests-integration/fixtures/test-process.bpmn'])
        console.log(JSON.stringify(result, null, 2))
    })
});
