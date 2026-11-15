// Client-side maintainer session helpers. Kept separate from `auth.ts`, which
// imports `next/server` and must only run on the server.

const TOKEN_KEY = 'maintainerToken';

export function getMaintainerToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setMaintainerToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearMaintainerToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isMaintainer(): boolean {
  return getMaintainerToken() !== null;
}

/**
 * Confirm the token against the server before the UI claims the session is
 * authorized. A client can only know that a token exists; it cannot validate
 * it without asking the API.
 */
export async function verifyMaintainerToken(token: string): Promise<boolean> {
  if (typeof window === 'undefined' || token.trim() === '') return false;
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}
