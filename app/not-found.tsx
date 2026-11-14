'use client';

import Link from 'next/link';

import { useDictionary } from '@/i18n/useDictionary';

export default function NotFound() {
  const dictionary = useDictionary();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-5xl font-black">404</p>
      <h1 className="text-lg font-bold">{dictionary.app.notFoundTitle}</h1>
      <p className="text-sm text-zinc-500">{dictionary.app.notFoundBody}</p>
      <Link href="/" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
        {dictionary.app.backHome}
      </Link>
    </div>
  );
}
