'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TransitionContext } from './TransitionContext';
import { NavigationEvents } from './NavigationEvents';
import ProgressBar from './ProgressBar';
import AccessibilityAnnouncer from './AccessibilityAnnouncer';
import LoadingOverlay from './LoadingOverlay';
import { useTransitionStore } from '@/lib/store/transitionStore';

interface TransitionProviderProps {
  children: React.ReactNode;
}

export default function TransitionProvider({ children }: TransitionProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const isVisible = useTransitionStore((s) => s.isVisible);
  const isNavigating = useTransitionStore((s) => s.isNavigating);
  const pathname = usePathname();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isExcludedRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/checkout');

  return (
    <TransitionContext.Provider value={{ reducedMotion }}>
      <NavigationEvents />
      <ProgressBar reducedMotion={reducedMotion} />
      <AccessibilityAnnouncer />
      {!isExcludedRoute && (
        <LoadingOverlay variant="global" reducedMotion={reducedMotion} />
      )}
      {children}
    </TransitionContext.Provider>
  );
}
