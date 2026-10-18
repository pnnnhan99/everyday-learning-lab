'use client';

import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';

const Scene = dynamic(() => import('@/components/lab3d/Scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-white/50">Loading 3D scene…</div>
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
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Lab · 3D Playground</h1>
          <p className="text-sm text-white/70">Smoke test for Three.js + @react-three/fiber + @react-three/drei.</p>
        </header>
        <div
          role="img"
          aria-label="A rotating 3D cube on a dark background"
          className="relative h-[420px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40"
        >
          <Scene reducedMotion={reducedMotion} />
        </div>
        <p className="text-xs text-white/40">
          Respects the &quot;prefers-reduced-motion&quot; setting: animation pauses when reduced motion is requested.
        </p>
      </div>
    </div>
  );
}
