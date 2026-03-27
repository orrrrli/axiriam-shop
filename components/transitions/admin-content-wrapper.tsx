'use client';

import { Toaster } from 'sileo';
import { useTransitionStore } from '@/lib/store/transitionStore';
import AdminTransitionOverlay from './admin-transition-overlay';

export default function AdminContentWrapper({ children }: { children: React.ReactNode }) {
  const isNavigating = useTransitionStore((s) => s.isNavigating);

  return (
    <div className="content-admin-wrapper relative" aria-busy={isNavigating}>
      <AdminTransitionOverlay />
      {children}
      <Toaster position="top-center" theme="light" offset={{ top: '2rem' }} />
    </div>
  );
}
