import { listElements, listReactions } from '@/lib/db';
import LabBoard from '@/components/lab/LabBoard';
import Link from 'next/link';
import { FlaskConical, Atom, TriangleAlert } from 'lucide-react';

export default async function Home() {
  const elements = await listElements();
  const reactions = await listReactions();
  const toxicCount = reactions.filter((r) => r.effectType === 'toxic').length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-sm text-zinc-500"><Atom size={16} /> Elements</div>
          <p className="mt-1 text-3xl font-bold">{elements.length}</p>
          <Link href="/elements" className="text-sm font-medium text-blue-600 hover:underline">Browse elements →</Link>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-sm text-zinc-500"><FlaskConical size={16} /> Known reactions</div>
          <p className="mt-1 text-3xl font-bold">{reactions.length}</p>
          <Link href="/reactions" className="text-sm font-medium text-blue-600 hover:underline">Browse reactions →</Link>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300"><TriangleAlert size={16} /> Toxic combos</div>
          <p className="mt-1 text-3xl font-bold">{toxicCount}</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">Never try these at home.</p>
        </div>
      </section>
      <LabBoard initialElements={elements} initialReactions={reactions} />
    </div>
  );
}

