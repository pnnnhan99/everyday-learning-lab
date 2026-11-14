import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import ElementsView from '@/components/elements/ElementsView';
import ReactionsView from '@/components/reactions/ReactionsView';
import ProfileView from '@/components/profile/ProfileView';
import type { Element, Reaction } from '@/types/game';

// renderToStaticMarkup uses the store's initial server snapshot, so drive the
// locale through a controllable hook instead of mutating the store.
const i18n = vi.hoisted(() => ({ locale: 'en' as 'vi' | 'en' }));

vi.mock('@/i18n/useDictionary', async () => {
  const { getDictionary: get } = await import('@/i18n/dict');
  return {
    useLocale: () => i18n.locale,
    useDictionary: () => get(i18n.locale),
  };
});

const elements: Element[] = [
  { id: 'vinegar', name: 'Vinegar', icon: 'flask', description: 'Dilute acetic acid.', type: 'acid', ph: 2.4, safetyLevel: 2 },
];

const reactions: Reaction[] = [
  {
    element1Id: 'vinegar',
    element2Id: 'baking-soda',
    resultTitle: 'Fizzing',
    observation: 'Bubbles form.',
    explanation: 'An acid reacts with a carbonate.',
    effectType: 'informational',
    reviewStatus: 'reviewed',
    assumptions: ['Simplified model.'],
    safetyGuidance: 'Do not mix cleaners.',
    references: [{ title: 'Source', publisher: 'Publisher', url: 'https://example.com' }],
  },
];

describe('ElementsView', () => {
  it('renders English catalogue chrome', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(
      <ElementsView q="" activeType="all" visible={elements} filteredCount={1} currentPage={1} totalPages={1} hasFilters={false} />,
    );

    expect(html).toContain('All types');
    expect(html).toContain('Search');
    expect(html).toContain('Safety 2/5');
    expect(html).toContain('Save');
  });

  it('renders Vietnamese catalogue chrome and type labels', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(
      <ElementsView q="" activeType="acid" visible={elements} filteredCount={1} currentPage={1} totalPages={1} hasFilters />,
    );

    expect(html).toContain('Tất cả loại');
    expect(html).toContain('Tìm kiếm');
    expect(html).toContain('Axit');
    expect(html).toContain('Lưu');
    expect(html).toContain('An toàn 2/5');
  });
});

describe('ReactionsView', () => {
  it('renders English reaction chrome', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(
      <ReactionsView q="" activeEffect="all" visible={reactions} filteredCount={1} currentPage={1} totalPages={1} hasFilters={false} names={{ vinegar: 'Vinegar' }} />,
    );

    expect(html).toContain('All reactions');
    expect(html).toContain('Why it happens, safety and sources');
    expect(html).toContain('Review status');
  });

  it('renders Vietnamese reaction chrome', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(
      <ReactionsView q="" activeEffect="toxic" visible={reactions} filteredCount={1} currentPage={1} totalPages={1} hasFilters names={{ vinegar: 'Vinegar' }} />,
    );

    expect(html).toContain('Tất cả phản ứng');
    expect(html).toContain('Nguy hiểm');
    expect(html).toContain('Vì sao xảy ra, an toàn và nguồn');
    expect(html).toContain('Trạng thái thẩm định');
  });
});

describe('ProfileView', () => {
  beforeEach(() => {
    i18n.locale = 'en';
  });

  it('renders English profile chrome and empty states', () => {
    const html = renderToStaticMarkup(<ProfileView elements={elements} />);

    expect(html).toContain('Local progress');
    expect(html).toContain('Undo last mix');
    expect(html).toContain('No favorites yet');
    expect(html).toContain('No mixes recorded yet');
    expect(html).toContain('Back to lab');
  });

  it('renders Vietnamese profile chrome', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(<ProfileView elements={elements} />);

    expect(html).toContain('Tiến độ cục bộ');
    expect(html).toContain('Hoàn tác lần trộn cuối');
    expect(html).toContain('Chưa có mục yêu thích');
    expect(html).toContain('Chưa ghi nhận lần trộn nào');
    expect(html).toContain('Quay lại phòng lab');
  });
});
