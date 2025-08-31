import { describe, it } from 'vitest';
import {createProcessInstance} from '../src'

describe('acceptance', () => {
    it.skip('createProcessInstance', () => {
        createProcessInstance({
            // @ts-expect-error intentional wrong type for compile-time demonstration
            requestBody: {processDefinitionId: 'sohe'}
        })
    })
});