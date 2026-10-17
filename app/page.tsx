import Laboratory from '@/components/laboratory/Laboratory';
import { Badge } from '@pnnnhan99/ui';
import { formatNumber } from '@pnnnhan99/utils';

export default function Home() {
  return (
    <div className="lab-shell flex flex-1 flex-col text-white">
      <span className="sr-only">
        <Badge variant="outline">Elements: {formatNumber(118)}</Badge>
      </span>
      <Laboratory />
    </div>
  );
}
