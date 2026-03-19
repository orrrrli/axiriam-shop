'use client';

export interface BrandSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  reducedMotion?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: 16,
  md: 30,
  lg: 48,
} as const;

export default function BrandSpinner({
  size = 'md',
  reducedMotion = false,
  className = '',
}: BrandSpinnerProps) {
  const px = SIZE_MAP[size];

  if (reducedMotion) {
    const dotSize = Math.round(px * 0.35);
    return (
      <div
        className={className}
        style={{ width: px, height: px, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        role="status"
        aria-label="Loading"
      >
        <div
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: '#101010',
          }}
        />
      </div>
    );
  }

  const radius = (px - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = circumference;
  const dashOffset = circumference * 0.75;

  return (
    <div
      className={className}
      style={{ width: px, height: px }}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        style={{
          animation: 'brandSpinnerRotate 1s linear infinite',
        }}
      >
        <circle
          cx={px / 2}
          cy={px / 2}
          r={radius}
          stroke="#101010"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${dashArray}`}
          strokeDashoffset={`${dashOffset}`}
          style={{
            animation: `brandSpinnerDash 1.5s ease-in-out infinite`,
          }}
        />
      </svg>
      <style>{`
        @keyframes brandSpinnerRotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes brandSpinnerDash {
          0%   { stroke-dashoffset: ${circumference * 0.9}; }
          50%  { stroke-dashoffset: ${circumference * 0.2}; }
          100% { stroke-dashoffset: ${circumference * 0.9}; }
        }
      `}</style>
    </div>
  );
}
