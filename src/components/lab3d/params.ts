// Compatibility boundary for callers that import lab3d helpers from this
// module. The definitions live in the shared learning layer so the content
// catalog and the renderer agree on the supported model IDs.
export {
  LAB3D_MODEL_IDS,
  isLab3DModel,
  resolveInitialModel,
} from '@/learning/lab3d';
export type { Lab3DModel } from '@/learning/lab3d';
