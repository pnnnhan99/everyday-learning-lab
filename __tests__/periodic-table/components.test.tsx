import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import PeriodicElementDetails from '@/components/periodic-table/PeriodicElementDetails';
import PeriodicTableGrid from '@/components/periodic-table/PeriodicTableGrid';
import PeriodicTableView from '@/components/periodic-table/PeriodicTableView';
import { periodicElements, getPeriodicElementBySymbol } from '@/data/periodic-table/elements';
import { getDictionary } from '@/i18n/dict';

const i18n = vi.hoisted(() => ({ locale: 'en' as 'vi' | 'en' }));

vi.mock('@/i18n/useDictionary', async () => {
  const { getDictionary: get } = await import('@/i18n/dict');
  return {
    useLocale: () => i18n.locale,
    useDictionary: () => get(i18n.locale),
  };
});

const allMatching = new Set(periodicElements.map((element) => element.atomicNumber));

describe('PeriodicTableView', () => {
  it('renders the full English table, filters, legend and no modal before selection', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(<PeriodicTableView />);

    expect(html).toContain('Interactive periodic table');
    expect(html).toContain('Search the periodic table');
    expect(html).toContain('All categories');
    expect(html).toContain('All groups');
    expect(html).toContain('All periods');
    expect(html).toContain('Clear all filters');
    expect(html).toContain('Element categories');
    expect(html).toContain('Lanthanides');
    expect(html).toContain('Actinides');
    expect(html).not.toContain('aria-modal="true"');
    expect(html).toContain('118 / 118 elements');

    // First and last elements prove that the whole dataset is rendered.
    expect(html).toContain('Hydrogen');
    expect(html).toContain('Oganesson');
    expect(html).toContain('data-atomic-number="1"');
    expect(html).toContain('data-atomic-number="118"');
  });

  it('renders complete Vietnamese chrome and element names', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(<PeriodicTableView />);

    expect(html).toContain('Bảng tuần hoàn tương tác');
    expect(html).toContain('Tìm trong bảng tuần hoàn');
    expect(html).toContain('Tất cả nhóm');
    expect(html).toContain('Tất cả chu kỳ');
    expect(html).toContain('Xóa tất cả bộ lọc');
    expect(html).toContain('Phân loại nguyên tố');
    expect(html).toContain('Lanthanit');
    expect(html).toContain('Actinit');
    expect(html).not.toContain('aria-modal="true"');
    expect(html).toContain('Hydro');
    expect(html).toContain('Oganesson');
  });

  it('preserves the 18-column structure inside a horizontal scroll container', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(<PeriodicTableView />);
    expect(html).toContain('overflow-x-auto');
    expect(html).toContain('min-w-[1140px]');
    expect(html).toContain('repeat(18, minmax(0, 1fr))');
  });
});

describe('PeriodicTableGrid', () => {
  it('renders accessible labels, selected state and a single roving tab stop', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(
      <PeriodicTableGrid
        elements={periodicElements}
        locale="en"
        dictionary={getDictionary('en')}
        selectedAtomicNumber={26}
        matchingAtomicNumbers={allMatching}
        onSelect={() => undefined}
      />,
    );

    expect(html).toContain(
      'aria-label="Iron (Fe), Atomic number 26, Transition metal, Period 4, Group 8, d-block"',
    );
    expect(html).toContain('aria-pressed="true"');
    expect((html.match(/tabindex="0"/g) ?? []).length).toBe(1);
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('periodic-table-keyboard-hint');
  });

  it('localizes category names in aria labels', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(
      <PeriodicTableGrid
        elements={periodicElements}
        locale="vi"
        dictionary={getDictionary('vi')}
        selectedAtomicNumber={null}
        matchingAtomicNumbers={allMatching}
        onSelect={() => undefined}
      />,
    );

    expect(html).toContain('Sắt (Fe), Số hiệu nguyên tử 26, Kim loại chuyển tiếp');
    expect(html).toContain('Hydro (H), Số hiệu nguyên tử 1, Phi kim');
  });
});

describe('PeriodicElementDetails', () => {
  it('renders no markup when no element is selected', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(
      <PeriodicElementDetails
        element={null}
        locale="en"
        dictionary={getDictionary('en')}
        onClose={() => undefined}
      />,
    );

    expect(html).toBe('');
  });

  it('renders an accessible modal dialog with English identity, structure, properties, discovery and references', () => {
    i18n.locale = 'en';
    const html = renderToStaticMarkup(
      <PeriodicElementDetails
        element={getPeriodicElementBySymbol('Fe')!}
        locale="en"
        dictionary={getDictionary('en')}
        onClose={() => undefined}
      />,
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-labelledby="periodic-details-heading"');
    expect(html).toContain('aria-label="Close details"');
    expect(html).toContain('Iron');
    expect(html).toContain('Sắt');
    expect(html).toContain('Atomic structure');
    expect(html).toContain('Electron configuration');
    expect(html).toContain('[Ar] 3d⁶ 4s²');
    expect(html).toContain('1,811 K (1,537.85 °C)');
    expect(html).toContain('Oxidation states');
    expect(html).toContain('Natural occurrence');
    expect(html).toContain('Applications in everyday life');
    expect(html).toContain('Discovery');
    expect(html).toContain('Scientific references');
    expect(html).toContain('https://iupac.org/what-we-do/periodic-table-of-elements/');
    expect(html).toContain('Scientific review in progress');
    expect(html).toContain('Educational reference only');
  });

  it('renders Vietnamese labels, translated content and data-quality labels', () => {
    i18n.locale = 'vi';
    const html = renderToStaticMarkup(
      <PeriodicElementDetails
        element={getPeriodicElementBySymbol('Tc')!}
        locale="vi"
        dictionary={getDictionary('vi')}
        onClose={() => undefined}
      />,
    );

    expect(html).toContain('Tecnexi');
    expect(html).toContain('Cấu trúc nguyên tử');
    expect(html).toContain('Cấu hình electron');
    expect(html).toContain('Tính chất vật lý');
    expect(html).toContain('Tính chất hóa học');
    expect(html).toContain('Sự tồn tại trong tự nhiên');
    expect(html).toContain('Ứng dụng trong đời sống');
    expect(html).toContain('Lịch sử phát hiện');
    expect(html).toContain('Tài liệu tham khảo khoa học');
    expect(html).toContain('phụ thuộc đồng vị');
    expect(html).toContain('Không có đồng vị ổn định');
  });
});
