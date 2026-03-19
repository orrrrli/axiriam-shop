'use client';

import { useEffect, useState } from 'react';
import { useTransitionStore } from '@/lib/store/transitionStore';
import {
  PROGRESS_BAR_COMPLETE_FADE_MS,
  PROGRESS_BAR_LOOP_THRESHOLD_MS,
} from '@/lib/constants/transitions';

export interface ProgressBarProps {
  reducedMotion: boolean;
}

export default function ProgressBar({ reducedMotion }: ProgressBarProps) {
  const progress = useTransitionStore((s) => s.progress);
  const isNavigating = useTransitionStore((s) => s.isNavigating);
  const isVisible = useTransitionStore((s) => s.isVisible);
  const startTime = useTransitionStore((s) => s.startTime);

  const [isLooping, setIsLooping] = useState(false);
  const [opacity, setOpacity] = useState(1);

  // Detect when navigation has exceeded the loop threshold
  useEffect(() => {
    if (!isNavigating || !startTime) {
      setIsLooping(false);
      return;
    }

    const elapsed = Date.now() - startTime;
    const remaining = PROGRESS_BAR_LOOP_THRESHOLD_MS - elapsed;

    if (remaining <= 0) {
      setIsLooping(true);
      return;
    }

    const timer = setTimeout(() => setIsLooping(true), remaining);
    return () => clearTimeout(timer);
  }, [isNavigating, startTime]);

  // Fade out when progress reaches 100 (navigation complete)
  useEffect(() => {
    if (progress === 100) {
      setOpacity(1);
      const timer = setTimeout(() => setOpacity(0), 0);
      return () => clearTimeout(timer);
    } else {
      setOpacity(1);
    }
  }, [progress]);

  // Reset looping state when navigation ends
  useEffect(() => {
    if (!isNavigating) {
      setIsLooping(false);
    }
  }, [isNavigating]);

  if (!isVisible && progress === 0) return null;

  const barStyle: React.CSSProperties = {
    backgroundColor: '#101010',
    height: '100%',
    width: isLooping ? '100%' : `${progress}%`,
    opacity,
    ...(reducedMotion
      ? {}
      : {
          transition: `width 200ms ease, opacity ${PROGRESS_BAR_COMPLETE_FADE_MS}ms ease`,
        }),
  };

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        zIndex: 90,
        pointerEvents: 'none',
      }}
    >
      <div
        style={barStyle}
        className={
          isLooping && !reducedMotion ? 'progress-bar-pulse' : undefined
        }
      />
      {isLooping && !reducedMotion && (
        <style>{`
          @keyframes progressBarPulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
          }
          .progress-bar-pulse {
            animation: progressBarPulse 1s ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  );
}
