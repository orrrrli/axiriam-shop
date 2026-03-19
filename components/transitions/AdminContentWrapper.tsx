'use client';

import { useTransitionStore } from '@/lib/store/transitionStore';
import AdminTransitionOverlay from './AdminTransitionOverlay';

export default function AdminContentWrapper({ children }: { children: React.ReactNode }) {
  const isNavigating = useTransitionStore((s) => s.isNavigating);

  return (
    <div className="content-admin-wrapper relative" aria-busy={isNavigating}>
      <AdminTransitionOverlay />
      {children}
    </div>
  );
}
