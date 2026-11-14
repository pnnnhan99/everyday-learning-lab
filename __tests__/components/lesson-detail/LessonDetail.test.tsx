import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LessonDetail } from '@/components/lesson-detail/LessonDetail';
import { physicsProjectileLesson } from '@/learning/examples/physics-projectile';

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

describe('LessonDetail', () => {
  it('renders the lesson journey, review status, simulation, self-check, and reflection', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(<LessonDetail lesson={physicsProjectileLesson} />);

    expect(html).toContain('Projectile Motion: Range, Height, and Flight Time');
    expect(html).toContain('Not yet scientifically reviewed');
    expect(html).toContain('/lab/3d?model=projectile');
    expect(html).toContain('Run simulation');
    expect(html).toContain('Self-check');
    expect(html).toContain('Apply &amp; Reflect');
    expect(html).toContain('Model assumptions &amp; references');
  });

  it('renders the Vietnamese lesson when the locale is vi', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(<LessonDetail lesson={physicsProjectileLesson} />);

    expect(html).toContain('Chuyển động ném xiên: tầm xa, độ cao và thời gian bay');
    expect(html).toContain('Chưa được thẩm định khoa học');
    expect(html).toContain('Chạy mô phỏng');
    expect(html).toContain('Tự kiểm tra');
    expect(html).toContain('Áp dụng &amp; Suy ngẫm');
  });
});
