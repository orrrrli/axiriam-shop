'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HistoryProps {
  title: string;
  body: string;
  image: { src: string; alt: string };
  quote: { text: string; author: string };
}

export default function EstudioHistory({ title, body, image, quote }: HistoryProps): React.ReactElement {
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
        background: '#f5f2ef',
        width: '100%',
        padding: isMobile ? '6rem 2.8rem' : '10rem 8rem',
        overflow: 'hidden',
      }}
      aria-label="Historia de Axiriam"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Top block — text + image */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '3.6rem' : '8rem',
            alignItems: isMobile ? 'flex-start' : 'center',
            marginBottom: isMobile ? '4rem' : '7rem',
          }}
        >
          {/* Left — text */}
          <div style={{ flex: '0 0 48%' }}>
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
              Historia
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
                marginBottom: '2.4rem',
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
                color: 'rgba(16,16,16,0.6)',
                margin: 0,
              }}
            >
              {body}
            </p>
          </div>

          {/* Right — image */}
          <div
            style={{
              flex: '1',
              position: 'relative',
              height: isMobile ? '55vw' : '40rem',
              borderRadius: '1.6rem',
              overflow: 'hidden',
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(245,242,239,0.08)',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            width: '100%',
            height: '1px',
                background: 'rgba(16,16,16,0.1)',
            marginBottom: isMobile ? '4rem' : '6rem',
          }}
        />

        {/* Quote block */}
        <div style={{ maxWidth: '72ch' }}>
          <blockquote style={{ margin: 0, padding: 0 }}>
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: isMobile ? 'clamp(2rem, 5.5vw, 2.8rem)' : 'clamp(2.4rem, 3vw, 3.4rem)',
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.02em',
                color: '#101010',
                margin: 0,
                marginBottom: '2rem',
              }}
            >
              &ldquo;{quote.text}&rdquo;
            </p>
            <footer
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: '1.3rem',
                fontWeight: 400,
                color: 'rgba(16,16,16,0.4)',
                letterSpacing: '0.02em',
              }}
            >
              {quote.author}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
