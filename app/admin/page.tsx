'use client';

import { useState } from 'react';
import AdminForms from '@/components/admin/AdminForms';
import { setMaintainerToken, clearMaintainerToken, isMaintainer } from '@/lib/auth';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [isAuthed, setIsAuthed] = useState(() => isMaintainer());

  function saveToken(e: React.FormEvent) {
    e.preventDefault();
    if (token.trim()) {
      setMaintainerToken(token.trim());
      setIsAuthed(true);
    }
  }

  function logout() {
    clearMaintainerToken();
    setIsAuthed(false);
    setToken('');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {isAuthed ? (
        <>
          <div className="mb-4 flex items-center justify-between rounded-xl border border-green-300 bg-green-50 px-3 py-2 text-sm dark:border-green-800 dark:bg-green-950">
            <span className="flex items-center gap-2 text-green-800 dark:text-green-200">Authorized</span>
            <button onClick={logout} className="rounded-lg border px-2 py-1 text-xs">Logout</button>
          </div>
          <AdminForms />
        </>
      ) : (
        <form onSubmit={saveToken} className="flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <h2 className="font-bold">Maintainer access</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Enter your maintainer token to manage elements and reactions. The token is stored in this browser only.</p>
          <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="MAINTAINER_TOKEN" required className="rounded-lg border px-3 py-2 text-sm" />
          <button type="submit" className="w-fit rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white">Authorize</button>
        </form>
      )}
    </div>
  );
}
