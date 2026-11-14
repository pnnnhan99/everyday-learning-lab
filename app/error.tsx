'use client';

import Link from 'next/link';

import { useDictionary } from '@/i18n/useDictionary';

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const dictionary = useDictionary();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-5xl font-black">💥</p>
      <h1 className="text-lg font-bold">{dictionary.app.errorTitle}</h1>
      <p className="max-w-md text-sm text-zinc-500">{error.message || dictionary.app.errorFallback}</p>
      <div className="flex gap-2">
        <button onClick={reset} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          {dictionary.app.retry}
        </button>
        <Link href="/" className="rounded-xl border px-4 py-2 text-sm">
          {dictionary.app.backHome}
        </Link>
      </div>
    </div>
  );
}
