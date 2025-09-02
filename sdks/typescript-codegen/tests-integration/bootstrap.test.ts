import { describe, it } from 'vitest';
import createCamundaClient from '../dist'

describe('acceptance', () => {
    it('can get the cluster topology', async () => {
        const camunda = createCamundaClient()
        const res = await camunda.getTopology()
        console.log(JSON.stringify(res, null, 2))
        expect(res).toBeDefined()
    })
});