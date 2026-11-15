import { describe, expect, it } from 'vitest';

import { GET } from './route';

const AUTH_HEADER = { authorization: 'Bearer test-token' };

function makeRequest(headers?: Record<string, string>): Request {
  return new Request('http://localhost/api/auth/verify', { method: 'GET', headers });
}

describe('GET /api/auth/verify', () => {
  it('accepts the configured maintainer token', async () => {
    const response = await GET(makeRequest(AUTH_HEADER));
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.authorized).toBe(true);
  });

  it('rejects a missing token', async () => {
    const response = await GET(makeRequest());
    expect(response.status).toBe(401);
  });

  it('rejects a wrong token', async () => {
    const response = await GET(makeRequest({ authorization: 'Bearer wrong-token' }));
    expect(response.status).toBe(401);
  });

  it('rejects a non-bearer authorization header', async () => {
    const response = await GET(makeRequest({ authorization: 'Basic test-token' }));
    expect(response.status).toBe(401);
  });
});
