'use client';

import React from 'react';

// Catches chunk-load / runtime errors from the lazily loaded 3D scene so a
// broken canvas never blanks the page. The explanatory panels below the canvas
// stay visible, so learning can continue without WebGL.
export class SceneErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center"
        >
          <p className="text-sm font-medium text-white/80">The 3D model could not be displayed.</p>
          <p className="max-w-md text-xs leading-5 text-white/60">
            The explanation, controls, and limitations below still work. Reloading the page may
            restore the 3D view.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-1 rounded border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Try loading the model again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default SceneErrorBoundary;
