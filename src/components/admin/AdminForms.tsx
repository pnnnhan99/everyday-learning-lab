'use client';
import { useState } from 'react';
import { fetcher } from '@/lib/fetcher';

export default function AdminForms() {
  const [element, setElement] = useState({ id: '', name: '', description: '', type: 'acid' });
  const [reaction, setReaction] = useState({ element1Id: '', element2Id: '', resultTitle: '', observation: '', explanation: '', effectType: 'informational', reviewStatus: 'unreviewed', safetyGuidance: '', assumptions: '', refTitle: '', refPublisher: '', refUrl: '' });
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
      const body = {
        element1Id: reaction.element1Id,
        element2Id: reaction.element2Id,
        resultTitle: reaction.resultTitle,
        observation: reaction.observation,
        explanation: reaction.explanation,
        effectType: reaction.effectType,
        reviewStatus: reaction.reviewStatus,
        assumptions: reaction.assumptions.split('\n').map((a) => a.trim()).filter((a) => a),
        safetyGuidance: reaction.safetyGuidance,
        references: reaction.refTitle ? [{ title: reaction.refTitle, publisher: reaction.refPublisher, url: reaction.refUrl }] : [],
      };
      await fetcher('/api/reactions', { method: 'POST', body: JSON.stringify(body) });
      setMessage(`Created reaction ${reaction.element1Id}+${reaction.element2Id}`);
      setReaction({ element1Id: '', element2Id: '', resultTitle: '', observation: '', explanation: '', effectType: 'informational', reviewStatus: 'unreviewed', safetyGuidance: '', assumptions: '', refTitle: '', refPublisher: '', refUrl: '' });
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
        {['element1Id', 'element2Id', 'resultTitle', 'observation', 'explanation'].map((k) => (
          <input key={k} value={reaction[k as 'element1Id' | 'element2Id' | 'resultTitle' | 'observation' | 'explanation']} onChange={(e) => setReaction({ ...reaction, [k]: e.target.value })} placeholder={k} required className="rounded-lg border px-3 py-2 text-sm" />
        ))}
        <select value={reaction.effectType} onChange={(e) => setReaction({ ...reaction, effectType: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
          {['informational', 'toxic'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={reaction.reviewStatus} onChange={(e) => setReaction({ ...reaction, reviewStatus: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
          {['reviewed', 'hazard-reviewed', 'unreviewed'].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <textarea value={reaction.safetyGuidance} onChange={(e) => setReaction({ ...reaction, safetyGuidance: e.target.value })} placeholder="Safety guidance" required className="rounded-lg border px-3 py-2 text-sm" rows={3} />
        <textarea value={reaction.assumptions} onChange={(e) => setReaction({ ...reaction, assumptions: e.target.value })} placeholder="Assumptions (one per line)" required className="rounded-lg border px-3 py-2 text-sm" rows={3} />
        <input value={reaction.refTitle} onChange={(e) => setReaction({ ...reaction, refTitle: e.target.value })} placeholder="Reference title" required className="rounded-lg border px-3 py-2 text-sm" />
        <input value={reaction.refPublisher} onChange={(e) => setReaction({ ...reaction, refPublisher: e.target.value })} placeholder="Reference publisher" required className="rounded-lg border px-3 py-2 text-sm" />
        <input value={reaction.refUrl} onChange={(e) => setReaction({ ...reaction, refUrl: e.target.value })} placeholder="Reference URL (https://...)" required className="rounded-lg border px-3 py-2 text-sm" />
        <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white" type="submit">Create</button>
      </form>
      {message && <p className="rounded-xl border p-3 text-sm lg:col-span-2">{message}</p>}
    </div>
  );
}
