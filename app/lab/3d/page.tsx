'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState, useSyncExternalStore, useId } from 'react';
import { co2o2Simulation } from '@/domains/biology/simulations/co2-o2';
import type { CO2O2Result } from '@/domains/biology/simulations/co2-o2';
import { projectileSimulation } from '@/domains/physics/simulations/projectile';
import type { ProjectileResult } from '@/domains/physics/simulations/projectile';
import type { Lab3DModel } from '@/learning/lab3d';
import { resolveInitialModel } from '@/components/lab3d/params';
import { SceneErrorBoundary } from '@/components/lab3d/SceneErrorBoundary';
import { getSceneDescriptor, LAB3D_SCENE_IDS } from '@/components/lab3d/sceneRegistry';
import type { CameraCommand, CameraCommandInput } from '@/components/lab3d/sceneTypes';
import { useDictionary } from '@/i18n/useDictionary';
import type { Dictionary } from '@/i18n/dict';

const Scene = dynamic(() => import('@/components/lab3d/Scene'), {
  ssr: false,
  loading: () => <SceneLoading />,
});

function SceneLoading() {
  const dictionary = useDictionary();
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-white/60" role="status">
      {dictionary.lab3d.loadingModel}
    </div>
  );
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function modelAltText(model: Lab3DModel, dictionary: Dictionary): string {
  const t = dictionary.lab3d;
  if (model === 'water') return t.altWater;
  if (model === 'projectile') return t.altProjectile;
  return t.altPlantCell;
}

