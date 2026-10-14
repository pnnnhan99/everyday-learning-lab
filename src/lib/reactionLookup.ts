import type { Reaction } from '@/types/game';
import { lookupReaction } from '@/services/reactions';
import { findReaction as findLocal } from '@/data/mockReactions';

const cache = new Map<string, Reaction | null>();

function key(a: string, b: string): string {
  return [a, b].sort().join('|');
}

/** Async reaction lookup: memory cache -> API -> local mock fallback. */
export async function findReactionAsync(firstId: string, secondId: string): Promise<Reaction | null> {
  const k = key(firstId, secondId);
  if (cache.has(k)) return cache.get(k) ?? null;
  try {
    const remote = await lookupReaction(firstId, secondId);
    cache.set(k, remote);
    return remote;
  } catch {
    const local = findLocal(firstId, secondId) ?? null;
    cache.set(k, local);
    return local;
  }
}

export function clearReactionCache(): void {
  cache.clear();
}
