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
  {
    id: 'vinegar',
    name: 'Vinegar',
    icon: 'flask',
    description: 'Dilute acetic acid.',
    type: 'acid',
    ph: 2.4,
    safetyLevel: 2,
    vi: { name: 'Giấm', description: 'Axit axetic loãng.' },
  },
  {
    id: 'bleach',
    name: 'Bleach',
    icon: 'flask',
    description: 'Sodium hypochlorite solution.',
    type: 'chemical',
  },
];

const reactions: Reaction[] = [
  {
    element1Id: 'vinegar',
    element2Id: 'bleach',
    resultTitle: 'Fizzing',
    observation: 'Bubbles form.',
    explanation: 'An acid reacts with a carbonate.',
    effectType: 'informational',
    reviewStatus: 'reviewed',
    assumptions: ['Simplified model.'],
    safetyGuidance: 'Do not mix cleaners.',
    references: [{ title: 'Source', publisher: 'Publisher', url: 'https://example.com' }],
    vi: {
      resultTitle: 'Sủi bọt',
      observation: 'Bọt khí hình thành.',
      explanation: 'Axit phản ứng với cacbonat.',
      assumptions: ['Mô hình lược giản.'],
      safetyGuidance: 'Không trộn chất tẩy rửa.',
    },
  },
];

describe('ElementsView', () => {
  it('renders English catalogue chrome', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(
      <ElementsView q="" activeType="all" visible={elements} filteredCount={2} currentPage={1} totalPages={1} hasFilters={false} />,
    );

    expect(html).toContain('All types');
    expect(html).toContain('Search');
    expect(html).toContain('Safety 2/5');
    expect(html).toContain('Save');
    expect(html).toContain('Vinegar');
    expect(html).toContain('Dilute acetic acid.');
  });

  it('renders Vietnamese catalogue chrome, type labels, and translated content', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(
      <ElementsView q="" activeType="acid" visible={elements} filteredCount={2} currentPage={1} totalPages={1} hasFilters />,
    );

    expect(html).toContain('Tất cả loại');
    expect(html).toContain('Tìm kiếm');
    expect(html).toContain('Axit');
    expect(html).toContain('Lưu');
    expect(html).toContain('An toàn 2/5');
    expect(html).toContain('Giấm');
    expect(html).toContain('Axit axetic loãng.');
    // Records without a Vietnamese edition fall back to English instead of blank fields.
    expect(html).toContain('Bleach');
    expect(html).toContain('Sodium hypochlorite solution.');
  });
});

describe('ReactionsView', () => {
  it('renders English reaction chrome and content', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(
      <ReactionsView q="" activeEffect="all" visible={reactions} filteredCount={1} currentPage={1} totalPages={1} hasFilters={false} elements={elements} />,
    );

    expect(html).toContain('All reactions');
    expect(html).toContain('Why it happens, safety and sources');
    expect(html).toContain('Review status');
    expect(html).toContain('Fizzing');
    expect(html).toContain('Bubbles form.');
  });

  it('renders Vietnamese reaction chrome and translated content', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(
      <ReactionsView q="" activeEffect="toxic" visible={reactions} filteredCount={1} currentPage={1} totalPages={1} hasFilters elements={elements} />,
    );

    expect(html).toContain('Tất cả phản ứng');
    expect(html).toContain('Nguy hiểm');
    expect(html).toContain('Vì sao xảy ra, an toàn và nguồn');
    expect(html).toContain('Trạng thái thẩm định');
    expect(html).toContain('Sủi bọt');
    expect(html).toContain('Bọt khí hình thành.');
    expect(html).toContain('Giấm');
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
