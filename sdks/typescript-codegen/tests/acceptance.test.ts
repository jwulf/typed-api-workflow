import { describe, it } from 'vitest';
import { Camunda } from '../src'

// Intentionally skipped. This is a type-assertion only.
describe('acceptance', () => {
    it.skip('createProcessInstance', () => {
        new Camunda().createProcessInstance({
            // @ts-expect-error intentional wrong type for compile-time demonstration
            processDefinitionId: 'sohe'
        })
    })
});