'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useSyncExternalStore, useId } from 'react';
import { co2o2Simulation } from '@/domains/biology/simulations/co2-o2';
import type { CO2O2Result } from '@/domains/biology/simulations/co2-o2';
import { projectileSimulation } from '@/domains/physics/simulations/projectile';
import type { ProjectileResult } from '@/domains/physics/simulations/projectile';
import type { Lab3DModel } from '@/components/lab3d/Scene';
import { resolveInitialModel } from '@/components/lab3d/params';
import { SceneErrorBoundary } from '@/components/lab3d/SceneErrorBoundary';

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

const models: Array<{ id: Lab3DModel; label: string; domain: string; modelType: 'Illustrative' | 'Quantitative' }> = [
  { id: 'water', label: 'Water molecule', domain: 'Chemistry', modelType: 'Illustrative' },
  { id: 'projectile', label: 'Projectile motion', domain: 'Physics', modelType: 'Quantitative' },
  { id: 'plant-cell', label: 'Plant cell', domain: 'Biology', modelType: 'Illustrative' },
];

// A short, non-visual description of each scene. Announced to assistive tech
// and shown as a fallback if the canvas cannot render.
const MODEL_ALT_TEXT: Record<Lab3DModel, string> = {
  water:
    'A water molecule shown as one large oxygen atom bonded to two smaller hydrogen atoms. Atom sizes are illustrative, not to scale.',
  projectile:
    'A parabolic arc traced from a launch point across flat ground, with a marker at the midpoint of the flight path.',
  'plant-cell':
    'A round plant cell with a nucleus, a large central vacuole, and several green chloroplasts. The cell wall is drawn as a wireframe shell.',
};

