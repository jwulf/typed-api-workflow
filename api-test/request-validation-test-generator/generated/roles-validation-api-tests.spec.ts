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

test.describe('Roles Validation API Tests', () => {
  test('assignRoleToClient - Param clientId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/roles/{roleId}/clients/{clientId}', {
        roleId: 'x',
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
  test('assignRoleToClient - Param roleId wrong type', async ({ request }) => {
    const res = await request.put(
      buildUrl('/roles/{roleId}/clients/{clientId}', {
        roleId: '12345',
        clientId: 'x',
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
  test('assignRoleToGroup - Param groupId wrong type', async ({ request }) => {
    const res = await request.put(
      buildUrl('/roles/{roleId}/groups/{groupId}', {
        roleId: 'x',
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
  test('assignRoleToGroup - Param roleId wrong type', async ({ request }) => {
    const res = await request.put(
      buildUrl('/roles/{roleId}/groups/{groupId}', {
        roleId: '12345',
        groupId: 'x',
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
  test('assignRoleToMappingRule - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/roles/{roleId}/mapping-rules/{mappingRuleId}', {
        roleId: 'x',
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
  test('assignRoleToMappingRule - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/roles/{roleId}/mapping-rules/{mappingRuleId}', {
        roleId: '12345',
        mappingRuleId: 'x',
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
  test('assignRoleToUser - Param roleId wrong type', async ({ request }) => {
    const res = await request.put(
      buildUrl('/roles/{roleId}/users/{username}', {
        roleId: '12345',
        username: 'x',
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
  test('createRole - Missing name', async ({ request }) => {
    const requestBody = {
      roleId: 'x',
    };
    const res = await request.post(buildUrl('/roles', undefined), {
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
  test('createRole - Missing roleId', async ({ request }) => {
    const requestBody = {
      name: 'x',
    };
    const res = await request.post(buildUrl('/roles', undefined), {
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
  test('deleteRole - Param roleId wrong type', async ({ request }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}', { roleId: '12345' }),
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
  test('getRole - Param roleId wrong type', async ({ request }) => {
    const res = await request.get(
      buildUrl('/roles/{roleId}', { roleId: '12345' }),
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
  test('searchClientsForRole - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.post(
      buildUrl('/roles/{roleId}/clients/search', { roleId: '12345' }),
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
  test('searchGroupsForRole - Param roleId wrong type', async ({ request }) => {
    const res = await request.post(
      buildUrl('/roles/{roleId}/groups/search', { roleId: '12345' }),
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
  test('searchMappingRulesForRole - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.post(
      buildUrl('/roles/{roleId}/mapping-rules/search', { roleId: '12345' }),
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
  test('searchUsersForRole - Param roleId wrong type', async ({ request }) => {
    const res = await request.post(
      buildUrl('/roles/{roleId}/users/search', { roleId: '12345' }),
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
  test('unassignRoleFromClient - Param clientId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}/clients/{clientId}', {
        roleId: 'x',
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
  test('unassignRoleFromClient - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}/clients/{clientId}', {
        roleId: '12345',
        clientId: 'x',
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
  test('unassignRoleFromGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}/groups/{groupId}', {
        roleId: 'x',
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
  test('unassignRoleFromGroup - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}/groups/{groupId}', {
        roleId: '12345',
        groupId: 'x',
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
  test('unassignRoleFromMappingRule - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}/mapping-rules/{mappingRuleId}', {
        roleId: 'x',
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
  test('unassignRoleFromMappingRule - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}/mapping-rules/{mappingRuleId}', {
        roleId: '12345',
        mappingRuleId: 'x',
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
  test('unassignRoleFromUser - Param roleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/roles/{roleId}/users/{username}', {
        roleId: '12345',
        username: 'x',
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
  test('updateRole - Missing description', async ({ request }) => {
    const requestBody = {
      name: 'x',
    };
    const res = await request.put(
      buildUrl('/roles/{roleId}', { roleId: 'x' }),
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
  test('updateRole - Missing name', async ({ request }) => {
    const requestBody = {
      description: 'x',
    };
    const res = await request.put(
      buildUrl('/roles/{roleId}', { roleId: 'x' }),
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
  test('updateRole - Param roleId wrong type', async ({ request }) => {
    const requestBody = {
      name: 'x',
      description: 'x',
    };
    const res = await request.put(
      buildUrl('/roles/{roleId}', { roleId: '12345' }),
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
