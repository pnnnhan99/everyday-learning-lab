import type { Metadata } from 'next';

import ElementsView from '@/components/elements/ElementsView';
import { listElements } from '@/lib/db';
import type { ElementType } from '@/types/game';

export const metadata: Metadata = {
  title: 'Elements',
  description: 'Browse every reviewed substance in the catalog, with Vietnamese and English descriptions.',
};

const PAGE_SIZE = 12;
const TYPE_FILTERS: Array<'all' | ElementType> = ['all', 'acid', 'base', 'food', 'chemical'];

interface ElementsSearchParams {
  q?: string;
  type?: string;
  page?: string;
}

export default async function ElementsPage({
  searchParams,
}: {
  searchParams: Promise<ElementsSearchParams>;
}) {
  const { q = '', type = 'all', page = '1' } = await searchParams;
  const query = q.trim().toLowerCase();
  const activeType = (TYPE_FILTERS as string[]).includes(type) ? (type as 'all' | ElementType) : 'all';

  const elements = await listElements();
  const filtered = elements.filter((el) => {
    const matchesQuery =
      query === '' ||
      el.name.toLowerCase().includes(query) ||
      el.id.toLowerCase().includes(query) ||
      el.description.toLowerCase().includes(query) ||
      (el.vi?.name.toLowerCase().includes(query) ?? false) ||
      (el.vi?.description.toLowerCase().includes(query) ?? false);
    const matchesType = activeType === 'all' || el.type === activeType;
    return matchesQuery && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = query !== '' || activeType !== 'all';

  return (
    <ElementsView
      q={q}
      activeType={activeType}
      visible={visible}
      filteredCount={filtered.length}
      currentPage={currentPage}
      totalPages={totalPages}
      hasFilters={hasFilters}
    />
  );
}
