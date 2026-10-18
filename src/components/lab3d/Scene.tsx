'use client';

import { Html, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';

type Point3 = [number, number, number];

function Atom({
  position,
  radius,
  color,
  label,
}: {
  position: Point3;
  radius: number;
  color: string;
  label: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.34} metalness={0.08} />
      </mesh>
      <Html center distanceFactor={8} position={[0, radius + 0.18, 0]} style={{ pointerEvents: 'none' }}>
        <span className="rounded bg-slate-950/80 px-2 py-0.5 text-xs font-semibold text-white">
          {label}
        </span>
      </Html>
    </group>
  );
}

function Bond({ start, end }: { start: Point3; end: Point3 }) {
  const { midpoint, length, rotation } = useMemo(() => {
    const from = new Vector3(...start);
    const to = new Vector3(...end);
    const direction = to.clone().sub(from);
    const midpoint = from.clone().add(to).multiplyScalar(0.5);
    const rotation = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction.clone().normalize(),
    );

    return { midpoint, length: direction.length(), rotation };
  }, [start, end]);

  return (
    <mesh position={midpoint} quaternion={rotation}>
      <cylinderGeometry args={[0.075, 0.075, length, 16]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
    </mesh>
  );
}

function WaterMolecule() {
  // Illustrative geometry only: positions and radii are not to scale.
  const oxygen: Point3 = [0, 0, 0];
  const hydrogenA: Point3 = [0.72, 0.55, 0];
  const hydrogenB: Point3 = [-0.72, 0.55, 0];

  return (
    <group>
      <Bond start={oxygen} end={hydrogenA} />
      <Bond start={oxygen} end={hydrogenB} />
      <Atom position={oxygen} radius={0.48} color="#ef4444" label="O" />
      <Atom position={hydrogenA} radius={0.29} color="#f8fafc" label="H" />
      <Atom position={hydrogenB} radius={0.29} color="#f8fafc" label="H" />
    </group>
  );
}

export default function Scene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      camera={{ position: [3.2, 2.4, 5.2], fov: 42 }}
      dpr={[1, 1.5]}
      fallback={<div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/70">WebGL is unavailable in this browser. You can still use the molecule explanation and element legend below.</div>}
    >
      <color attach="background" args={['#07111f']} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 5]} intensity={2} />
      <pointLight position={[-4, -2, -3]} intensity={0.7} color="#38bdf8" />
      <WaterMolecule />
      <OrbitControls
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
