'use client';

import { useUiStore } from '@/store/uiStore';
import { getDictionary, type Dictionary, type Locale } from './dict';

export function useLocale(): Locale {
  return useUiStore((state) => state.locale);
}

export function useDictionary(): Dictionary {
  return getDictionary(useLocale());
}