function Lab3DPageInner() {
  const dictionary = useDictionary();
  const t = dictionary.lab3d;
  const searchParams = useSearchParams();
  const initialModel = searchParams.get('model');
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const [model, setModel] = useState<Lab3DModel>(resolveInitialModel(initialModel));
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(45);
  const [sunlight, setSunlight] = useState(0.8);
  const [cameraCommand, setCameraCommand] = useState<CameraCommand | null>(null);
  const cameraCommandId = useRef(0);

  function sendCameraCommand(command: CameraCommandInput) {
    cameraCommandId.current += 1;
    setCameraCommand({ ...command, id: cameraCommandId.current });
  }

  const [projectile, setProjectile] = useState<ProjectileResult | null>(null);
  const [plant, setPlant] = useState<CO2O2Result | null>(null);
  const [projectileError, setProjectileError] = useState<string | null>(null);
  const [plantError, setPlantError] = useState<string | null>(null);
  const sceneAltTextId = useId();

  const models = LAB3D_SCENE_IDS.map((id) => {
    const descriptor = getSceneDescriptor(id);
    return {
      id,
      label: dictionary.home.modelLabels[id],
      domain: dictionary.domains[descriptor.domainKey],
      modelType: t[descriptor.modelTypeKey],
    };
  });

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
          setProjectileError(err instanceof Error ? err.message : t.tryDifferent);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [speed, angle, t.tryDifferent]);

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
          setPlantError(err instanceof Error ? err.message : t.tryDifferentSunlight);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sunlight, t.tryDifferentSunlight]);
  const selected = models.find((item) => item.id === model) ?? models[0];

  return (
    <main className="flex-1 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.24em] text-sky-600 uppercase dark:text-sky-300">
            {t.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t.intro}</p>
        </header>

        <div className="flex flex-wrap gap-2" role="group" aria-label={t.chooseModel}>
          {models.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={model === item.id}
              onClick={() => {
                setModel(item.id);
                setCameraCommand(null);
              }}
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

        <section aria-label={`${t.sceneLabel}: ${selected.label}`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-slate-950 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
            <p className="text-sm font-medium">{selected.domain}: {selected.label}</p>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase">
              {selected.modelType}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-3" role="group" aria-label={t.cameraControls}>
            {([
              ['rotateLeft', t.rotateLeft, { kind: 'rotate', direction: -1 }],
              ['rotateRight', t.rotateRight, { kind: 'rotate', direction: 1 }],
              ['zoomIn', t.zoomIn, { kind: 'zoom', direction: 1 }],
              ['zoomOut', t.zoomOut, { kind: 'zoom', direction: -1 }],
              ['resetCamera', t.resetCamera, { kind: 'reset' }],
            ] as const).map(([key, label, command]) => (
              <button
                key={key}
                type="button"
                onClick={() => sendCameraCommand(command)}
                className="min-h-10 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:text-sm"
              >
                {label}
              </button>
            ))}
          </div>
          <p id={sceneAltTextId} className="sr-only">
            {modelAltText(model, dictionary)}
          </p>
          <div className="h-[340px] w-full sm:h-[460px]" role="img" aria-describedby={sceneAltTextId}>
            <SceneErrorBoundary>
              <Scene
                key={model}
                model={model}
                reducedMotion={reducedMotion}
                trajectory={projectile?.trajectory ?? []}
                sunlight={sunlight}
                labels={{ launch: t.launch, nucleus: t.nucleus, vacuole: t.vacuole }}
                fallbackText={t.webglUnavailable}
                cameraCommand={cameraCommand}
              />
            </SceneErrorBoundary>
          </div>
          <p className="border-t border-white/10 px-4 py-3 text-xs text-white/60">
            <span aria-hidden="true">
              {t.controls} {t.motionPreference}: {reducedMotion ? t.reduced : t.standard}.
            </span>
            <span className="sr-only">
              {t.controlsSr} {t.motionPreference}: {reducedMotion ? t.reduced : t.standard}.
            </span>
          </p>
        </section>

        {model === 'water' && (
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h2 className="font-semibold">{t.whatSeeing}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t.waterBody}</p>
            </article>
            <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
              <h2 className="font-semibold">{t.elementKey}</h2>
              <ul className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-4 w-4 rounded-full bg-red-500" /><span><strong>{t.oxygenAtom}</strong> — {t.oxygenNote}</span></li>
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-4 w-4 rounded-full border border-slate-300 bg-slate-50" /><span><strong>{t.hydrogenAtom}</strong> — {t.hydrogenNote}</span></li>
                <li className="flex items-center gap-3"><span aria-hidden="true" className="h-1 w-5 rounded bg-slate-300" /><span><strong>{t.bonds}</strong> — {t.bondsNote}</span></li>
              </ul>
            </article>
            <aside className="sm:col-span-2 rounded-xl border border-amber-300/50 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <strong className="text-amber-900 dark:text-amber-100">{t.limitations}:</strong> {t.waterLimitations}
            </aside>
          </section>
        )}

        {model === 'projectile' && (
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div>
              <h2 className="font-semibold">{t.launchConditions}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{t.trajectoryNote}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="flex justify-between"><span>{t.launchSpeed}</span><strong>{speed} m/s</strong></span>
                <input className="w-full accent-sky-500" type="range" min="5" max="30" step="1" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
              </label>
              <label className="space-y-2 text-sm">
                <span className="flex justify-between"><span>{t.launchAngle}</span><strong>{angle}°</strong></span>
                <input className="w-full accent-sky-500" type="range" min="15" max="75" step="1" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
              </label>
            </div>
            {projectileError ? (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
                {projectileError} {t.tryDifferent}
              </p>
            ) : (
              <div aria-live="polite" className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">{t.range}</p><p className="mt-1 text-lg font-semibold">{projectile ? `${projectile.range.toFixed(1)} m` : t.calculating}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">{t.peakHeight}</p><p className="mt-1 text-lg font-semibold">{projectile ? `${projectile.maxHeight.toFixed(1)} m` : t.calculating}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">{t.flightTime}</p><p className="mt-1 text-lg font-semibold">{projectile ? `${projectile.flightTime.toFixed(2)} s` : t.calculating}</p></div>
              </div>
            )}
            <p className="text-xs leading-5 text-zinc-500">{t.projectileAssumptions}</p>
          </section>
        )}

        {model === 'plant-cell' && (
          <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div>
              <h2 className="font-semibold">{t.plantHeading}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t.plantBody}</p>
            </div>
            <label className="block space-y-2 text-sm">
              <span className="flex justify-between"><span>{t.sunlight}</span><strong>{Math.round(sunlight * 100)}%</strong></span>
              <input className="w-full accent-lime-500" type="range" min="0" max="1" step="0.05" value={sunlight} onChange={(event) => setSunlight(Number(event.target.value))} />
            </label>
            {plantError ? (
              <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
                {plantError} {t.tryDifferentSunlight}
              </p>
            ) : (
              <div aria-live="polite" className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">{t.photosynthesisRate}</p><p className="mt-1 text-lg font-semibold">{plant ? plant.photosynthesisRate.toFixed(1) : t.calculating}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">{t.respirationRate}</p><p className="mt-1 text-lg font-semibold">{plant ? plant.respirationRate.toFixed(1) : t.calculating}</p></div>
                <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/60"><p className="text-xs text-zinc-500">{t.netRate}</p><p className="mt-1 text-lg font-semibold">{plant ? plant.netRate.toFixed(1) : t.calculating}</p></div>
              </div>
            )}
            <p className="text-xs leading-5 text-zinc-500">{t.plantLimits}</p>
          </section>
        )}
      </div>
    </main>
  );
}

function Lab3DLoading() {
  const dictionary = useDictionary();
  return (
    <div className="flex h-full w-full items-center justify-center py-16 text-sm text-zinc-500" role="status">
      {dictionary.lab3d.loadingLab}
    </div>
  );
}

export default function Lab3DPage() {
  return (
    <Suspense fallback={<Lab3DLoading />}>
      <Lab3DPageInner />
    </Suspense>
  );
}
