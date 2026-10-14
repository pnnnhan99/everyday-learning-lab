'use client';
import { useState } from 'react';
import { fetcher } from '@/lib/fetcher';

export default function AdminForms() {
  const [element, setElement] = useState({ id: '', name: '', description: '', type: 'acid' });
  const [reaction, setReaction] = useState({ element1Id: '', element2Id: '', resultTitle: '', resultDescription: '', effectType: 'clean' });
  const [message, setMessage] = useState<string | null>(null);

  async function submitElement(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await fetcher('/api/elements', { method: 'POST', body: JSON.stringify({ ...element, icon: 'flask' }) });
      setMessage(`Created element ${element.id}`);
      setElement({ id: '', name: '', description: '', type: 'acid' });
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Create failed'); }
  }

  async function submitReaction(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      await fetcher('/api/reactions', { method: 'POST', body: JSON.stringify(reaction) });
      setMessage(`Created reaction ${reaction.element1Id}+${reaction.element2Id}`);
      setReaction({ element1Id: '', element2Id: '', resultTitle: '', resultDescription: '', effectType: 'clean' });
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Create failed'); }
  }

  async function removeElement() {
    if (!element.id || !confirm(`Delete element ${element.id}?`)) return;
    try {
      await fetcher(`/api/elements/${element.id}`, { method: 'DELETE' });
      setMessage(`Deleted element ${element.id}`);
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Delete failed'); }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form onSubmit={submitElement} className="flex flex-col gap-2 rounded-2xl border p-4">
        <h2 className="font-bold">Create element</h2>
        {['id', 'name', 'description'].map((k) => (
          <input key={k} value={element[k as 'id' | 'name' | 'description']} onChange={(e) => setElement({ ...element, [k]: e.target.value })} placeholder={k} required className="rounded-lg border px-3 py-2 text-sm" />
        ))}
        <select value={element.type} onChange={(e) => setElement({ ...element, type: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
          {['acid', 'base', 'food', 'chemical'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex gap-2">
          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white" type="submit">Create</button>
          <button className="rounded-xl border px-4 py-2 text-sm" type="button" onClick={removeElement}>Delete by id</button>
        </div>
      </form>
      <form onSubmit={submitReaction} className="flex flex-col gap-2 rounded-2xl border p-4">
        <h2 className="font-bold">Create reaction</h2>
        {['element1Id', 'element2Id', 'resultTitle', 'resultDescription'].map((k) => (
          <input key={k} value={reaction[k as 'element1Id' | 'element2Id' | 'resultTitle' | 'resultDescription']} onChange={(e) => setReaction({ ...reaction, [k]: e.target.value })} placeholder={k} required className="rounded-lg border px-3 py-2 text-sm" />
        ))}
        <select value={reaction.effectType} onChange={(e) => setReaction({ ...reaction, effectType: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
          {['clean', 'toxic', 'explosion'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white" type="submit">Create</button>
      </form>
      {message && <p className="rounded-xl border p-3 text-sm lg:col-span-2">{message}</p>}
    </div>
  );
}
