'use client';

import React, { useState, useEffect } from 'react';
import { Scissors, Ruler, Package } from 'lucide-react';

const iconMap: Record<string, React.ReactElement> = {
  Scissors: <Scissors size={28} />,
  Ruler: <Ruler size={28} />,
  Package: <Package size={28} />,
};

interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  steps: Step[];
}

export default function EstudioHowItWorks({ title, steps }: HowItWorksProps): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth <= 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      style={{
        background: '#fafafa',
        width: '100%',
        padding: isMobile ? '6rem 2.8rem' : '10rem 8rem',
      }}
      aria-label="Cómo trabajamos"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section heading */}
        <p
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(16,16,16,0.4)',
            margin: 0,
            marginBottom: '1.6rem',
          }}
        >
          Proceso
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: isMobile ? 'clamp(2.8rem, 7vw, 4rem)' : 'clamp(3.2rem, 4vw, 4.8rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#101010',
            margin: 0,
            marginBottom: isMobile ? '4rem' : '6rem',
          }}
        >
          {title}
        </h2>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '3.2rem' : '4rem',
          }}
        >
          {steps.map((step) => (
            <div key={step.number} style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
              {/* Number + icon row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.6rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: 'clamp(3.6rem, 5vw, 5.2rem)',
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    color: 'rgba(16,16,16,0.08)',
                    flexShrink: 0,
                  }}
                >
                  {step.number}
                </span>
                <div
                  style={{
                    marginTop: '0.4rem',
                    color: '#101010',
                    opacity: 0.6,
                  }}
                >
                  {iconMap[step.icon] ?? <Scissors size={28} />}
                </div>
              </div>

              {/* Text */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '1.9rem',
                    fontWeight: 700,
                    color: '#101010',
                    margin: 0,
                    marginBottom: '0.8rem',
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontSize: '1.45rem',
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: 'rgba(16,16,16,0.55)',
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
