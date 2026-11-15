import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChallengeDetail } from '@/components/challenge-detail/ChallengeDetail';
import { greenhouseCarbonChallenge } from '@/learning/examples/challenge-greenhouse-carbon';
import { greenhouseCarbonChallengeVi } from '@/learning/examples/vi';
import { getLocalizedLesson } from '@/learning/catalog';

const i18n = vi.hoisted(() => ({ locale: 'en' as 'vi' | 'en' }));

vi.mock('@/i18n/useDictionary', async () => {
  const { getDictionary: get } = await import('@/i18n/dict');
  return {
    useLocale: () => i18n.locale,
    useDictionary: () => get(i18n.locale),
  };
});

describe('ChallengeDetail', () => {
  it('renders editable inputs for every linked simulation instead of defaults only', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(<ChallengeDetail challenge={greenhouseCarbonChallenge} />);

    // Photosynthesis model inputs.
    expect(html).toContain('Sunlight');
    expect(html).toContain('Leaf Area');
    // Acid-base model inputs.
    expect(html).toContain('Base Amount');
    expect(html).toContain('Acid Amount');
    // One run button per linked model.
    expect((html.match(/type="number"/g) ?? []).length).toBe(6);
  });

  it('shows human-readable lesson titles instead of raw slugs', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(<ChallengeDetail challenge={greenhouseCarbonChallenge} />);

    for (const slug of greenhouseCarbonChallenge.relatedLessonIds) {
      const title = getLocalizedLesson(slug, 'en')?.title;
      expect(title).toBeDefined();
      expect(html).toContain(title!);
      expect(html).not.toContain(`>${slug}<`);
    }
  });

  it('localizes related lesson titles for Vietnamese learners', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(<ChallengeDetail challenge={greenhouseCarbonChallengeVi} />);

    for (const slug of greenhouseCarbonChallengeVi.relatedLessonIds) {
      const title = getLocalizedLesson(slug, 'vi')?.title;
      expect(title).toBeDefined();
      expect(html).toContain(title!);
    }
  });
});
