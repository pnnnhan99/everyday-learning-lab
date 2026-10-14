import { fetcher } from '@/lib/fetcher';
import type { Reaction } from '@/types/game';

export function getReactions(): Promise<Reaction[]> {
  return fetcher<Reaction[]>('/api/reactions');
}

export function lookupReaction(e1: string, e2: string): Promise<Reaction | null> {
  return fetcher<Reaction | null>(`/api/reactions?e1=${encodeURIComponent(e1)}&e2=${encodeURIComponent(e2)}`)
    .catch((err: { status?: number }) => {
      if (err?.status === 404) return null;
      throw err;
    });
}
