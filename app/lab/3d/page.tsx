'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Mesh } from 'three';

function Box() {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.4;
      mesh.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#38bdf8" />
    </mesh>
  );
}

export default function Lab3DPage() {
  return (
    <div className="flex-1 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Lab · 3D Playground</h1>
          <p className="text-sm text-white/70">Quick smoke test for Three.js + @react-three/fiber + @react-three/drei.</p>
        </header>
        <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <Canvas camera={{ position: [4, 3, 6], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <Box />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
