// Shared, framework-light types for the 3D scene registry and its controls.
// Domain calculations stay in src/domains; these types only describe what a
// scene adapter renders and how the viewer asks the camera to move.

export type Point3 = [number, number, number];

export type TrajectoryPoint = { x: number; y: number };

export type SceneLabels = {
  launch: string;
  nucleus: string;
  vacuole: string;
};

export type Lab3DSceneProps = {
  trajectory: TrajectoryPoint[];
  sunlight: number;
  labels: SceneLabels;
};

export type CameraCommandInput =
  | { kind: 'reset' }
  | { kind: 'rotate'; direction: -1 | 1 }
  | { kind: 'zoom'; direction: -1 | 1 };

export type CameraCommand = CameraCommandInput & { id: number };
