'use client';

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useGameStore } from '../../store/useGameStore';
import type { Element } from '../../types/game';
import DraggableElement, { ElementCard } from './DraggableElement';
import WorkspaceDropzone from './WorkspaceDropzone';

export default function Laboratory() {
  const inventory = useGameStore((state) => state.inventory);
  const workspaceIds = useGameStore(
    useShallow((state) => state.workspace.map((element) => element.id)),
  );
  const moveToWorkspace = useGameStore((state) => state.moveToWorkspace);

  const [activeElement, setActiveElement] = useState<Element | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveElement((event.active.data.current?.element as Element | undefined) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveElement(null);

    if (event.over?.id !== 'workspace') return;

    const element = event.active.data.current?.element as Element | undefined;
    if (element) moveToWorkspace(element);
  }

  const shelfElements = inventory.filter((element) => !workspaceIds.includes(element.id));

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-12">
        <header className="space-y-2 text-center">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-sky-300/70 uppercase">
            Everyday Science
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Mix it up in the lab
          </h1>
          <p className="text-sm text-white/55">
            Explore simplified models of how selected substances can interact.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-[11px] font-medium tracking-widest text-white/40 uppercase">
            Supply Cabinet
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatePresence initial={false}>
              {shelfElements.map((element) => (
                <DraggableElement key={element.id} element={element} />
              ))}
            </AnimatePresence>
          </div>
        </section>

        <WorkspaceDropzone />
      </main>

      <DragOverlay dropAnimation={{ duration: 220, easing: 'ease-out' }}>
        {activeElement ? <ElementCard element={activeElement} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
