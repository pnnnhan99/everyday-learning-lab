import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearMaintainerToken,
  getMaintainerToken,
  isMaintainer,
  setMaintainerToken,
  verifyMaintainerToken,
} from '@/lib/maintainerSession';

function installWindow() {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
  vi.stubGlobal('window', { localStorage });
  return localStorage;
}

describe('maintainerSession', () => {
  beforeEach(() => {
    installWindow();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('stores and clears the maintainer token', () => {
    expect(isMaintainer()).toBe(false);
    setMaintainerToken('abc');
    expect(getMaintainerToken()).toBe('abc');
    expect(isMaintainer()).toBe(true);
    clearMaintainerToken();
    expect(isMaintainer()).toBe(false);
  });

  it('asks the server to verify a token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(verifyMaintainerToken('abc')).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/verify',
      expect.objectContaining({ headers: { Authorization: 'Bearer abc' } }),
    );
  });

  it('rejects an empty token without calling the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(verifyMaintainerToken('   ')).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats a server rejection and a network error as unverified', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })));
    await expect(verifyMaintainerToken('wrong')).resolves.toBe(false);

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(verifyMaintainerToken('abc')).resolves.toBe(false);
  });
});
