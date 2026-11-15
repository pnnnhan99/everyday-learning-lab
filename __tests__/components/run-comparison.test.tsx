import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { RunComparisonTable } from '@/components/lab/RunComparison';
import type { SavedRun } from '@/lib/simRuns';

const i18n = vi.hoisted(() => ({ locale: 'en' as 'vi' | 'en' }));

vi.mock('@/i18n/useDictionary', async () => {
  const { getDictionary: get } = await import('@/i18n/dict');
  return {
    useLocale: () => i18n.locale,
    useDictionary: () => get(i18n.locale),
  };
});

const runs: SavedRun[] = [
  {
    id: 'newer',
    at: 1_700_000_200_000,
    inputs: [
      { key: 'initialSpeed', value: 20, unit: 'm/s' },
      { key: 'launchAngle', value: 45, unit: '°' },
    ],
    scalars: [
      { key: 'range', value: 40.8, unit: 'm' },
      { key: 'maxHeight', value: 10.2, unit: 'm' },
    ],
  },
  {
    id: 'older',
    at: 1_700_000_000_000,
    inputs: [
      { key: 'initialSpeed', value: 15, unit: 'm/s' },
      { key: 'launchAngle', value: 30, unit: '°' },
    ],
    scalars: [{ key: 'range', value: 19.9, unit: 'm' }],
  },
];

describe('RunComparisonTable', () => {
  it('renders inputs and outputs for every saved run with units', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(<RunComparisonTable runs={runs} onRemove={() => {}} />);

    expect(html).toContain('Compare saved runs');
    expect(html).toContain('Run 2');
    expect(html).toContain('Run 1');
    expect(html).toContain('Initial Speed');
    expect(html).toContain('(m/s)');
    expect(html).toContain('Max Height');
    expect(html).toContain('40.8');
    expect(html).toContain('19.9');
    expect(html).toContain('Remove');
  });

  it('shows a dash for values a run does not report', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(<RunComparisonTable runs={runs} />);

    // The older run has no maxHeight output, so its cell is the missing marker.
    expect(html).toContain('—');
    expect(html).not.toContain('Remove');
  });

  it('renders Vietnamese labels', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(<RunComparisonTable runs={runs} />);

    expect(html).toContain('So sánh các lần chạy đã lưu');
    expect(html).toContain('Lần chạy 2');
    expect(html).toContain('Đầu vào');
    expect(html).toContain('Kết quả');
  });

  it('renders nothing when there are no runs', () => {
    const html = renderToStaticMarkup(<RunComparisonTable runs={[]} />);
    expect(html).toBe('');
  });
});
