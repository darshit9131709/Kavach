'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: 'home', label: 'Home', fill: true },
    { href: '/history', icon: 'history', label: 'History', fill: false },
    { href: '/circles', icon: 'group', label: 'Circles', fill: false },
    { href: '/settings', icon: 'settings', label: 'Settings', fill: false },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-200/50 dark:border-slate-800/50 rounded-2xl h-16 flex items-center justify-around px-2 soft-shadow">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              active
                ? 'text-[#8b47eb]'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span
              className={`material-symbols-outlined ${
                active && item.fill ? 'font-variation-fill' : ''
              }`}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
      {/* Spacer for SOS button overhead - positioned absolutely in LayoutWrapper */}
    </nav>
  );
}
