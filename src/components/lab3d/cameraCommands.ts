import type { CameraCommandInput } from './sceneTypes';

export const CAMERA_ROTATE_STEP = Math.PI / 12;
export const CAMERA_ZOOM_STEP = 1.15;

// The subset of OrbitControls used by the non-drag camera buttons. Keeping it
// structural lets the button behavior be tested without a WebGL canvas.
export type CameraControlsLike = {
  reset(): void;
  getAzimuthalAngle(): number;
  setAzimuthalAngle(value: number): void;
  dollyIn(scale?: number): void;
  dollyOut(scale?: number): void;
  update(): void;
};

export function applyCameraCommand(
  controls: CameraControlsLike,
  command: CameraCommandInput,
): void {
  if (command.kind === 'reset') {
    controls.reset();
  } else if (command.kind === 'rotate') {
    controls.setAzimuthalAngle(
      controls.getAzimuthalAngle() + command.direction * CAMERA_ROTATE_STEP,
    );
  } else if (command.direction > 0) {
    controls.dollyIn(CAMERA_ZOOM_STEP);
  } else {
    controls.dollyOut(CAMERA_ZOOM_STEP);
  }
  controls.update();
}
