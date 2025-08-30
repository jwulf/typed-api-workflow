import { describe, it, expect, expectTypeOf } from 'vitest';

// Demonstration of the proposed primitive branded key approach (NOT yet applied to generated code):
//  - Runtime value is a plain string.
//  - Brand makes plain string NOT assignable to the key.
//  - Different key brands are mutually exclusive with each other.
//  - Keys remain usable anywhere a plain string is accepted (one-way assignability).

type CamundaKeyBrand<T extends string> = string & { readonly __brand: T };

// Distinct key types (mutually exclusive)
export type ProcessInstanceKeyP = CamundaKeyBrand<'ProcessInstanceKey'>;
export type DecisionInstanceKeyP = CamundaKeyBrand<'DecisionInstanceKey'>;

// Lifter (factory) functions
const liftProcessInstanceKey = (v: string): ProcessInstanceKeyP => v as ProcessInstanceKeyP;
const liftDecisionInstanceKey = (v: string): DecisionInstanceKeyP => v as DecisionInstanceKeyP;

// Type-level helper to assert non-assignability in one direction
// We rely on expectTypeOf from Vitest which checks assignability relations.

describe('primitive branded key approach (demo)', () => {
  it('mutual exclusivity at the type level', () => {
    expectTypeOf<ProcessInstanceKeyP>().not.toMatchTypeOf<DecisionInstanceKeyP>();
    expectTypeOf<DecisionInstanceKeyP>().not.toMatchTypeOf<ProcessInstanceKeyP>();
  });

  it('plain string is not assignable to branded key, but branded key is usable as string', () => {
    // @ts-expect-error plain string should not be assignable to branded key
    const bad: ProcessInstanceKeyP = '123';
    const good: ProcessInstanceKeyP = liftProcessInstanceKey('123');

    // Branded key still matches string usages
    const upper = good.toUpperCase();
    expect(upper).toBe('123'.toUpperCase());

    // Type assertions
    expectTypeOf<string>().not.toMatchTypeOf<ProcessInstanceKeyP>();
    expectTypeOf<ProcessInstanceKeyP>().toMatchTypeOf<string>();


  });

  it('factories lift and keep runtime as primitive string', () => {
    const p = liftProcessInstanceKey('456');
    const d = liftDecisionInstanceKey('789');
    // Runtime checks
    expect(typeof p).toBe('string');
    expect(typeof d).toBe('string');
    // Keys with identical underlying string but different brands are still equal as strings
    const p2 = liftProcessInstanceKey('456');
    expect(p === p2).toBe(true); // same primitive string reference semantics
  });
});
