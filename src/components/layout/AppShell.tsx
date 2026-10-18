'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUiStore } from '@/store/uiStore';

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Chemistry Lab', subtitle: 'Mix everyday chemicals safely in a virtual lab' },
  '/explore': { title: 'Explore', subtitle: 'Discover lessons across learning domains' },
  '/challenges': { title: 'Real-world Challenges', subtitle: 'Interdisciplinary science tasks' },
  '/lab/3d': { title: '3D Lab', subtitle: 'Visualization playground' },
  '/elements': { title: 'Elements', subtitle: 'Browse the catalog backed by /api/elements' },
  '/reactions': { title: 'Reactions', subtitle: 'All known pairs backed by /api/reactions' },
  '/admin': { title: 'Admin', subtitle: 'Create and delete elements and reactions' },
  '/profile': { title: 'Profile', subtitle: 'Local progress, favorites and history' },
};

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);
  const hydrate = useUiStore((s) => s.hydrate);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { closeSidebar(); }, [pathname, closeSidebar]);

  const meta = TITLES[pathname] ?? resolveMeta(pathname);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>
      <Sidebar />
      {sidebarOpen && (
        <button aria-label="Close menu" onClick={closeSidebar} className="fixed inset-0 z-30 bg-black/40 lg:hidden" />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 focus:outline-none">{children}</main>
        <footer className="border-t border-zinc-200 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800">
          Everyday Science Sim · virtual chemistry demo · toxic mixes are simulated only
        </footer>
      </div>
    </div>
  );
}

function resolveMeta(pathname: string): { title: string; subtitle: string } {
  if (pathname.startsWith('/learn/')) return { title: 'Lesson', subtitle: 'Learn, simulate, apply and reflect' };
  if (pathname.startsWith('/challenges/')) return { title: 'Challenge', subtitle: 'Interdisciplinary science task' };
  if (pathname.startsWith('/lab/')) return { title: 'Lab', subtitle: 'Simulation runner' };
  return { title: 'Everyday Science Sim', subtitle: '' };
}
