import { describe, it } from 'vitest';
import {ProcessInstanceService} from '../src'

describe('acceptance', () => {
    it.skip('createProcessInstance', () => {
        ProcessInstanceService.createProcessInstance({
            // @ts-expect-error intentional wrong type for compile-time demonstration
            requestBody: {processDefinitionId: 'sohe'}
        })
    })
});