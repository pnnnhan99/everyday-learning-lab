import { describe, expect, it, vi } from 'vitest';

import {
  applyCameraCommand,
  CAMERA_ROTATE_STEP,
  CAMERA_ZOOM_STEP,
  type CameraControlsLike,
} from '@/components/lab3d/cameraCommands';

function createControls() {
  const calls = {
    reset: vi.fn(),
    setAzimuthalAngle: vi.fn(),
    dollyIn: vi.fn(),
    dollyOut: vi.fn(),
    update: vi.fn(),
  };
  const controls: CameraControlsLike = {
    reset: calls.reset,
    getAzimuthalAngle: () => 0.5,
    setAzimuthalAngle: calls.setAzimuthalAngle,
    dollyIn: calls.dollyIn,
    dollyOut: calls.dollyOut,
    update: calls.update,
  };
  return { calls, controls };
}

describe('applyCameraCommand', () => {
  it('resets the camera and refreshes the controls', () => {
    const { calls, controls } = createControls();

    applyCameraCommand(controls, { kind: 'reset' });

    expect(calls.reset).toHaveBeenCalledOnce();
    expect(calls.update).toHaveBeenCalledOnce();
  });

  it('rotates left and right by a fixed step without changing distance', () => {
    const left = createControls();
    const right = createControls();

    applyCameraCommand(left.controls, { kind: 'rotate', direction: -1 });
    applyCameraCommand(right.controls, { kind: 'rotate', direction: 1 });

    expect(left.calls.setAzimuthalAngle).toHaveBeenCalledWith(0.5 - CAMERA_ROTATE_STEP);
    expect(right.calls.setAzimuthalAngle).toHaveBeenCalledWith(0.5 + CAMERA_ROTATE_STEP);
    expect(left.calls.dollyIn).not.toHaveBeenCalled();
    expect(left.calls.dollyOut).not.toHaveBeenCalled();
  });

  it('zooms in and out with a bounded step', () => {
    const inControls = createControls();
    const outControls = createControls();

    applyCameraCommand(inControls.controls, { kind: 'zoom', direction: 1 });
    applyCameraCommand(outControls.controls, { kind: 'zoom', direction: -1 });

    expect(inControls.calls.dollyIn).toHaveBeenCalledWith(CAMERA_ZOOM_STEP);
    expect(outControls.calls.dollyOut).toHaveBeenCalledWith(CAMERA_ZOOM_STEP);
    expect(inControls.calls.dollyOut).not.toHaveBeenCalled();
    expect(outControls.calls.dollyIn).not.toHaveBeenCalled();
    expect(inControls.calls.update).toHaveBeenCalledOnce();
  });
});
