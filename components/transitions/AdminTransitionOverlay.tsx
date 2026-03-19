'use client';

import { useTransitionContext } from './TransitionContext';
import { useTransitionStore } from '@/lib/store/transitionStore';
import BrandSpinner from './BrandSpinner';

export default function AdminTransitionOverlay() {
  const { reducedMotion } = useTransitionContext();
  const isNavigating = useTransitionStore((s) => s.isNavigating);

  if (!isNavigating) return null;

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
