import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import Home from '../../../app/page';
import DomainCard from '@/components/learning/DomainCard';
import { learningDomains } from '@/learning/catalog';

describe('Home discover page', () => {
  const html = renderToStaticMarkup(<Home />);

  it('introduces the learning loop and the two primary entry points', () => {
    expect(html).toContain('Understand the science behind everyday life');
    expect(html).toContain('href="/explore"');
    expect(html).toContain('href="/lab/chemistry"');
    expect(html).toContain('Discover');
    expect(html).toContain('Reflect');
  });

  it('shows every learning domain', () => {
    for (const domain of learningDomains) {
      const escapedLabel = domain.label.replace(/&/g, '&amp;');
      expect(html).toContain(escapedLabel);
      expect(html).toContain(domain.summary);
    }
  });

  it('links to the 3D models and the featured challenge', () => {
    expect(html).toContain('href="/lab/3d?model=water"');
    expect(html).toContain('href="/lab/3d?model=projectile"');
    expect(html).toContain('href="/lab/3d?model=plant-cell"');
    expect(html).toContain('href="/challenges/challenge-greenhouse-carbon"');
  });
});

describe('DomainCard', () => {
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
});
