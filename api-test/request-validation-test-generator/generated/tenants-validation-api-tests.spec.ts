/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */
/*
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated At: 2025-09-08T02:40:57.021Z
 * Spec Commit: 3445d1d86c2ad361858dc12e734eeb6197e426a5
 */
import { test, expect } from '@playwright/test';
import { jsonHeaders, buildUrl } from '../../../../utils/http';

test.describe('Tenants Validation API Tests', () => {
  test('assignClientToTenant - Param clientId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/tenants/{tenantId}/clients/{clientId}', {
        tenantId: 'x',
        clientId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('assignGroupToTenant - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/tenants/{tenantId}/groups/{groupId}', {
        tenantId: 'x',
        groupId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('assignMappingRuleToTenant - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/tenants/{tenantId}/mapping-rules/{mappingRuleId}', {
        tenantId: 'x',
        mappingRuleId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('assignRoleToTenant - Param roleId wrong type', async ({ request }) => {
    const res = await request.put(
      buildUrl('/tenants/{tenantId}/roles/{roleId}', {
        tenantId: 'x',
        roleId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('createTenant - Missing name', async ({ request }) => {
    const requestBody = {
      tenantId: 'x',
    };
    const res = await request.post(buildUrl('/tenants', undefined), {
      headers: jsonHeaders(),
      data: requestBody,
    });
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('createTenant - Missing tenantId', async ({ request }) => {
    const requestBody = {
      name: 'x',
    };
    const res = await request.post(buildUrl('/tenants', undefined), {
      headers: jsonHeaders(),
      data: requestBody,
    });
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('unassignClientFromTenant - Param clientId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/tenants/{tenantId}/clients/{clientId}', {
        tenantId: 'x',
        clientId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('unassignGroupFromTenant - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/tenants/{tenantId}/groups/{groupId}', {
        tenantId: 'x',
        groupId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('unassignMappingRuleFromTenant - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/tenants/{tenantId}/mapping-rules/{mappingRuleId}', {
        tenantId: 'x',
        mappingRuleId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('unassignRoleFromTenant - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/tenants/{tenantId}/roles/{roleId}', {
        tenantId: 'x',
        roleId: '12345',
      }),
      {
        headers: jsonHeaders(),
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('updateTenant - Missing description', async ({ request }) => {
    const requestBody = {
      name: 'x',
    };
    const res = await request.put(
      buildUrl('/tenants/{tenantId}', { tenantId: 'x' }),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
  test('updateTenant - Missing name', async ({ request }) => {
    const requestBody = {
      description: 'x',
    };
    const res = await request.put(
      buildUrl('/tenants/{tenantId}', { tenantId: 'x' }),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    if (res.status() !== 400) {
      try {
        console.error(await res.text());
      } catch {}
    }
    expect(res.status()).toBe(400);
  });
});
