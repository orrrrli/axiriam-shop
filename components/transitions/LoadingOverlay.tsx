'use client';

import BrandSpinner from './BrandSpinner';
import { useTransitionStore } from '@/lib/store/transitionStore';

export interface LoadingOverlayProps {
  variant: 'global' | 'admin' | 'checkout';
  reducedMotion: boolean;
}

export default function LoadingOverlay({ variant, reducedMotion }: LoadingOverlayProps) {
  const isNavigating = useTransitionStore((s) => s.isNavigating);
  const isVisible = useTransitionStore((s) => s.isVisible);

  if (variant === 'global') {
    if (!isVisible) return null;
    return (
      <div
        role="status"
        aria-busy={isNavigating}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BrandSpinner size="lg" reducedMotion={reducedMotion} />
      </div>
    );
  }

  if (variant === 'admin') {
    if (!isVisible) return null;
    return (
      <div
        role="status"
        aria-busy={isNavigating}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
        }}
      >
        <BrandSpinner size="sm" reducedMotion={reducedMotion} />
      </div>
    );
  }

  // checkout: inline, always rendered, visibility controlled by isNavigating
  return (
    <div
      role="status"
      aria-busy={isNavigating}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        visibility: isNavigating ? 'visible' : 'hidden',
      }}
    >
      <BrandSpinner size="sm" reducedMotion={reducedMotion} />
      <span>Processing...</span>
    </div>
  );
}
