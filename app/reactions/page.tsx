import { listReactions } from '@/lib/db';

export default async function ReactionsPage() {
  const reactions = await listReactions();
  if (reactions.length === 0) {
    return <div className="mx-auto max-w-6xl px-4 py-6"><p>No reactions found.</p></div>;
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-3 lg:grid-cols-2">
        {reactions.map((r) => (
          <div key={`${r.element1Id}-${r.element2Id}`} className="rounded-2xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{r.element1Id} + {r.element2Id} · {r.effectType}</p>
            <h2 className="mt-1 font-bold">{r.resultTitle}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{r.observation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
