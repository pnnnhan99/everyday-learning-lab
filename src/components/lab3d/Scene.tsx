'use client';

import { Html, Line, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';

export type Lab3DModel = 'water' | 'projectile' | 'plant-cell';
type Point3 = [number, number, number];
type TrajectoryPoint = { x: number; y: number };

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

function ProjectilePath({ trajectory }: { trajectory: TrajectoryPoint[] }) {
  const points = useMemo(() => {
    const maxX = trajectory[trajectory.length - 1]?.x ?? 1;
    const scale = 5 / Math.max(maxX, 1);
    return trajectory.map((point) => [point.x * scale, point.y * scale, 0] as Point3);
  }, [trajectory]);

  const marker = points[Math.floor(points.length / 2)] ?? [2.5, 1, 0];

  return (
    <group>
      <mesh position={[2.5, -0.07, 0]}>
        <boxGeometry args={[6, 0.12, 1.8]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <Line points={points} color="#38bdf8" lineWidth={3} />
      <mesh position={marker}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#92400e" emissiveIntensity={0.35} />
      </mesh>
      <Html position={[0, -0.4, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <span className="whitespace-nowrap rounded bg-slate-950/80 px-2 py-1 text-xs text-white">Launch</span>
      </Html>
    </group>
  );
}

function PlantCell({ sunlight }: { sunlight: number }) {
  const chloroplasts: Point3[] = [
    [-0.72, 0.55, 0.2],
    [0.65, 0.52, -0.25],
    [-0.7, -0.45, -0.2],
    [0.68, -0.5, 0.25],
    [0.05, 0.8, 0.15],
  ];

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.55, 40, 32]} />
        <meshStandardMaterial color="#84cc16" wireframe roughness={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.48, 40, 32]} />
        <meshStandardMaterial color="#65a30d" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh position={[-0.22, 0.05, 0.15]} scale={[0.48, 0.48, 0.42]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#c084fc" roughness={0.35} />
      </mesh>
      <mesh position={[0.36, -0.25, -0.12]} scale={[0.7, 0.86, 0.48]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.72} roughness={0.4} />
      </mesh>
      {chloroplasts.map((position, index) => (
        <mesh key={index} position={position} scale={[0.24, 0.13, 0.16]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#16a34a"
            emissiveIntensity={0.05 + sunlight * 0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
      <Html position={[-0.22, 0.65, 0.25]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <span className="rounded bg-slate-950/80 px-2 py-0.5 text-xs text-white">Nucleus</span>
      </Html>
      <Html position={[0.45, -0.9, 0.1]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <span className="rounded bg-slate-950/80 px-2 py-0.5 text-xs text-white">Vacuole</span>
      </Html>
    </group>
  );
}

export default function Scene({
  model = 'water',
  reducedMotion = false,
  trajectory = [],
  sunlight = 0.8,
}: {
  model?: Lab3DModel;
  reducedMotion?: boolean;
  trajectory?: TrajectoryPoint[];
  sunlight?: number;
}) {
  return (
    <Canvas
      camera={{ position: [3.2, 2.4, 5.2], fov: 42 }}
      dpr={[1, 1.5]}
      fallback={<div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/70">WebGL is unavailable in this browser. Use the explanation and model notes below to continue learning.</div>}
    >
      <color attach="background" args={['#07111f']} />
      <ambientLight intensity={0.8 + sunlight * 0.3} />
      <directionalLight position={[4, 5, 5]} intensity={1.2 + sunlight * 0.8} />
      <pointLight position={[-4, -2, -3]} intensity={0.7} color="#38bdf8" />
      {model === 'water' && <WaterMolecule />}
      {model === 'projectile' && <ProjectilePath trajectory={trajectory} />}
      {model === 'plant-cell' && <PlantCell sunlight={sunlight} />}
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
