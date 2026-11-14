// Shared 3D model identifiers and link helpers. The learning catalog, the
// /lab/3d page, and the scene renderer all depend on this single definition.

export const LAB3D_MODEL_IDS = ['water', 'projectile', 'plant-cell'] as const;

export type Lab3DModel = (typeof LAB3D_MODEL_IDS)[number];

export function isLab3DModel(value: string | null | undefined): value is Lab3DModel {
  return typeof value === 'string' && (LAB3D_MODEL_IDS as readonly string[]).includes(value);
}

// Unknown or missing values fall back to 'water' so a stale link never breaks
// the page.
export function resolveInitialModel(value: string | null | undefined): Lab3DModel {
  return isLab3DModel(value) ? value : 'water';
}

export function lab3dHref(model: Lab3DModel): string {
  return `/lab/3d?model=${model}`;
}
