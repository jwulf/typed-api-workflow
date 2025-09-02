import { describe, it, expect } from 'vitest';
import createCamundaClient from '../dist'

describe('acceptance', () => {
    it('can get the the current CamundaUser', async () => {
        const camunda = createCamundaClient() 
        const res = await camunda.getAuthentication()
        console.log(JSON.stringify(res, null, 2))
        expect(res).toBeDefined()
    })
});