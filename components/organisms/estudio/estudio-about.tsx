'use client';

import React, { useState, useEffect } from 'react';

interface AboutProps {
  title: string;
  description: string;
  videoUrl: string;
}

export default function EstudioAbout({ title, description, videoUrl }: AboutProps): React.ReactElement {
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
        background: '#e8e4df',
        width: '100%',
        padding: isMobile ? '6rem 2.8rem' : '10rem 8rem',
      }}
      aria-label="Sobre Axiriam"
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4rem' : '8rem',
          alignItems: 'center',
        }}
      >
        {/* Left — title + description */}
        <div style={{ flex: '0 0 45%' }}>
          <h2
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: isMobile ? 'clamp(2.8rem, 7vw, 4rem)' : 'clamp(3.2rem, 4vw, 4.8rem)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#101010',
              margin: 0,
              marginBottom: '2.4rem',
              whiteSpace: 'pre-line',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: isMobile ? '1.35rem' : '1.55rem',
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'rgba(16,16,16,0.65)',
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* Right — YouTube embed */}
        <div style={{ flex: '1', width: '100%' }}>
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%', /* 16:9 ratio */
              height: 0,
              overflow: 'hidden',
              borderRadius: '1.6rem',
              boxShadow: '0 24px 64px rgba(16,16,16,0.15)',
            }}
          >
            <iframe
              src={videoUrl}
              title="Axiriam — nuestro proceso"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
