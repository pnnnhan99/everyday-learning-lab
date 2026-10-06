'use client';

import Link from 'next/link';

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-5xl font-black">⚗️</p>
      <h1 className="text-lg font-bold">Experiment failed</h1>
      <p className="max-w-md text-sm text-zinc-500">{error.message || 'Something exploded unexpectedly.'}</p>
      <div className="flex gap-2">
        <button onClick={reset} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Retry</button>
        <Link href="/" className="rounded-xl border px-4 py-2 text-sm">Back to lab</Link>
      </div>
    </div>
  );
}
