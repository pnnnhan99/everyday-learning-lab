'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, Atom, TestTubes, ShieldPlus, User, Compass, Puzzle, Boxes, Beaker, House, Grid3x3 } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useDictionary } from '@/i18n/useDictionary';

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useUiStore((s) => s.toggleCollapsed);
  const dictionary = useDictionary();

  const links = [
    { href: '/', label: dictionary.nav.home, icon: House },
    { href: '/explore', label: dictionary.nav.explore, icon: Compass },
    { href: '/challenges', label: dictionary.nav.challenges, icon: Puzzle },
    { href: '/lab/chemistry', label: dictionary.nav.chemistryLab, icon: FlaskConical },
    { href: '/chemistry/periodic-table', label: dictionary.nav.periodicTable, icon: Grid3x3 },
    { href: '/lab', label: dictionary.nav.simulations, icon: Beaker },
    { href: '/lab/3d', label: dictionary.nav.lab3d, icon: Boxes },
    { href: '/elements', label: dictionary.nav.elements, icon: Atom },
    { href: '/reactions', label: dictionary.nav.reactions, icon: TestTubes },
    { href: '/admin', label: dictionary.nav.admin, icon: ShieldPlus },
    { href: '/profile', label: dictionary.nav.profile, icon: User },
  ];

  return (
    <aside
      aria-label={dictionary.nav.primary}
      className={`z-40 flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-all dark:border-zinc-800 dark:bg-zinc-900 ${
        sidebarOpen ? 'fixed inset-y-0 left-0 w-64' : 'fixed hidden lg:static lg:flex'
      } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
    >
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><FlaskConical size={18} aria-hidden /></span>
        {!collapsed && <span className="hidden text-sm font-bold lg:block">Everyday Science</span>}
      </div>
      <nav aria-label={dictionary.nav.sections} className="flex flex-col gap-1 px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isSectionRoot = href === '/' || href === '/lab';
          const active = isSectionRoot ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                active ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon size={18} aria-hidden />
              {!collapsed && <span className="hidden lg:block">{label}</span>}
              {collapsed && <span className="lg:hidden">{label}</span>}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={toggleCollapsed}
        aria-expanded={!collapsed}
        className="m-2 mt-auto hidden rounded-xl border px-3 py-2 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 lg:block"
      >
        {collapsed ? dictionary.nav.expand : dictionary.nav.collapse}
      </button>
    </aside>
  );
}
