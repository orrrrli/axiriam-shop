'use client';

import { useTransitionContext } from './transition-context';
import { useTransitionStore } from '@/lib/store/transitionStore';
import BrandSpinner from './brand-spinner';
import ItemDetailSkeleton from '@/components/admin/inventory/items/item-detail-skeleton';

export default function AdminTransitionOverlay() {
  const { reducedMotion } = useTransitionContext();
  const isNavigating = useTransitionStore((s) => s.isNavigating);
  const navigationType = useTransitionStore((s) => s.navigationType);

  if (!isNavigating) return null;

  if (navigationType === 'item-detail') {
    return (
      <div
        role="status"
        aria-busy
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          backgroundColor: '#F5F7FA',
          overflowY: 'auto',
        }}
      >
        <ItemDetailSkeleton />
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy={isNavigating}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
      }}
    >
      <BrandSpinner size="lg" reducedMotion={reducedMotion} />
    </div>
  );
}
