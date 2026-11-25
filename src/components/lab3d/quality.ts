// Presentation-only presets. These values change canvas resolution and mesh
// tessellation, never simulation inputs, equations, or displayed results.

export type Lab3DQuality = 'low' | 'standard';

export type Lab3DQualitySettings = {
  dpr: [number, number];
  sphereSegments: number;
  cylinderSegments: number;
};

export const LAB3D_QUALITY_SETTINGS: Record<Lab3DQuality, Lab3DQualitySettings> = {
  low: { dpr: [1, 1], sphereSegments: 16, cylinderSegments: 8 },
  standard: { dpr: [1, 1.5], sphereSegments: 32, cylinderSegments: 16 },
};

export function isLab3DQuality(value: string | null | undefined): value is Lab3DQuality {
  return value === 'low' || value === 'standard';
}

export function resolveQuality(value: string | null | undefined): Lab3DQuality {
  return isLab3DQuality(value) ? value : 'standard';
}

export function getQualitySettings(quality: Lab3DQuality): Lab3DQualitySettings {
  return LAB3D_QUALITY_SETTINGS[quality];
}
