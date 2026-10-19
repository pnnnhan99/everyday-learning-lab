import type { Lab3DModel } from './Scene';

export const LAB3D_MODEL_IDS: readonly string[] = ['water', 'projectile', 'plant-cell'];

export function isLab3DModel(value: string | null | undefined): value is Lab3DModel {
  return typeof value === 'string' && LAB3D_MODEL_IDS.includes(value);
}

// Resolves the model for /lab/3d?model=… — unknown or missing values fall
// back to 'water' so a stale link never breaks the page.
export function resolveInitialModel(value: string | null | undefined): Lab3DModel {
  return isLab3DModel(value) ? value : 'water';
}
