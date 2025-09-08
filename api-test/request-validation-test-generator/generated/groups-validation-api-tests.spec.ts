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

test.describe('Groups Validation API Tests', () => {
  test('assignClientToGroup - Param clientId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/groups/{groupId}/clients/{clientId}', {
        groupId: 'x',
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
  test('assignClientToGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/groups/{groupId}/clients/{clientId}', {
        groupId: '12345',
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
  test('assignMappingRuleToGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/groups/{groupId}/mapping-rules/{mappingRuleId}', {
        groupId: '12345',
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
  test('assignMappingRuleToGroup - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.put(
      buildUrl('/groups/{groupId}/mapping-rules/{mappingRuleId}', {
        groupId: 'x',
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
  test('assignUserToGroup - Param groupId wrong type', async ({ request }) => {
    const res = await request.put(
      buildUrl('/groups/{groupId}/users/{username}', {
        groupId: '12345',
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
  test('createGroup - Missing groupId', async ({ request }) => {
    const requestBody = {
      name: 'x',
    };
    const res = await request.post(buildUrl('/groups', undefined), {
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
  test('createGroup - Missing name', async ({ request }) => {
    const requestBody = {
      groupId: 'x',
    };
    const res = await request.post(buildUrl('/groups', undefined), {
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
  test('deleteGroup - Param groupId wrong type', async ({ request }) => {
    const res = await request.delete(
      buildUrl('/groups/{groupId}', { groupId: '12345' }),
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
  test('getGroup - Param groupId wrong type', async ({ request }) => {
    const res = await request.get(
      buildUrl('/groups/{groupId}', { groupId: '12345' }),
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
  test('searchClientsForGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.post(
      buildUrl('/groups/{groupId}/clients/search', { groupId: '12345' }),
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
  test('searchMappingRulesForGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.post(
      buildUrl('/groups/{groupId}/mapping-rules/search', { groupId: '12345' }),
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
  test('searchRolesForGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.post(
      buildUrl('/groups/{groupId}/roles/search', { groupId: '12345' }),
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
  test('searchUsersForGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.post(
      buildUrl('/groups/{groupId}/users/search', { groupId: '12345' }),
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
  test('unassignClientFromGroup - Param clientId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/groups/{groupId}/clients/{clientId}', {
        groupId: 'x',
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
  test('unassignClientFromGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/groups/{groupId}/clients/{clientId}', {
        groupId: '12345',
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
  test('unassignMappingRuleFromGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/groups/{groupId}/mapping-rules/{mappingRuleId}', {
        groupId: '12345',
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
  test('unassignMappingRuleFromGroup - Param mappingRuleId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/groups/{groupId}/mapping-rules/{mappingRuleId}', {
        groupId: 'x',
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
  test('unassignUserFromGroup - Param groupId wrong type', async ({
    request,
  }) => {
    const res = await request.delete(
      buildUrl('/groups/{groupId}/users/{username}', {
        groupId: '12345',
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
  test('updateGroup - Missing description', async ({ request }) => {
    const requestBody = {
      name: 'x',
    };
    const res = await request.put(
      buildUrl('/groups/{groupId}', { groupId: 'x' }),
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
  test('updateGroup - Missing name', async ({ request }) => {
    const requestBody = {
      description: 'x',
    };
    const res = await request.put(
      buildUrl('/groups/{groupId}', { groupId: 'x' }),
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
  test('updateGroup - Param groupId wrong type', async ({ request }) => {
    const requestBody = {
      name: 'x',
      description: 'x',
    };
    const res = await request.put(
      buildUrl('/groups/{groupId}', { groupId: '12345' }),
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
