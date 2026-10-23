import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LessonDetail } from '@/components/lesson-detail/LessonDetail';
import { physicsProjectileLesson } from '@/learning/examples/physics-projectile';

describe('LessonDetail', () => {
  it('renders the lesson journey, review status, simulation, self-check, and reflection', () => {
    const html = renderToStaticMarkup(<LessonDetail lesson={physicsProjectileLesson} />);

    expect(html).toContain('Projectile Motion: Range, Height, and Flight Time');
    expect(html).toContain('Not yet scientifically reviewed');
    expect(html).toContain('/lab/3d?model=projectile');
    expect(html).toContain('Run simulation');
    expect(html).toContain('Self-check');
    expect(html).toContain('Apply &amp; Reflect');
    expect(html).toContain('Model assumptions &amp; references');
  });
});
