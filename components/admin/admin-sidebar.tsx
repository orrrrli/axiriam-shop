'use client';

import Link from 'next/link';
import { TransitionLink } from '@/components/transitions/navigation-events';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Warehouse,
  ClipboardList,
  Truck,
  FileText,
  LogOut,
  Settings,
  LayoutGrid,
  ShoppingCart,
} from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { getDemoSession, demoSignOut } from '@/lib/demo-auth';
import { useEffect, useState } from 'react';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Productos', href: '/admin/inventory/items', icon: ShoppingBag },
  { label: 'Almacén', href: '/admin/inventory/warehouse', icon: Warehouse },
  { label: 'Pedidos', href: '/admin/inventory/orders', icon: ClipboardList },
  { label: 'Ventas', href: '/admin/inventory/ventas', icon: ShoppingCart },
  { label: 'Envíos', href: '/admin/inventory/sales', icon: Truck },
  { label: 'Cotizaciones', href: '/admin/inventory/quotes', icon: FileText },
];

export default function AdminSidebar(): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [demoUser, setDemoUser] = useState<{ name?: string; email?: string } | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      const demoSession = getDemoSession();
      setDemoUser(demoSession?.user || null);
    }
  }, []);

  const handleSignOut = (): void => {
    setSigningOut(true);
    if (DEMO_MODE) {
      setTimeout(() => {
        demoSignOut();
        setDemoUser(null);
        router.push('/');
        router.refresh();
      }, 1800);
    } else {
      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 1800);
    }
  };

  if (signingOut) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, background: '#101010',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.4rem',
          animation: 'fadeIn 0.4s ease forwards', zIndex: 9999,
        }}
      >
        <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '2.4rem', fontWeight: 700, letterSpacing: '0.16em', color: 'white' }}>
          AXIRIAM
        </span>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-montserrat)', fontSize: '1.8rem', fontWeight: 700, color: 'white', margin: 0 }}>
            Hasta pronto
          </p>
          <p style={{ fontFamily: 'var(--font-geist)', fontSize: '1.3rem', color: 'rgba(255,255,255,0.45)', marginTop: '6px' }}>
            Cerrando sesión...
          </p>
        </div>
        <div style={{ width: '120px', height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'white', borderRadius: '9999px', animation: 'fullWidth 1.8s ease forwards' }} />
        </div>
      </div>
    );
  }

  return (
    <aside className="w-[24rem] shrink-0 h-full bg-admin-sidebar border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-[2rem] py-[2.4rem] flex items-center gap-[1.2rem]">
        <div className="w-[3.2rem] h-[3.2rem] flex items-center justify-center text-admin-muted">
          <LayoutGrid className="w-[2rem] h-[2rem]" />
        </div>
        <Link
          href="/"
          className="text-[1.8rem] font-bold text-heading tracking-tight"
        >
          Axiriam
        </Link>
      </div>

      {/* Main Menu */}
      <nav className="flex flex-col flex-1 px-[1.2rem]">
        <p className="px-[1.6rem] pt-[1.2rem] pb-[0.8rem] text-[1.1rem] font-semibold uppercase tracking-widest text-admin-muted">
          Main Menu
        </p>
        <div className="flex flex-col gap-[0.2rem]">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <TransitionLink
                key={href}
                href={href}
                className={`
                  flex items-center gap-[1.2rem] px-[1.6rem] py-[1.2rem]
                  text-[1.4rem] font-medium rounded-[0.8rem] transition-all duration-200
                  ${active
                    ? 'bg-admin-active text-admin-active-text border-l-[3px] border-admin-active-border'
                    : 'text-admin-nav-text hover:bg-body-alt'
                  }
                `}
              >
                <Icon className="w-[2rem] h-[2rem] shrink-0" />
                {label}
              </TransitionLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-[1.2rem] pb-[2rem] flex flex-col gap-[0.2rem]">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-[1.2rem] px-[1.6rem] py-[1.2rem] text-[1.4rem] font-medium text-admin-nav-text hover:bg-body-alt rounded-[0.8rem] transition-all duration-200"
        >
          <Settings className="w-[2rem] h-[2rem] shrink-0" />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-[1.2rem] px-[1.6rem] py-[1.2rem] w-full text-[1.4rem] font-medium text-admin-nav-text hover:bg-body-alt rounded-[0.8rem] transition-all duration-200"
        >
          <LogOut className="w-[2rem] h-[2rem] shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
