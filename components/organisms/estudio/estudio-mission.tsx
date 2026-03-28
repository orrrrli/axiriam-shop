'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface MissionProps {
  statement: string;
  image: { src: string; alt: string };
}

export default function EstudioMission({ statement, image }: MissionProps): React.ReactElement {
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
        background: '#101010',
        width: '100%',
        minHeight: isMobile ? 'auto' : '70vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
      aria-label="Nuestra misión"
    >
      {/* Image — top on mobile, right on desktop */}
      {isMobile && (
        <div style={{ position: 'relative', width: '100%', height: '55vw', flexShrink: 0 }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 60%, #101010 100%)',
            }}
          />
        </div>
      )}

      {/* Left — mission statement */}
      <div
        style={{
          flex: '0 0 55%',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '4rem 2.8rem 6rem' : '8rem',
        }}
      >
        <blockquote
          style={{
            margin: 0,
            padding: 0,
            border: 'none',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: isMobile ? 'clamp(2.4rem, 6.5vw, 3.6rem)' : 'clamp(2.8rem, 3.8vw, 5rem)',
              fontWeight: 700,
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              margin: 0,
            }}
          >
            {statement}
          </p>
        </blockquote>
      </div>

      {/* Right — image on desktop */}
      {!isMobile && (
        <div style={{ flex: '1', position: 'relative', overflow: 'hidden' }}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            style={{ objectFit: 'cover' }}
            sizes="45vw"
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, #101010 0%, transparent 40%)',
            }}
          />
        </div>
      )}
    </section>
  );
}
