'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TransitionContext } from './transition-context';
import { NavigationEvents } from './navigation-events';
import ProgressBar from './progress-bar';
import AccessibilityAnnouncer from './accessibility-announcer';
import LoadingOverlay from './loading-overlay';
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
