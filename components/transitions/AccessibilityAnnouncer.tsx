'use client';

import { useEffect, useRef } from 'react';
import { useTransitionStore } from '@/lib/store/transitionStore';

export default function AccessibilityAnnouncer() {
  const isNavigating = useTransitionStore((s) => s.isNavigating);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messageRef.current) return;
    if (isNavigating) {
      messageRef.current.textContent = 'Loading...';
    } else {
      messageRef.current.textContent = document.title;
    }
  }, [isNavigating]);

  return (
    <div
      ref={messageRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    />
  );
}
