import type { ComponentType } from 'react';

import { isLab3DModel, type Lab3DModel } from '@/learning/lab3d';
import { PlantCellScene, ProjectileScene, WaterScene } from './SceneContents';
import type { Lab3DSceneProps } from './sceneTypes';

// The page, the renderer, and the learning catalog all use the model ids from
// src/learning/lab3d.ts. This registry is the single place that maps each id to
// a scene component; adding a model must also add its entry here.
export type SceneDomainKey = 'chemistry' | 'physics' | 'biology';
export type SceneModelTypeKey = 'modelTypeIllustrative' | 'modelTypeQuantitative';

export type Lab3DSceneDescriptor = {
  id: Lab3DModel;
  domainKey: SceneDomainKey;
  modelTypeKey: SceneModelTypeKey;
  component: ComponentType<Lab3DSceneProps>;
};

export const LAB3D_SCENE_REGISTRY = {
  water: {
    id: 'water',
    domainKey: 'chemistry',
    modelTypeKey: 'modelTypeIllustrative',
    component: WaterScene,
  },
  projectile: {
    id: 'projectile',
    domainKey: 'physics',
    modelTypeKey: 'modelTypeQuantitative',
    component: ProjectileScene,
  },
  'plant-cell': {
    id: 'plant-cell',
    domainKey: 'biology',
    modelTypeKey: 'modelTypeIllustrative',
    component: PlantCellScene,
  },
} satisfies Record<Lab3DModel, Lab3DSceneDescriptor>;

export const LAB3D_SCENE_IDS = Object.keys(LAB3D_SCENE_REGISTRY) as Lab3DModel[];

export function getSceneDescriptor(model: Lab3DModel): Lab3DSceneDescriptor {
  return LAB3D_SCENE_REGISTRY[model];
}

export function resolveSceneDescriptor(
  value: string | null | undefined,
): Lab3DSceneDescriptor | undefined {
  return isLab3DModel(value) ? getSceneDescriptor(value) : undefined;
}
