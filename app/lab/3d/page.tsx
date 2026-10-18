'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

const Scene = dynamic(() => import('@/components/lab3d/Scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-white/60" role="status">
      Loading the 3D molecule…
    </div>
  ),
});

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Lab3DPage() {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  return (
    <main className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Chemistry · 3D Lab</p>
          <h1 className="text-3xl font-bold tracking-tight">Explore a water molecule</h1>
          <p className="max-w-3xl text-sm leading-6 text-white/70">
            Rotate and zoom the model to explore how one oxygen atom and two hydrogen atoms are connected.
            This is an illustrative model, not a scale-accurate molecular structure or a quantum simulation.
          </p>
        </header>

        <section aria-label="Interactive 3D water molecule model" className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
          <div className="h-[360px] w-full sm:h-[460px]">
            <Scene reducedMotion={reducedMotion} />
          </div>
          <p className="border-t border-white/10 px-4 py-3 text-xs text-white/60">
            Controls: drag to rotate, scroll or pinch to zoom. Motion preference: {reducedMotion ? 'reduced' : 'standard'}.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">What you are seeing</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Water has the chemical formula H₂O. Each molecule contains two hydrogen atoms bonded to one oxygen atom.
              The model uses spheres for atoms and cylinders for bonds to make the structure easier to inspect.
            </p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold">Element key</h2>
            <ul className="mt-3 space-y-3 text-sm text-white/75">
              <li className="flex items-center gap-3">
                <span aria-hidden="true" className="h-4 w-4 rounded-full bg-red-500" />
                <span><strong>Oxygen (O)</strong> — one atom, shown in red.</span>
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden="true" className="h-4 w-4 rounded-full border border-slate-300 bg-slate-50" />
                <span><strong>Hydrogen (H)</strong> — two atoms, shown in white.</span>
              </li>
              <li className="flex items-center gap-3">
                <span aria-hidden="true" className="h-1 w-5 rounded bg-slate-300" />
                <span><strong>Bonds</strong> — simplified connectors between atoms.</span>
              </li>
            </ul>
          </article>
        </section>

        <aside className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100/80">
          <strong className="text-amber-100">Model limitations:</strong> atom sizes and distances are not to scale.
          The scene illustrates connectivity only; it does not calculate electron orbitals, bond energy, or molecular behavior.
        </aside>
      </div>
    </main>
  );
}