function Lab3DPageInner() {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get('model');
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const [model, setModel] = useState<Lab3DModel>(resolveInitialModel(initialModel));
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(45);
  const [sunlight, setSunlight] = useState(0.8);

  const [projectile, setProjectile] = useState<ProjectileResult | null>(null);
  const [plant, setPlant] = useState<CO2O2Result | null>(null);
  const [projectileError, setProjectileError] = useState<string | null>(null);
  const [plantError, setPlantError] = useState<string | null>(null);
  const sceneAltTextId = useId();

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(projectileSimulation.create().run({ speed, angle, gravity: 9.81 }))
      .then((result) => {
        if (!cancelled) {
          setProjectile(result);
          setProjectileError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setProjectile(null);
          setProjectileError(err instanceof Error ? err.message : 'Could not compute the trajectory.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [speed, angle]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(co2o2Simulation.create().run({ sunlight, co2: 0.6, water: 0.7, leafArea: 100 }))
      .then((result) => {
        if (!cancelled) {
          setPlant(result);
          setPlantError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setPlant(null);
          setPlantError(err instanceof Error ? err.message : 'Could not compute the gas-exchange rates.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sunlight]);
  const selected = models.find((item) => item.id === model) ?? models[0];

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.24em] text-sky-600 uppercase dark:text-sky-300">
            Interactive 3D Lab
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Explore science in three dimensions</h1>
          <p className="max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
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
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                model === item.id
                  ? 'border-sky-500 bg-sky-50 text-sky-700 dark:border-sky-300 dark:bg-sky-300/15 dark:text-sky-100'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-900'
              }`}
            >
              <span className="text-xs opacity-60">{item.domain} · </span>{item.label}
            </button>
          ))}
        </div>

        <section aria-label={`Interactive 3D ${selected.label} model`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-slate-950 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <p className="text-sm font-medium">{selected.domain}: {selected.label}</p>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase">
              {selected.modelType} model
            </span>
          </div>
          <p id={sceneAltTextId} className="sr-only">
            {MODEL_ALT_TEXT[model]}
          </p>
          <div className="h-[340px] w-full sm:h-[460px]" role="img" aria-describedby={sceneAltTextId}>
            <SceneErrorBoundary>
              <Scene
                key={model}
                model={model}
                reducedMotion={reducedMotion}
                trajectory={projectile?.trajectory ?? []}
                sunlight={sunlight}
              />
            </SceneErrorBoundary>
          </div>
          <p className="border-t border-white/10 px-4 py-3 text-xs text-white/60">
            <span aria-hidden="true">
              Controls: drag to rotate, scroll or pinch to zoom. Motion preference: {reducedMotion ? 'reduced' : 'standard'}.
            </span>
            <span className="sr-only">
              Use the controls below the model to change the launch or lighting parameters. Motion preference: {reducedMotion ? 'reduced' : 'standard'}.
            </span>
          </p>
        </section>

        {model === 'water' && (
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h2 className="font-semibold">What you are seeing</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                Water has the chemical formula H₂O. Each molecule contains two hydrogen atoms bonded to one oxygen atom.
                Spheres represent atoms and cylinders represent bonds.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h2 className="font-semibold">Element key</h2>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-4 w-4 rounded-full bg-red-500" /><span><strong>Oxygen (O)</strong> — one atom, shown in red.</span></li>
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-4 w-4 rounded-full border border-slate-300 bg-slate-50" /><span><strong>Hydrogen (H)</strong> — two atoms, shown in white.</span></li>
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-1 w-5 rounded bg-slate-300" /><span><strong>Bonds</strong> — simplified connectors between atoms.</span></li>
              </ul>
            </article>
            <aside className="sm:col-span-2 rounded-xl border border-amber-300/50 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <strong className="text-amber-900 dark:text-amber-100">Limitations:</strong> atom sizes and distances are not to scale. This scene illustrates connectivity only; it does not calculate electron orbitals, bond energy, or molecular behavior.
            </aside>
          </section>
        )}

        {model === 'projectile' && (
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div>
              <h2 className="font-semibold">Change the launch conditions</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">The trajectory and calculated values update using the existing projectile-motion model.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="flex justify-between"><span>Launch speed</span><strong>{speed} m/s</strong></span>
                <input className="w-full accent-sky-500" type="range" min="5" max="30" step="1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
              </label>
              <label className="space-y-2 text-sm">
                <span className="flex justify-between"><span>Launch angle</span><strong>{angle}°</strong></span>
                <input className="w-full accent-sky-500" type="range" min="15" max="75" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
              </label>
            </div>
            {projectileError ? (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
                {projectileError} Try a different speed or angle.
              </p>
            ) : (
              <div aria-live="polite" className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">Range</p><p className="mt-1 text-lg font-semibold">{projectile ? `${projectile.range.toFixed(1)} m` : 'Calculating…'}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">Peak height</p><p className="mt-1 text-lg font-semibold">{projectile ? `${projectile.maxHeight.toFixed(1)} m` : 'Calculating…'}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">Flight time</p><p className="mt-1 text-lg font-semibold">{projectile ? `${projectile.flightTime.toFixed(2)} s` : 'Calculating…'}</p></div>
              </div>
            )}
            <p className="text-xs leading-5 text-zinc-500">Assumptions: no air resistance, constant gravity (9.81 m/s²), and equal launch/landing heights. Educational model only; never use it to aim real projectiles.</p>
          </section>
        )}

        {model === 'plant-cell' && (
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div>
              <h2 className="font-semibold">Light and plant gas exchange</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">The cell drawing is illustrative. Adjust light to see how the existing simplified photosynthesis/respiration model responds.</p>
            </div>
            <label className="block space-y-2 text-sm">
              <span className="flex justify-between"><span>Relative sunlight</span><strong>{Math.round(sunlight * 100)}%</strong></span>
              <input className="w-full accent-lime-500" type="range" min="0" max="1" step="0.05" value={sunlight} onChange={(event) => setSunlight(Number(event.target.value))} />
            </label>
            {plantError ? (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
                {plantError} Try a different sunlight level.
              </p>
            ) : (
              <div aria-live="polite" className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">Photosynthesis rate</p><p className="mt-1 text-lg font-semibold">{plant ? plant.photosynthesisRate.toFixed(1) : 'Calculating…'}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">Respiration rate</p><p className="mt-1 text-lg font-semibold">{plant ? plant.respirationRate.toFixed(1) : 'Calculating…'}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">Net rate</p><p className="mt-1 text-lg font-semibold">{plant ? plant.netRate.toFixed(1) : 'Calculating…'}</p></div>
              </div>
            )}
            <p className="text-xs leading-5 text-zinc-500">Model limits: heuristic relative rates, not calibrated physiological measurements. CO₂, water, and leaf area are held constant.</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default function Lab3DPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center py-16 text-sm text-zinc-500" role="status">
          Loading the 3D lab…
        </div>
      }
    >
      <Lab3DPageInner />
    </Suspense>
  );
}
