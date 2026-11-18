'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUiStore } from '@/store/uiStore';
import { useLabStore } from '@/store/labStore';
import { getDictionary, type Dictionary } from '@/i18n/dict';

type PageMeta = { title: string; subtitle: string };

function pageMetadata(dictionary: Dictionary, pathname: string): PageMeta {
  const { pages } = dictionary;

  if (pathname === '/') return pages.home;
  if (pathname === '/explore') return pages.explore;
  if (pathname === '/challenges') return pages.challenges;
  if (pathname === '/lab') return pages.lab;
  if (pathname === '/lab/chemistry') return pages.labChemistry;
  if (pathname === '/lab/3d') return pages.lab3d;
  if (pathname === '/chemistry/periodic-table') return pages.periodicTable;
  if (pathname === '/elements') return pages.elements;
  if (pathname === '/reactions') return pages.reactions;
  if (pathname === '/admin') return pages.admin;
  if (pathname === '/profile') return pages.profile;
  if (pathname.startsWith('/learn/')) return pages.lesson;
  if (pathname.startsWith('/challenges/')) return pages.challenge;
  if (pathname.startsWith('/lab/')) return pages.lab;
  return { title: 'Everyday Learning Lab', subtitle: '' };
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const hydrate = useUiStore((s) => s.hydrate);
  const hydrateLab = useLabStore((s) => s.hydrate);
  const locale = useUiStore((s) => s.locale);
  const dictionary = getDictionary(locale);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { hydrateLab(); }, [hydrateLab]);
  useEffect(() => { closeSidebar(); }, [pathname, closeSidebar]);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  const meta = pageMetadata(dictionary, pathname);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {dictionary.app.skipToContent}
      </a>
      <Sidebar />
      {sidebarOpen && (
        <button
          aria-label={dictionary.app.closeMenu}
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">{children}</main>
        <footer className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800">
          {dictionary.app.footer}
        </footer>
      </div>
    </div>
  );
}
