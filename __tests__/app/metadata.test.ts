import { afterEach, describe, expect, it, vi } from 'vitest';

import manifest from '../../app/manifest';
import sitemap from '../../app/sitemap';
import { generateMetadata as lessonMetadata } from '../../app/learn/[slug]/page';
import { generateMetadata as challengeMetadata } from '../../app/challenges/[id]/page';
import { generateMetadata as simulationMetadata } from '../../app/lab/[simulationId]/layout';
import { metadata as challengesLayoutMetadata } from '../../app/challenges/layout';
import { metadata as labLayoutMetadata } from '../../app/lab/layout';
import { getSiteUrl, SITE_NAME } from '@/lib/site';
import { getLocalizedChallenge } from '@/learning/catalog';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('site metadata configuration', () => {
  it('uses a configured public origin without a trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://lab.example.org/');
    expect(getSiteUrl()).toBe('https://lab.example.org');
  });

  it('normalizes a configured URL that includes a path', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://lab.example.org/some/path');
    expect(getSiteUrl()).toBe('https://lab.example.org');
  });

  it('falls back to the documented placeholder for invalid configuration', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'not a url');
    expect(getSiteUrl()).toBe('https://everyday-learning-lab.example');
  });

  it('falls back when no origin is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    expect(getSiteUrl()).toBe('https://everyday-learning-lab.example');
  });

  it('re-applies the brand suffix in intermediate layouts for client route trees', () => {
    const template = `%s · ${SITE_NAME}`;
    expect(challengesLayoutMetadata.title).toMatchObject({ template });
    expect(labLayoutMetadata.title).toMatchObject({ template });
  });
});

describe('web manifest', () => {
  it('describes the learning product rather than only the chemistry prototype', () => {
    const webManifest = manifest();
    expect(webManifest.name).toBe(SITE_NAME);
    expect(webManifest.description).toContain('mô phỏng');
    expect(webManifest.lang).toBe('vi');
    expect(webManifest.icons?.[0]?.src).toBe('/favicon.ico');
  });
});

describe('sitemap', () => {
  it('uses the configured origin and lists lessons, challenges, and simulations', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://lab.example.org');
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls.every((url) => url.startsWith('https://lab.example.org/'))).toBe(true);
    expect(urls).toContain('https://lab.example.org/learn/phys-projectile-101');
    expect(urls).toContain('https://lab.example.org/challenges/challenge-greenhouse-carbon');
    expect(urls).toContain('https://lab.example.org/lab/physics.projectile');
    expect(urls).not.toContain('https://lab.example.org/admin');
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe('dynamic route metadata', () => {
  it('uses the Vietnamese lesson title and a canonical path for the default locale', async () => {
    const metadata = await lessonMetadata({ params: Promise.resolve({ slug: 'phys-projectile-101' }) });
    expect(metadata.title).toBe('Chuyển động ném xiên: tầm xa, độ cao và thời gian bay');
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toBe('/learn/phys-projectile-101');
  });

  it('gives unknown lessons a not-found title', async () => {
    const metadata = await lessonMetadata({ params: Promise.resolve({ slug: 'missing' }) });
    expect(metadata.title).toBe('Lesson not found');
  });

  it('uses the Vietnamese challenge title and a canonical path', async () => {
    const metadata = await challengeMetadata({
      params: Promise.resolve({ id: 'challenge-greenhouse-carbon' }),
    });
    expect(metadata.title).toBe(
      getLocalizedChallenge('challenge-greenhouse-carbon', 'vi')?.title,
    );
    expect(metadata.alternates?.canonical).toBe('/challenges/challenge-greenhouse-carbon');
  });

  it('gives unknown challenges a not-found title', async () => {
    const metadata = await challengeMetadata({ params: Promise.resolve({ id: 'missing' }) });
    expect(metadata.title).toBe('Challenge not found');
  });

  it('uses simulation metadata for the lab runner title', async () => {
    const metadata = await simulationMetadata({ params: Promise.resolve({ simulationId: 'physics.projectile' }) });
    expect(metadata.title).toBe('Projectile Motion');
    expect(metadata.description).toContain('projectile');
    expect(metadata.alternates?.canonical).toBe('/lab/physics.projectile');
  });

  it('gives unknown simulations a not-found title', async () => {
    const metadata = await simulationMetadata({ params: Promise.resolve({ simulationId: 'missing' }) });
    expect(metadata.title).toBe('Simulation not found');
  });
});
