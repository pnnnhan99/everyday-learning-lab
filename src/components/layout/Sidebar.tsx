'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlaskConical, Atom, TestTubes, ShieldPlus, User, Compass, Puzzle, Boxes } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

const LINKS = [
  { href: '/', label: 'Lab', icon: FlaskConical },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/challenges', label: 'Challenges', icon: Puzzle },
  { href: '/lab/3d', label: '3D Lab', icon: Boxes },
  { href: '/elements', label: 'Elements', icon: Atom },
  { href: '/reactions', label: 'Reactions', icon: TestTubes },
  { href: '/admin', label: 'Admin', icon: ShieldPlus },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useUiStore((s) => s.toggleCollapsed);

  return (
    <aside
      aria-label="Primary"
      className={`z-40 flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-all dark:border-zinc-800 dark:bg-zinc-900 ${
        sidebarOpen ? 'fixed inset-y-0 left-0 w-64' : 'fixed hidden lg:static lg:flex'
      } ${collapsed ? 'lg:w-16' : 'lg:w-64'}`}
    >
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white"><FlaskConical size={18} aria-hidden /></span>
        {!collapsed && <span className="hidden text-sm font-bold lg:block">Everyday Science</span>}
      </div>
      <nav aria-label="Sections" className="flex flex-col gap-1 px-2">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
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
        {collapsed ? 'Expand' : 'Collapse'}
      </button>
    </aside>
  );
}
