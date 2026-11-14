import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import Home from '../../../app/page';
import DomainCard from '@/components/learning/DomainCard';
import { learningDomains } from '@/learning/catalog';
import { getDictionary } from '@/i18n/dict';

// renderToStaticMarkup uses the store's initial server snapshot, so drive the
// locale through a controllable hook instead of mutating the store.
const i18n = vi.hoisted(() => ({ locale: 'vi' as 'vi' | 'en' }));

vi.mock('@/i18n/useDictionary', async () => {
  const { getDictionary: get } = await import('@/i18n/dict');
  return {
    useLocale: () => i18n.locale,
    useDictionary: () => get(i18n.locale),
  };
});

describe('Home discover page', () => {
  beforeEach(() => {
    i18n.locale = 'en';
  });

  it('introduces the learning loop and the two primary entry points', () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('Understand the science behind everyday life');
    expect(html).toContain('href="/explore"');
    expect(html).toContain('href="/lab/chemistry"');
    expect(html).toContain('Discover');
    expect(html).toContain('Reflect');
  });

  it('shows every learning domain', () => {
    const html = renderToStaticMarkup(<Home />);
    const dictionary = getDictionary('en');

    for (const domain of learningDomains) {
      expect(html).toContain(domain.label.replace(/&/g, '&amp;'));
      expect(html).toContain(dictionary.domainSummaries[domain.key]);
    }
  });

  it('links to the 3D models and the featured challenge', () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('href="/lab/3d?model=water"');
    expect(html).toContain('href="/lab/3d?model=projectile"');
    expect(html).toContain('href="/lab/3d?model=plant-cell"');
    expect(html).toContain('href="/challenges/challenge-greenhouse-carbon"');
  });

  it('renders the Vietnamese edition', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain('Hiểu khoa học quanh em');
    expect(html).toContain('Vòng lặp học tập');
    expect(html).toContain('Khám phá');
    expect(html).toContain('Suy ngẫm');
    expect(html).not.toContain('Understand the science behind everyday life');
  });
});

describe('DomainCard', () => {
  beforeEach(() => {
    i18n.locale = 'en';
  });

  it('renders a lesson journey with review status and its 3D model', () => {
    const chemistry = learningDomains.find((domain) => domain.key === 'chemistry');
    const html = renderToStaticMarkup(<DomainCard domain={chemistry!} />);

    expect(html).toContain('Chemistry');
    expect(html).toContain('Understanding Acids and Bases');
    expect(html).toContain('Not yet scientifically reviewed');
    expect(html).toContain('href="/learn/chem-acids-bases-101"');
    expect(html).toContain('href="/lab/3d?model=water"');
  });

  it('renders the interdisciplinary challenge entry', () => {
    const realworld = learningDomains.find((domain) => domain.key === 'realworld');
    const html = renderToStaticMarkup(<DomainCard domain={realworld!} />);

    expect(html).toContain('Real-world Challenges');
    expect(html).toContain('Open challenge');
    expect(html).toContain('href="/challenges/challenge-greenhouse-carbon"');
  });

  it('renders localized Vietnamese labels, titles and review status', () => {
    i18n.locale = 'vi';
    const chemistry = learningDomains.find((domain) => domain.key === 'chemistry');
    const html = renderToStaticMarkup(<DomainCard domain={chemistry!} />);

    expect(html).toContain('Hóa học');
    expect(html).toContain('Hiểu về axit và bazơ');
    expect(html).toContain('Chưa được thẩm định khoa học');
    expect(html).toContain('Bắt đầu bài học');
  });
});
