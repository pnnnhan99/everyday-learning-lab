import { create } from 'zustand';
import type { Element, Reaction } from '@/types/game';

export interface HistoryEntry {
  id: string;
  elementIds: [string, string];
  reaction: Reaction | null;
  at: number;
}

interface LabState {
  elements: Element[];
  reactions: Reaction[];
  selected: string[];
  result: Reaction | null;
  resultKey: number;
  loading: boolean;
  error: string | null;
  history: HistoryEntry[];
  favorites: string[];
  query: string;
  typeFilter: string;
  page: number;
  hydrated: boolean;
  setData: (elements: Element[], reactions: Reaction[]) => void;
  toggleSelect: (id: string) => void;
  setResult: (reaction: Reaction | null) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  pushHistory: (entry: Omit<HistoryEntry, 'id' | 'at'>) => void;
  undo: () => void;
  clearHistory: () => void;
  toggleFavorite: (id: string) => void;
  removeFromBeaker: (id: string) => void;
  reset: () => void;
  setQuery: (q: string) => void;
  setTypeFilter: (t: string) => void;
  setPage: (p: number) => void;
  hydrate: () => void;
}

const FAV_KEY = 'ess:favorites';
const HIST_KEY = 'ess:history';

function readLS(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch { return []; }
}

function readHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export const useLabStore = create<LabState>((set, get) => ({
  elements: [],
  reactions: [],
  selected: [],
  result: null,
  resultKey: 0,
  loading: false,
  error: null,
  history: [],
  favorites: [],
  query: '',
  typeFilter: 'all',
  page: 1,
  hydrated: false,
  setData: (elements, reactions) => set({ elements, reactions }),
  toggleSelect: (id) => {
    const { selected } = get();
    if (selected.includes(id)) {
      set({ selected: selected.filter((s) => s !== id), result: null });
    } else if (selected.length < 2) {
      set({ selected: [...selected, id], result: null });
    } else {
      set({ selected: [selected[1], id], result: null });
    }
  },
  setResult: (reaction) => set((s) => ({ result: reaction, resultKey: s.resultKey + 1 })),
  setLoading: (v) => set({ loading: v }),
  setError: (msg) => set({ error: msg }),
  pushHistory: (entry) => {
    const full: HistoryEntry = { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, at: Date.now() };
    const history = [full, ...get().history].slice(0, 50);
    set({ history });
    try { localStorage.setItem(HIST_KEY, JSON.stringify(history)); } catch { /* ignore */ }
  },
  undo: () => {
    const [first, ...rest] = get().history;
    if (!first) return;
    set({ history: rest, selected: [...first.elementIds], result: first.reaction });
    try { localStorage.setItem(HIST_KEY, JSON.stringify(rest)); } catch { /* ignore */ }
  },
  clearHistory: () => {
    set({ history: [] });
    try { localStorage.removeItem(HIST_KEY); } catch { /* ignore */ }
  },
  toggleFavorite: (id) => {
    const favs = get().favorites.includes(id)
      ? get().favorites.filter((f) => f !== id)
      : [...get().favorites, id];
    set({ favorites: favs });
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch { /* ignore */ }
  },
  removeFromBeaker: (id) => set((s) => ({ selected: s.selected.filter((x) => x !== id), result: null })),
  reset: () => set({ selected: [], result: null, error: null }),
  setQuery: (q) => set({ query: q, page: 1 }),
  setTypeFilter: (t) => set({ typeFilter: t, page: 1 }),
  setPage: (p) => set({ page: Math.max(1, p) }),
  hydrate: () => {
    if (get().hydrated || typeof window === 'undefined') return;
    set({ favorites: readLS(FAV_KEY), history: readHistory(), hydrated: true });
  },
}));
