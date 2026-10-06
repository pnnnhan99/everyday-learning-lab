'use client';

import { History } from 'lucide-react';
import { useLabStore } from '@/store/labStore';

export default function HistoryPanel({ catalogSize, knownCount }: { catalogSize: number; knownCount: number }) {
  const history = useLabStore((s) => s.history);
  const clearHistory = useLabStore((s) => s.clearHistory);

  return (
    <aside className="flex flex-col gap-3 rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold"><History size={16} /> Recent mixes ({history.length})</h3>
        <button onClick={clearHistory} disabled={history.length === 0} className="text-xs disabled:opacity-40">Clear</button>
      </div>
      {history.length === 0 && <p className="text-sm">No mixes yet.</p>}
      <ul className="flex flex-col gap-2">
        {history.slice(0, 8).map((h) => (
          <li key={h.id} className="rounded-xl bg-zinc-50 p-2 text-xs dark:bg-zinc-800">
            <span className="font-semibold">{h.elementIds.join(' + ')}</span>
            <span className="block">{h.reaction ? `${h.reaction.resultTitle} (${h.reaction.effectType})` : 'No reaction'}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs">Catalog: {catalogSize} elements · {knownCount} known reactions.</p>
    </aside>
  );
}
