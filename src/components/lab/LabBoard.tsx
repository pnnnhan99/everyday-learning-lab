'use client';
import { useEffect, useMemo } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { RotateCcw, FlaskConical } from 'lucide-react';
import type { Element, Reaction } from '@/types/game';
import { useLabStore } from '@/store/labStore';
import ElementCard from './ElementCard';
import Beaker from './Beaker';
import ReactionEffect from './ReactionEffect';
import DataTools from './DataTools';
import HistoryPanel from './HistoryPanel';
import { useMix } from './useMix';
const PAGE_SIZE = 8;
type Props = { initialElements: Element[]; initialReactions: Reaction[] };
export default function LabBoard({ initialElements, initialReactions }: Props) {
  const catalog = useLabStore((s) => (s.elements.length > 0 ? s.elements : initialElements));
  const knownCount = useLabStore((s) => (s.reactions.length > 0 ? s.reactions.length : initialReactions.length));
  const setData = useLabStore((s) => s.setData);
  const selected = useLabStore((s) => s.selected);
  const toggleSelect = useLabStore((s) => s.toggleSelect);
  const result = useLabStore((s) => s.result);
  const resultKey = useLabStore((s) => s.resultKey);
  const loading = useLabStore((s) => s.loading);
  const error = useLabStore((s) => s.error);
  const history = useLabStore((s) => s.history);
  const undo = useLabStore((s) => s.undo);
  const reset = useLabStore((s) => s.reset);
  const query = useLabStore((s) => s.query);
  const typeFilter = useLabStore((s) => s.typeFilter);
  const page = useLabStore((s) => s.page);
  const setPage = useLabStore((s) => s.setPage);
  const removeFromBeaker = useLabStore((s) => s.removeFromBeaker);
  const hydrate = useLabStore((s) => s.hydrate);
  const { mix } = useMix();
  useEffect(() => { hydrate(); setData(initialElements, initialReactions); }, [hydrate, setData, initialElements, initialReactions]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((el) => {
      const mq = q === '' || el.name.toLowerCase().includes(q) || el.id.includes(q);
      return mq && (typeFilter === 'all' || el.type === typeFilter);
    });
  }, [catalog, query, typeFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selectedElements = useMemo(() => selected.map((id) => catalog.find((e) => e.id === id)).filter((e): e is Element => Boolean(e)), [catalog, selected]);
  function onDragEnd(event: DragEndEvent) {
    if (event.over?.id !== 'beaker') return;
    const draggedId = String(event.active.id);
    if (selected.includes(draggedId)) return;
    const next = selected.length >= 2 ? [selected[1], draggedId] : [...selected, draggedId];
    useLabStore.getState().selected.forEach((id) => toggleSelect(id));
    next.forEach((id) => toggleSelect(id));
    if (next.length === 2) void mix(next);
  }
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-4 rounded-2xl border p-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold"><FlaskConical size={18} /> Chemistry Lab</h2>
          <div className="flex gap-2">
            <button onClick={undo} disabled={history.length === 0} className="rounded-lg border px-2 py-1 text-xs disabled:opacity-40">Undo</button>
            <button onClick={reset} className="flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"><RotateCcw size={12} /> Reset</button>
          </div>
        </div>
        <DataTools total={filtered.length} />
        <DndContext onDragEnd={onDragEnd}>
          <div className="grid gap-3 sm:grid-cols-2">
            {pageItems.map((el) => <ElementCard key={el.id} element={el} />)}
            {pageItems.length === 0 && <p className="col-span-2 p-4 text-center text-sm">No elements match.</p>}
          </div>
          <Beaker elements={selectedElements} />
        </DndContext>
        <div className="flex items-center justify-between text-sm">
          <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Prev</button>
          <span className="text-xs">Page {safePage} / {totalPages}</span>
          <button disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">Next</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedElements.map((el) => (
            <span key={el.id} className="flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{el.name}<button onClick={() => removeFromBeaker(el.id)} className="font-bold">×</button></span>
          ))}
          <button onClick={() => void mix(selected)} disabled={selected.length !== 2 || loading} className="ml-auto rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">{loading ? 'Mixing…' : 'Mix 2 elements'}</button>
        </div>
        {error && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{error}</p>}
        {result && <ReactionEffect reaction={result} resultKey={resultKey} />}
      </div>
      <HistoryPanel catalogSize={catalog.length} knownCount={knownCount} />
    </section>
  );
}
