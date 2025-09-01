import { describe, it, expect } from 'vitest';
import { OpenAPI } from '../src/gen';
import { configureNewgenRuntime } from '../src/gen/integrations';

describe('newgen runtime configuration hydration', () => {
  it('applies base URL and validation modes', () => {
    process.env.CAMUNDA_REST_ADDRESS = 'http://example:1234';
    process.env.CAMUNDA_SDK_VALIDATION = 'req:strict,res:warn';
    configureNewgenRuntime();
    expect(OpenAPI.BASE).toBe('http://example:1234/v2');
    expect(OpenAPI.validation?.req).toBe('strict');
    expect(OpenAPI.validation?.res).toBe('warn');
  });
});
