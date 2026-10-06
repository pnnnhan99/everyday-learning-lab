'use client';

import { useMemo } from 'react';
import { useLabStore } from '@/store/labStore';
import { findReactionAsync } from '@/lib/reactionLookup';

export function useMix() {
  const selected = useLabStore((s) => s.selected);
  const setResult = useLabStore((s) => s.setResult);
  const setLoading = useLabStore((s) => s.setLoading);
  const setError = useLabStore((s) => s.setError);
  const pushHistory = useLabStore((s) => s.pushHistory);
  const loading = useLabStore((s) => s.loading);

  const canMix = useMemo(() => selected.length === 2 && !loading, [selected, loading]);

  async function mix(ids: string[]) {
    if (ids.length !== 2) return;
    setLoading(true);
    setError(null);
    try {
      const reaction = await findReactionAsync(ids[0], ids[1]);
      setResult(reaction);
      pushHistory({ elementIds: [ids[0], ids[1]], reaction });
      if (!reaction) setError('No known reaction for this pair yet. Try another combination.');
    } catch {
      setError('Lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return { mix, canMix };
}
