'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import { useTransitionStore } from '@/lib/store/transitionStore';
import {
  TRANSITION_DELAY_THRESHOLD_MS,
} from '@/lib/constants/transitions';

const NAVIGATION_TIMEOUT_MS = 5000;

/**
 * NavigationEvents — side-effect-only component.
 * Detects pathname changes (navigation completion) and calls completeNavigation.
 */
export function NavigationEvents() {
  const pathname = usePathname();
  const { completeNavigation } = useTransitionStore();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial mount — we only care about subsequent pathname changes
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    completeNavigation();
  }, [pathname, completeNavigation]);

  return null;
}

/**
 * TransitionLink — wraps next/link and starts the transition on click.
 * Manages the delay threshold timer and the 5s cancellation timeout.
 */
export function TransitionLink({
  children,
  onClick,
  ...props
}: LinkProps & {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  className?: string;
}) {
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (delayTimerRef.current !== null) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (cancelTimerRef.current !== null) {
      clearTimeout(cancelTimerRef.current);
      cancelTimerRef.current = null;
    }
  };

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    clearTimers();

    const { startNavigation, showIndicator, cancelNavigation } =
      useTransitionStore.getState();

    startNavigation();

    // After TRANSITION_DELAY_THRESHOLD_MS, show the indicator if still navigating
    delayTimerRef.current = setTimeout(() => {
      const { isNavigating } = useTransitionStore.getState();
      if (isNavigating) {
        showIndicator();
      }
    }, TRANSITION_DELAY_THRESHOLD_MS);

    // After 5s without a pathname change, cancel the navigation
    cancelTimerRef.current = setTimeout(() => {
      const { isNavigating } = useTransitionStore.getState();
      if (isNavigating) {
        cancelNavigation();
      }
    }, NAVIGATION_TIMEOUT_MS);

    onClick?.(e);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
