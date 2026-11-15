import ReactionsView from '@/components/reactions/ReactionsView';
import { listElements, listReactions } from '@/lib/db';
import type { EffectType } from '@/types/game';

const PAGE_SIZE = 10;
const EFFECT_FILTERS: Array<'all' | EffectType> = ['all', 'toxic', 'informational'];

interface ReactionsSearchParams {
  q?: string;
  effect?: string;
  page?: string;
}

export default async function ReactionsPage({
  searchParams,
}: {
  searchParams: Promise<ReactionsSearchParams>;
}) {
  const { q = '', effect = 'all', page = '1' } = await searchParams;
  const query = q.trim().toLowerCase();
  const activeEffect = (EFFECT_FILTERS as string[]).includes(effect)
    ? (effect as 'all' | EffectType)
    : 'all';

  const [reactions, elements] = await Promise.all([listReactions(), listElements()]);
  const elementNames = elements.flatMap((el) => [el.name, el.vi?.name ?? '']);

  const filtered = reactions.filter((r) => {
    const haystack = [
      r.element1Id,
      r.element2Id,
      ...elementNames,
      r.resultTitle,
      r.observation,
      r.explanation,
      r.vi?.resultTitle ?? '',
      r.vi?.observation ?? '',
      r.vi?.explanation ?? '',
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = query === '' || haystack.includes(query);
    const matchesEffect = activeEffect === 'all' || r.effectType === activeEffect;
    return matchesQuery && matchesEffect;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = query !== '' || activeEffect !== 'all';

  return (
    <ReactionsView
      q={q}
      activeEffect={activeEffect}
      visible={visible}
      filteredCount={filtered.length}
      currentPage={currentPage}
      totalPages={totalPages}
      hasFilters={hasFilters}
      elements={elements}
    />
  );
}
