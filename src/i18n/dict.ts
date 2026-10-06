export type Locale = 'vi' | 'en';

const dict = {
  language: { vi: 'Ngôn ngữ', en: 'Language' },
  lab: { vi: 'Phòng thí nghiệm', en: 'Laboratory' },
  elements: { vi: 'Nguyên tố', en: 'Elements' },
  reactions: { vi: 'Phản ứng', en: 'Reactions' },
  admin: { vi: 'Quản trị', en: 'Admin' },
  profile: { vi: 'Hồ sơ', en: 'Profile' },
} as const;

type Key = keyof typeof dict;

export function t(locale: Locale, key: Key): string {
  return dict[key][locale] ?? dict[key].en;
}
