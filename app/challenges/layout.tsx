import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    default: 'Real-world challenges',
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Interdisciplinary science tasks that combine concepts from more than one domain, with steps, evidence, and evaluation criteria.',
};

export default function ChallengesLayout({ children }: { children: ReactNode }) {
  return children;
}
