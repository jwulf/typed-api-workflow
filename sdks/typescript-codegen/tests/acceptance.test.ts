import { describe, it } from 'vitest';
import {Camunda8} from '../src'

describe('acceptance', () => {
    it.skip('createProcessInstance', () => {
        new Camunda8().createProcessInstance({
            // @ts-expect-error intentional wrong type for compile-time demonstration
            processDefinitionId: 'sohe'
        })
    })
});