'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getDemoSession } from '@/lib/demo-auth';
import { useEffect, useState } from 'react';
import { env } from '@/lib/env';

const DEMO_MODE = env.DEMO_MODE;

const SEGMENT_HREF_OVERRIDES: Record<string, string> = {
  inventory: '/admin/dashboard',
};

interface Breadcrumb {
  label: string;
  href: string | null;
}

function getBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const displaySegments = segments.slice(1);

  return displaySegments.map((segment, index) => {
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const isLast = index === displaySegments.length - 1;
    if (isLast) return { label, href: null };

    const href =
      SEGMENT_HREF_OVERRIDES[segment] ??
      '/' + segments.slice(0, index + 2).join('/');

    return { label, href };
  });
}

export function AdminNavbar(): React.ReactElement {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [demoUser, setDemoUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    if (DEMO_MODE) {
      const demoSession = getDemoSession();
      setDemoUser(demoSession?.user || null);
    }
  }, []);

  const breadcrumbs = getBreadcrumbs(pathname);
  const userName = session?.user?.name?.split(' ')[0] || demoUser?.name || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="h-[6rem] bg-white border-b border-border flex items-center justify-between px-[2.4rem] shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-[0.8rem] text-[1.3rem]">
        <span className="w-[2.4rem] h-[2.4rem] rounded-full bg-admin-active-text text-white flex items-center justify-center text-[1.1rem] font-semibold">
          {userInitial}
        </span>
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-[0.8rem]">
            <span className="text-admin-muted">&gt;</span>
            {crumb.href !== null ? (
              <Link
                href={crumb.href}
                className="text-admin-muted hover:text-admin-nav-text transition-colors duration-150"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-admin-nav-text font-medium">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-[2rem]">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 w-[1.6rem] h-[1.6rem] text-admin-muted" />
          <input
            type="text"
            placeholder="Search"
            className="pl-[3.6rem] pr-[1.6rem] py-[0.8rem] text-[1.3rem] bg-body rounded-[0.8rem] border border-border outline-none focus:border-border-focus w-[24rem] transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-[0.8rem] text-admin-muted hover:text-admin-nav-text transition-colors">
          <Bell className="w-[2rem] h-[2rem]" />
          <span className="absolute top-[0.4rem] right-[0.4rem] w-[1.6rem] h-[1.6rem] bg-danger rounded-full text-white text-[0.9rem] flex items-center justify-center font-semibold">
            2
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-[1rem]">
          <span className="w-[3.2rem] h-[3.2rem] rounded-full bg-admin-active-text text-white flex items-center justify-center text-[1.3rem] font-semibold">
            {userInitial}
          </span>
          <span className="text-[1.3rem] font-medium text-admin-nav-text">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
