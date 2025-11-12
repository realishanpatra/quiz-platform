'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BarChart3, BookCopy } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/performance', label: 'Performance', icon: BarChart3 },
  { href: '/student/quizzes', label: 'All Quizzes', icon: BookCopy },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1 px-4">
      {navItems.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              { "bg-muted text-primary": pathname === item.href }
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
