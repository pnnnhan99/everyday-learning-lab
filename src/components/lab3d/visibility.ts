'use client';

import { useSyncExternalStore } from 'react';

import type { Frameloop } from '@react-three/fiber';

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}

function getPageVisible() {
  return document.visibilityState === 'visible';
}

// Use the SSR-safe default of "visible"; the real value is read after hydration.
export function usePageVisible() {
  return useSyncExternalStore(subscribeVisibility, getPageVisible, () => true);
}

export function frameloopForVisibility(isVisible: boolean): Frameloop {
  return isVisible ? 'always' : 'never';
}
