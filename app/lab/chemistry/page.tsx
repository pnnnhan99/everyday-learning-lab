import type { Metadata } from 'next';

import Laboratory from '@/components/laboratory/Laboratory';

export const metadata: Metadata = {
  title: 'Chemistry lab',
  description: 'Mix everyday chemicals safely in a virtual lab that discloses assumptions, warnings, and sources.',
};

export default function ChemistryLabPage() {
  return (
    <div className="lab-shell flex flex-1 flex-col text-white">
      <Laboratory />
    </div>
  );
}
