'use client';

import { useTransitionContext } from './TransitionContext';
import LoadingOverlay from './LoadingOverlay';

export default function AdminTransitionOverlay() {
  const { reducedMotion } = useTransitionContext();
  return <LoadingOverlay variant="admin" reducedMotion={reducedMotion} />;
}
