'use client';

import { create } from 'zustand';

import { elements, findReaction } from '../data/mockReactions';
import { useLabStore } from './labStore';
import type { Element, Reaction } from '../types/game';

export const WORKSPACE_CAPACITY = 2;

export type LabStatus = 'idle' | 'merging' | 'result';

interface GameState {
  inventory: Element[];
  workspace: Element[];
  activeReaction: Reaction | null;
  status: LabStatus;
  noReaction: boolean;

  moveToWorkspace: (element: Element) => void;
  removeFromWorkspace: (elementId: string) => void;
  clearWorkspace: () => void;
  restoreWorkspace: (elementIds: string[]) => void;
  triggerReaction: (element1Id: string, element2Id: string) => void;
  finishMerge: () => void;
}

function emptyBench(): Pick<GameState, 'workspace' | 'activeReaction' | 'status' | 'noReaction'> {
  return { workspace: [], activeReaction: null, status: 'idle', noReaction: false };
}

export const useGameStore = create<GameState>((set, get) => ({
  inventory: elements,
  workspace: [],
  activeReaction: null,
  status: 'idle',
  noReaction: false,

  moveToWorkspace: (element) =>
    set((state) => {
      if (state.workspace.length >= WORKSPACE_CAPACITY) return state;
      if (state.workspace.some((placed) => placed.id === element.id)) return state;

      const workspace = [...state.workspace, element];

      return {
        workspace,
        activeReaction: null,
        noReaction: false,
        status: workspace.length === WORKSPACE_CAPACITY ? 'merging' : 'idle',
      };
    }),

  removeFromWorkspace: (elementId) =>
    set((state) => ({
      ...emptyBench(),
      workspace: state.workspace.filter((placed) => placed.id !== elementId),
    })),

  clearWorkspace: () => set(emptyBench()),

  restoreWorkspace: (elementIds) =>
    set(() => ({
      workspace: elementIds
        .map((id) => get().inventory.find((placed) => placed.id === id))
        .filter((placed): placed is Element => Boolean(placed))
        .slice(0, WORKSPACE_CAPACITY),
      activeReaction: null,
      status: 'idle',
      noReaction: false,
    })),

  triggerReaction: (element1Id, element2Id) =>
    set({ activeReaction: findReaction(element1Id, element2Id) ?? null }),

  finishMerge: () => {
    const { workspace, triggerReaction } = get();
    if (workspace.length !== WORKSPACE_CAPACITY) return;

    const [first, second] = workspace;
    triggerReaction(first.id, second.id);

    const reaction = get().activeReaction;
    if (!reaction) {
      set({ workspace: [], status: 'idle', activeReaction: null, noReaction: true });
      return;
    }

    useLabStore.getState().pushHistory({
      elementIds: [first.id, second.id],
      reaction,
    });
    set({ status: 'result' });
  },
}));