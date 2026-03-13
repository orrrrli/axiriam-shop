'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Palette,
  ShoppingCart,
  Truck,
  FileText,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Items', href: '/admin/inventory/items', icon: Package },
  { label: 'Telas', href: '/admin/inventory/telas', icon: Palette },
  { label: 'Pedidos', href: '/admin/inventory/orders', icon: ShoppingCart },
  { label: 'Envíos', href: '/admin/inventory/sales', icon: Truck },
  { label: 'Cotizaciones', href: '/admin/inventory/quotes', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[22rem] shrink-0 h-full bg-white border-r border-border flex flex-col">
      <div className="px-[2rem] py-[2rem] border-b border-border">
        <p className="text-[1.1rem] font-bold uppercase tracking-widest text-subtle">
          Panel Admin
        </p>
      </div>

      <nav className="flex flex-col gap-[0.4rem] p-[1.2rem] flex-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-[1.2rem] px-[1.6rem] py-[1.2rem]
                text-[1.3rem] font-bold transition-all duration-200
                ${active
                  ? 'bg-primary text-white'
                  : 'text-paragraph hover:bg-body-alt hover:text-heading'
                }
              `}
            >
              <Icon className="w-[1.6rem] h-[1.6rem] shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
