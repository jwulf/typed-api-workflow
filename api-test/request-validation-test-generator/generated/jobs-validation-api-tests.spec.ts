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

test.describe('Jobs Validation API Tests', () => {
  test('activateJobs - Missing maxJobsToActivate', async ({ request }) => {
    const requestBody = {
      type: 'x',
      timeout: 1,
    };
    const res = await request.post(buildUrl('/jobs/activation', undefined), {
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
  test('activateJobs - Missing timeout', async ({ request }) => {
    const requestBody = {
      type: 'x',
      maxJobsToActivate: 1,
    };
    const res = await request.post(buildUrl('/jobs/activation', undefined), {
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
  test('activateJobs - Missing type', async ({ request }) => {
    const requestBody = {
      timeout: 1,
      maxJobsToActivate: 1,
    };
    const res = await request.post(buildUrl('/jobs/activation', undefined), {
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
  test('throwJobError - Missing errorCode', async ({ request }) => {
    const requestBody = {};
    const res = await request.post(
      buildUrl('/jobs/{jobKey}/error', { jobKey: 'x' }),
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
  test('updateJob - Missing changeset', async ({ request }) => {
    const requestBody = {};
    const res = await request.patch(
      buildUrl('/jobs/{jobKey}', { jobKey: 'x' }),
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
