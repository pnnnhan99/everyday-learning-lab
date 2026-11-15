import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '3D lab',
  description: 'Explore interactive 3D models with the same assumptions and limitations shown alongside each simulation.',
};

export default function Lab3dLayout({ children }: { children: ReactNode }) {
  return children;
}
