import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { globalRegistry, registerAllSimulations } from '@/simulations';

registerAllSimulations();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ simulationId: string }>;
}): Promise<Metadata> {
  const { simulationId } = await params;
  const metadata = globalRegistry.get(simulationId)?.metadata;
  if (!metadata) return { title: 'Simulation not found' };
  return {
    title: metadata.name,
    description: metadata.description,
    alternates: { canonical: `/lab/${simulationId}` },
  };
}

export default function SimulationLayout({ children }: { children: ReactNode }) {
  return children;
}
