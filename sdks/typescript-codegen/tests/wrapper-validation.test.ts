import { describe, it, expect } from 'vitest';
import { ServicesWrapped } from '../src';

// These tests validate wrapper export presence without calling remote APIs.

describe('auto service wrapper exports', () => {
  it('exports ServicesWrapped map', () => {
    expect(ServicesWrapped).toBeDefined();
    expect(typeof ServicesWrapped).toBe('object');
    expect(Object.keys(ServicesWrapped).length).toBeGreaterThan(0);
  });
  it('includes a known service with at least one method', () => {
    // Pick a stable core service that's in the spec
    const svc = (ServicesWrapped as any).DecisionDefinitionService;
    expect(svc).toBeDefined();
    expect(typeof svc.getDecisionDefinition).toBe('function');
  });
});
