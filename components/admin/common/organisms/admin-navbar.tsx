'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getDemoSession } from '@/lib/demo-auth';
import { useEffect, useState } from 'react';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

function getBreadcrumbs(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  return segments.slice(1).map((segment) =>
    segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
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
          <span key={index} className="flex items-center gap-[0.8rem] text-admin-nav-text">
            <span className="text-admin-muted">&gt;</span>
            <span className={index === breadcrumbs.length - 1 ? 'text-admin-nav-text font-medium' : 'text-admin-muted'}>
              {crumb}
            </span>
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
