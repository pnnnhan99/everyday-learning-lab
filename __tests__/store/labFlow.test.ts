import { beforeEach, describe, expect, it } from 'vitest';

import { elements } from '@/data/mockReactions';
import { useGameStore, WORKSPACE_CAPACITY } from '@/store/useGameStore';
import { useLabStore } from '@/store/labStore';
import type { Element } from '@/types/game';

function elementById(id: string): Element {
  const element = elements.find((candidate) => candidate.id === id);
  if (!element) throw new Error(`Missing seed element: ${id}`);
  return element;
}

beforeEach(() => {
  useLabStore.getState().clearHistory();
  useLabStore.setState({ selected: [], result: null, hydrated: false });
  useGameStore.setState({
    workspace: [],
    activeReaction: null,
    status: 'idle',
    noReaction: false,
  });
});

describe('representative lab flow', () => {
  it('places two elements, merges them, records history, and restores the pair on undo', () => {
    const { moveToWorkspace, finishMerge } = useGameStore.getState();

    moveToWorkspace(elementById('lemon'));
    expect(useGameStore.getState().status).toBe('idle');

    moveToWorkspace(elementById('lemon'));
    expect(useGameStore.getState().workspace).toHaveLength(1);

    moveToWorkspace(elementById('baking-soda'));
    expect(useGameStore.getState().status).toBe('merging');
    expect(WORKSPACE_CAPACITY).toBe(2);

    // A third element cannot be placed while the bench is full.
    moveToWorkspace(elementById('vinegar'));
    expect(useGameStore.getState().workspace.map((element) => element.id)).toEqual([
      'lemon',
      'baking-soda',
    ]);

    finishMerge();

    const lab = useGameStore.getState();
    expect(lab.status).toBe('result');
    expect(lab.activeReaction?.resultTitle).toBe('Carbon dioxide bubbles');
    expect(lab.activeReaction?.reviewStatus).toBe('reviewed');
    expect(lab.activeReaction?.safetyGuidance.length).toBeGreaterThan(0);
    expect(lab.activeReaction?.references.length).toBeGreaterThan(0);

    const history = useLabStore.getState().history;
    expect(history).toHaveLength(1);
    expect(history[0].elementIds).toEqual(['lemon', 'baking-soda']);

    useLabStore.getState().undo();
    expect(useLabStore.getState().selected).toEqual(['lemon', 'baking-soda']);
    expect(useLabStore.getState().result?.resultTitle).toBe('Carbon dioxide bubbles');
  });

  it('reports an unmapped pair without writing a reaction to history', () => {
    const { moveToWorkspace, finishMerge } = useGameStore.getState();

    moveToWorkspace(elementById('lemon'));
    moveToWorkspace(elementById('vinegar'));
    finishMerge();

    const lab = useGameStore.getState();
    expect(lab.status).toBe('idle');
    expect(lab.workspace).toEqual([]);
    expect(lab.activeReaction).toBeNull();
    expect(lab.noReaction).toBe(true);
    expect(useLabStore.getState().history).toHaveLength(0);
  });

  it('clears an empty or partially filled bench back to the empty state', () => {
    const { moveToWorkspace, clearWorkspace } = useGameStore.getState();

    moveToWorkspace(elementById('bleach'));
    clearWorkspace();

    const lab = useGameStore.getState();
    expect(lab.workspace).toEqual([]);
    expect(lab.status).toBe('idle');
    expect(lab.activeReaction).toBeNull();
    expect(lab.noReaction).toBe(false);
  });
});
