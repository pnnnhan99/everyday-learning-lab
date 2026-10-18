'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { co2o2Simulation } from '@/domains/biology/simulations/co2-o2';
import { projectileSimulation } from '@/domains/physics/simulations/projectile';
import type { Lab3DModel } from '@/components/lab3d/Scene';

const Scene = dynamic(() => import('@/components/lab3d/Scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-white/60" role="status">
      Loading the 3D model…
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

const models: Array<{ id: Lab3DModel; label: string; domain: string }> = [
  { id: 'water', label: 'Water molecule', domain: 'Chemistry' },
  { id: 'projectile', label: 'Projectile motion', domain: 'Physics' },
  { id: 'plant-cell', label: 'Plant cell', domain: 'Biology' },
];

export default function Lab3DPage() {
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const [model, setModel] = useState<Lab3DModel>('water');
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(45);
  const [sunlight, setSunlight] = useState(0.8);

  const projectile = useMemo(
    () => projectileSimulation.create().run({ speed, angle, gravity: 9.81 }),
    [speed, angle],
  );
  const plant = useMemo(
    () => co2o2Simulation.create().run({ sunlight, co2: 0.6, water: 0.7, leafArea: 100 }),
    [sunlight],
  );
  const selected = models.find((item) => item.id === model) ?? models[0];

  return (
    <main className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Interactive 3D Lab</p>
          <h1 className="text-3xl font-bold tracking-tight">Explore science in three dimensions</h1>
          <p className="max-w-3xl text-sm leading-6 text-white/70">
            Rotate and zoom the model, change the available parameters, and compare the visualization with a simple scientific model.
            Every view includes assumptions and limitations so an illustration is not mistaken for a complete scientific solver.
          </p>
        </header>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a science model">
          {models.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={model === item.id}
              onClick={() => setModel(item.id)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                model === item.id
                  ? 'border-sky-300 bg-sky-300/15 text-sky-100'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-xs text-white/40">{item.domain} · </span>{item.label}
            </button>
          ))}
        </div>

        <section aria-label={`Interactive 3D ${selected.label} model`} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
          <div className="h-[340px] w-full sm:h-[460px]">
            <Scene
              key={model}
              model={model}
              reducedMotion={reducedMotion}
              trajectory={projectile.trajectory}
              sunlight={sunlight}
            />
          </div>
          <p className="border-t border-white/10 px-4 py-3 text-xs text-white/60">
            Controls: drag to rotate, scroll or pinch to zoom. Motion preference: {reducedMotion ? 'reduced' : 'standard'}.
          </p>
        </section>

        {model === 'water' && (
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-semibold">What you are seeing</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Water has the chemical formula H₂O. Each molecule contains two hydrogen atoms bonded to one oxygen atom.
                Spheres represent atoms and cylinders represent bonds.
              </p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-semibold">Element key</h2>
              <ul className="mt-3 space-y-3 text-sm text-white/75">
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-4 w-4 rounded-full bg-red-500" /><span><strong>Oxygen (O)</strong> — one atom, shown in red.</span></li>
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-4 w-4 rounded-full border border-slate-300 bg-slate-50" /><span><strong>Hydrogen (H)</strong> — two atoms, shown in white.</span></li>
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-1 w-5 rounded bg-slate-300" /><span><strong>Bonds</strong> — simplified connectors between atoms.</span></li>
              </ul>
            </article>
            <aside className="sm:col-span-2 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100/80">
              <strong className="text-amber-100">Limitations:</strong> atom sizes and distances are not to scale. This scene illustrates connectivity only; it does not calculate electron orbitals, bond energy, or molecular behavior.
            </aside>
          </section>
        )}

        {model === 'projectile' && (
          <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
            <div>
              <h2 className="font-semibold">Change the launch conditions</h2>
              <p className="mt-1 text-sm text-white/60">The trajectory and calculated values update using the existing projectile-motion model.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="flex justify-between"><span>Launch speed</span><strong>{speed} m/s</strong></span>
                <input className="w-full accent-sky-400" type="range" min="5" max="30" step="1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
              </label>
              <label className="space-y-2 text-sm">
                <span className="flex justify-between"><span>Launch angle</span><strong>{angle}°</strong></span>
                <input className="w-full accent-sky-400" type="range" min="15" max="75" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-white/50">Range</p><p className="mt-1 text-lg font-semibold">{projectile.range.toFixed(1)} m</p></div>
              <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-white/50">Peak height</p><p className="mt-1 text-lg font-semibold">{projectile.maxHeight.toFixed(1)} m</p></div>
              <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-white/50">Flight time</p><p className="mt-1 text-lg font-semibold">{projectile.flightTime.toFixed(2)} s</p></div>
            </div>
            <p className="text-xs leading-5 text-white/50">Assumptions: no air resistance, constant gravity (9.81 m/s²), and equal launch/landing heights. Educational model only; never use it to aim real projectiles.</p>
          </section>
        )}

        {model === 'plant-cell' && (
          <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
            <div>
              <h2 className="font-semibold">Light and plant gas exchange</h2>
              <p className="mt-1 text-sm leading-6 text-white/60">The cell drawing is illustrative. Adjust light to see how the existing simplified photosynthesis/respiration model responds.</p>
            </div>
            <label className="block space-y-2 text-sm">
              <span className="flex justify-between"><span>Relative sunlight</span><strong>{Math.round(sunlight * 100)}%</strong></span>
              <input className="w-full accent-lime-400" type="range" min="0" max="1" step="0.05" value={sunlight} onChange={(event) => setSunlight(Number(event.target.value))} />
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-white/50">Photosynthesis rate</p><p className="mt-1 text-lg font-semibold">{plant.photosynthesisRate.toFixed(1)}</p></div>
              <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-white/50">Respiration rate</p><p className="mt-1 text-lg font-semibold">{plant.respirationRate.toFixed(1)}</p></div>
              <div className="rounded-lg bg-black/20 p-3"><p className="text-xs text-white/50">Net rate</p><p className="mt-1 text-lg font-semibold">{plant.netRate.toFixed(1)}</p></div>
            </div>
            <p className="text-xs leading-5 text-white/50">Model limits: heuristic relative rates, not calibrated physiological measurements. CO₂, water, and leaf area are held constant.</p>
          </section>
        )}
      </div>
    </main>
  );
}
