import { ObjectSerializer, CamundaUserResult, Username } from '../../../generated/typescript';

describe('edge-case nullables and nested structures', () => {
  test('CamundaUserResult displayName/email allow null when nullable', () => {
    // Provide a syntactically valid username that passes semantic key validation (digits expected)
    const obj: any = { username: Username.create('123'), tenants: [], groups: [], roles: [], salesPlanType: 'basic', c8Links: {}, canLogout: true, displayName: null, email: null };
    expect(() => ObjectSerializer.serialize(obj, 'CamundaUserResult')).not.toThrow();
  });

  test('CamundaUserResult rejects undefined required fields', () => {
    const bad: any = { username: Username.create('123'), tenants: [], groups: [], roles: [], salesPlanType: 'basic', c8Links: {}, /* canLogout missing */ };
    expect(() => ObjectSerializer.serialize(bad, 'CamundaUserResult')).toThrow(/Validation failed/);
  });
});
