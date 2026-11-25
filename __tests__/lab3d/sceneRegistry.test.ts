import { describe, expect, it } from 'vitest';

import {
  getSceneDescriptor,
  LAB3D_SCENE_IDS,
  LAB3D_SCENE_REGISTRY,
  resolveSceneDescriptor,
} from '@/components/lab3d/sceneRegistry';
import { LAB3D_MODEL_IDS } from '@/learning/lab3d';

describe('lab 3D scene registry', () => {
  it('registers exactly one scene component for every shared model id', () => {
    expect([...LAB3D_SCENE_IDS].sort()).toEqual([...LAB3D_MODEL_IDS].sort());

    for (const id of LAB3D_MODEL_IDS) {
      const descriptor = getSceneDescriptor(id);
      expect(descriptor.id).toBe(id);
      expect(descriptor.component).toBeTypeOf('function');
      expect(LAB3D_SCENE_REGISTRY[id]).toBe(descriptor);
    }
  });

  it('resolves only supported model values', () => {
    expect(resolveSceneDescriptor('projectile')?.id).toBe('projectile');
    expect(resolveSceneDescriptor('water')?.id).toBe('water');
    expect(resolveSceneDescriptor('plant-cell')?.id).toBe('plant-cell');
    expect(resolveSceneDescriptor('unknown')).toBeUndefined();
    expect(resolveSceneDescriptor(null)).toBeUndefined();
    expect(resolveSceneDescriptor(undefined)).toBeUndefined();
  });
});
