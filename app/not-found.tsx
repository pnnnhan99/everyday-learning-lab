import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-5xl font-black">404</p>
      <h1 className="text-lg font-bold">Reaction not found</h1>
      <p className="text-sm text-zinc-500">The beaker you are looking for evaporated.</p>
      <Link href="/" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Back to lab</Link>
    </div>
  );
}
