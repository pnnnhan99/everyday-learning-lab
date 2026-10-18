'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function SpinningBox({ animate }: { animate: boolean }) {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current || !animate) return;
    mesh.current.rotation.x += delta * 0.4;
    mesh.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#38bdf8" />
    </mesh>
  );
}

export default function Scene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas camera={{ position: [4, 3, 6], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <SpinningBox animate={!reducedMotion} />
    </Canvas>
  );
}
