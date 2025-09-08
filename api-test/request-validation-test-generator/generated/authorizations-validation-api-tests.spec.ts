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

test.describe('Authorizations Validation API Tests', () => {
  test('createAuthorization - Missing ownerId', async ({ request }) => {
    const requestBody = {
      ownerType: {},
      resourceId: 'x',
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.post(buildUrl('/authorizations', undefined), {
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
  test('createAuthorization - Missing ownerType', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      resourceId: 'x',
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.post(buildUrl('/authorizations', undefined), {
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
  test('createAuthorization - Missing permissionTypes', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceId: 'x',
      resourceType: {},
    };
    const res = await request.post(buildUrl('/authorizations', undefined), {
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
  test('createAuthorization - Missing resourceId', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.post(buildUrl('/authorizations', undefined), {
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
  test('createAuthorization - Missing resourceType', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceId: 'x',
      permissionTypes: [],
    };
    const res = await request.post(buildUrl('/authorizations', undefined), {
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
  test('updateAuthorization - Missing ownerId', async ({ request }) => {
    const requestBody = {
      ownerType: {},
      resourceId: 'x',
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', { authorizationKey: 'x' }),
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
  test('updateAuthorization - Missing ownerType', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      resourceId: 'x',
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', { authorizationKey: 'x' }),
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
  test('updateAuthorization - Missing permissionTypes', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceId: 'x',
      resourceType: {},
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', { authorizationKey: 'x' }),
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
  test('updateAuthorization - Missing resourceId', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', { authorizationKey: 'x' }),
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
  test('updateAuthorization - Missing resourceType', async ({ request }) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceId: 'x',
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', { authorizationKey: 'x' }),
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
