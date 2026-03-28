'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CtaBannerProps {
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
}

export default function EstudioCtaBanner({ title, subtitle, cta }: CtaBannerProps): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

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
        padding: isMobile ? '8rem 2.8rem' : '12rem 8rem',
        textAlign: 'center',
      }}
      aria-label="Llamada a la acción"
    >
      <div
        style={{
          background: '#101010',
          borderRadius: '2.4rem',
          padding: isMobile ? '5rem 2.8rem' : '7rem 8rem',
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: isMobile ? 'clamp(3rem, 8vw, 4.4rem)' : 'clamp(3.6rem, 5vw, 5.6rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0,
            marginBottom: '2rem',
            whiteSpace: 'pre-line',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: isMobile ? '1.35rem' : '1.6rem',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.52)',
            margin: 0,
            marginBottom: '3.6rem',
          }}
        >
          {subtitle}
        </p>
        <Link
          href={cta.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: ctaHovered ? '#f5f5f5' : '#ffffff',
            color: '#101010',
            borderRadius: '9999px',
            padding: '1.5rem 3.4rem',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '1.4rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
            boxShadow: ctaHovered
              ? '0 8px 30px rgba(255,255,255,0.2)'
              : '0 4px 20px rgba(255,255,255,0.1)',
            transform: ctaHovered ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          {cta.label}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
