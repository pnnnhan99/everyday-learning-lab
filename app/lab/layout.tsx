import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    default: 'Simulations',
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Run educational models with declared inputs, valid ranges, units, assumptions, limitations, and references.',
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return children;
}
