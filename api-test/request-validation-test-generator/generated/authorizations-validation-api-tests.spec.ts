/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH under
 * one or more contributor license agreements. See the NOTICE file distributed
 * with this work for additional information regarding copyright ownership.
 * Licensed under the Camunda License 1.0. You may not use this file
 * except in compliance with the Camunda License 1.0.
 */

/*
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated At: 2025-09-08T04:26:59.464Z
 * Spec Commit: 177fb9193d6c4d0ab558734d76c501bbac1f2454
 */
import {test, expect} from '@playwright/test';
import {jsonHeaders, buildUrl} from '../../../../utils/http';

test.describe('Authorizations Validation API Tests', () => {
  test('createAuthorization - Missing ownerId', async ({request}) => {
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
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('createAuthorization - Missing ownerType', async ({request}) => {
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
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('createAuthorization - Missing permissionTypes', async ({request}) => {
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
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('createAuthorization - Missing resourceId', async ({request}) => {
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
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('createAuthorization - Missing resourceType', async ({request}) => {
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
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('updateAuthorization - Missing ownerId', async ({request}) => {
    const requestBody = {
      ownerType: {},
      resourceId: 'x',
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', {authorizationKey: 'x'}),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('updateAuthorization - Missing ownerType', async ({request}) => {
    const requestBody = {
      ownerId: 'x',
      resourceId: 'x',
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', {authorizationKey: 'x'}),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('updateAuthorization - Missing permissionTypes', async ({request}) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceId: 'x',
      resourceType: {},
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', {authorizationKey: 'x'}),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('updateAuthorization - Missing resourceId', async ({request}) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceType: {},
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', {authorizationKey: 'x'}),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
  test('updateAuthorization - Missing resourceType', async ({request}) => {
    const requestBody = {
      ownerId: 'x',
      ownerType: {},
      resourceId: 'x',
      permissionTypes: [],
    };
    const res = await request.put(
      buildUrl('/authorizations/{authorizationKey}', {authorizationKey: 'x'}),
      {
        headers: jsonHeaders(),
        data: requestBody,
      },
    );
    // Conditionals are banned by eslint in qa tests. The following block can be uncommented for debugging purposes.
    //   if (res.status() !== 400) {
    //     try { console.error(await res.text()); } catch {}
    //   }
    expect(res.status()).toBe(400);
  });
});
