'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, type ComponentRef } from 'react';

import type { Lab3DModel } from '@/learning/lab3d';
import { applyCameraCommand } from './cameraCommands';
import { getQualitySettings, type Lab3DQuality } from './quality';
import { getSceneDescriptor } from './sceneRegistry';
import type { CameraCommand, SceneLabels, TrajectoryPoint } from './sceneTypes';
import { frameloopForVisibility, usePageVisible } from './visibility';

export type { Lab3DModel };

export default function Scene({
  model = 'water',
  reducedMotion = false,
  trajectory = [],
  sunlight = 0.8,
  labels,
  fallbackText,
  cameraCommand,
  quality = 'standard',
}: {
  model?: Lab3DModel;
  reducedMotion?: boolean;
  trajectory?: TrajectoryPoint[];
  sunlight?: number;
  labels?: SceneLabels;
  fallbackText?: string;
  cameraCommand?: CameraCommand | null;
  quality?: Lab3DQuality;
}) {
  const sceneLabels: SceneLabels = labels ?? { launch: 'Launch', nucleus: 'Nucleus', vacuole: 'Vacuole' };
  const descriptor = getSceneDescriptor(model);
  const SceneContent = descriptor.component;
  const qualitySettings = getQualitySettings(quality);
  const pageVisible = usePageVisible();
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!cameraCommand || !controls) return;
    applyCameraCommand(controls, cameraCommand);
  }, [cameraCommand]);

  return (
    <Canvas
      camera={{ position: [3.2, 2.4, 5.2], fov: 42 }}
      dpr={qualitySettings.dpr}
      frameloop={frameloopForVisibility(pageVisible)}
      fallback={<div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/70">{fallbackText ?? 'WebGL is unavailable in this browser. Use the explanation and model notes below to continue learning.'}</div>}
    >
      <color attach="background" args={['#07111f']} />
      <ambientLight intensity={0.8 + sunlight * 0.3} />
      <directionalLight position={[4, 5, 5]} intensity={1.2 + sunlight * 0.8} />
      <pointLight position={[-4, -2, -3]} intensity={0.7} color="#38bdf8" />
      <SceneContent trajectory={trajectory} sunlight={sunlight} labels={sceneLabels} quality={qualitySettings} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping={!reducedMotion}
        dampingFactor={0.08}
        enablePan={false}
        minDistance={3}
        maxDistance={9}
      />
    </Canvas>
  );
}
