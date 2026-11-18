import type { Metadata } from 'next';

import PeriodicTableView from '@/components/periodic-table/PeriodicTableView';

export const metadata: Metadata = {
  title: 'Interactive Periodic Table — Everyday Learning Lab',
  description:
    'Explore all 118 chemical elements with search, category, group and period filters, and sourced element details in Vietnamese and English.',
};

export default function PeriodicTablePage() {
  return <PeriodicTableView />;
}
