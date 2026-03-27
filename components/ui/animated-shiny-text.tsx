'use client';

import { type CSSProperties, type FC, type ReactNode } from 'react';

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className = '',
  shimmerWidth = 100,
}) => {
  const shimmerStyles: CSSProperties = {
    background: `linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.8) 25%,
      rgba(255, 255, 255, 0.9) 50%,
      rgba(255, 255, 255, 0.8) 75%,
      transparent 100%
    )`,
    backgroundSize: `${shimmerWidth * 2}% 100%`,
    animation: 'shimmer 3s infinite linear',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block',
  };

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      <span className={className} style={shimmerStyles}>
        {children}
      </span>
    </>
  );
};
