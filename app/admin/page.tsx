'use client';

import { useEffect, useState } from 'react';
import AdminForms from '@/components/admin/AdminForms';
import {
  clearMaintainerToken,
  getMaintainerToken,
  setMaintainerToken,
  verifyMaintainerToken,
} from '@/lib/maintainerSession';

type Status = 'checking' | 'authorized' | 'locked';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>('checking');
  const [message, setMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // A stored token only proves that something was saved. Check it with the API
  // before showing the authorized UI, otherwise the page claims access that
  // mutations will reject.
  useEffect(() => {
    let cancelled = false;
    const stored = getMaintainerToken();
    verifyMaintainerToken(stored ?? '').then((ok) => {
      if (cancelled) return;
      if (ok) {
        setStatus('authorized');
        return;
      }
      if (stored) {
        clearMaintainerToken();
        setMessage('The saved maintainer token was rejected. Enter a valid token.');
      }
      setStatus('locked');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveToken(event: React.FormEvent) {
    event.preventDefault();
    const candidate = token.trim();
    if (!candidate) return;
    setMessage(null);
    setVerifying(true);
    const ok = await verifyMaintainerToken(candidate);
    setVerifying(false);
    if (ok) {
      setMaintainerToken(candidate);
      setStatus('authorized');
      setToken('');
    } else {
      setMessage('That token was rejected by the server. Check MAINTAINER_TOKEN and try again.');
    }
  }

  function logout() {
    clearMaintainerToken();
    setStatus('locked');
    setToken('');
    setMessage(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {status === 'checking' && (
        <p className="rounded-xl border px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300">
          Checking maintainer access…
        </p>
      )}

      {status === 'authorized' ? (
        <>
          <div className="mb-4 flex items-center justify-between rounded-xl border border-green-300 bg-green-50 px-3 py-2 text-sm dark:border-green-800 dark:bg-green-950">
            <span className="flex items-center gap-2 text-green-800 dark:text-green-200">Authorized</span>
            <button onClick={logout} className="rounded-lg border px-2 py-1 text-xs">Logout</button>
          </div>
          <AdminForms />
        </>
      ) : status === 'locked' ? (
        <form onSubmit={saveToken} className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="font-bold">Maintainer access</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Enter your maintainer token to manage elements and reactions. The token is stored in this browser only.
          </p>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="MAINTAINER_TOKEN"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={verifying}
            className="w-fit rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {verifying ? 'Verifying…' : 'Authorize'}
          </button>
          {message && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{message}</p>}
        </form>
      ) : null}
    </div>
  );
}
