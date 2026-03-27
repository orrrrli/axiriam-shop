'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  badge: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  images: Array<{ src: string; alt: string }>;
}

export default function EstudioHero({ badge, title, subtitle, cta, images }: HeroProps): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);
  const [isXL, setIsXL] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    const check = (): void => {
      setIsMobile(window.innerWidth <= 800);
      setIsXL(window.innerWidth >= 1440);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      style={{
        background: '#f5f2ef',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '10rem 3.6rem 6rem' : '0 10rem',
        gap: isMobile ? '4rem' : '4rem',
        overflow: 'hidden',
      }}
      aria-label="Estudio — quiénes somos"
    >
      {/* Left — copy panel */}
      <div
        style={{
          flex: '0 0 auto',
          maxWidth: isMobile ? '100%' : '58rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: isMobile ? 'clamp(4rem, 11vw, 5.6rem)' : 'clamp(5.6rem, 7vw, 8rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#101010',
            margin: 0,
            marginBottom: '2.4rem',
            whiteSpace: 'pre-line',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(16,16,16,0.52)',
            maxWidth: '38ch',
            margin: 0,
            marginBottom: '3.6rem',
          }}
        >
          {subtitle}
        </p>

        {/* CTA */}
        <Link
          href={cta.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: ctaHovered ? '#1a1a1a' : '#101010',
            color: '#ffffff',
            borderRadius: '9999px',
            padding: '1.5rem 3.4rem',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '1.4rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
            boxShadow: ctaHovered
              ? '0 8px 30px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.12)',
            transform: ctaHovered ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          {cta.label}
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Right — image grid */}
      {isMobile ? (
        <div
          style={{
            width: '100%',
            height: '60vw',
            borderRadius: '1.2rem',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        </div>
      ) : (
        <div
          style={{
            flex: '0 0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '1rem',
          width: isXL ? '820px' : '660px',
          height: isXL ? '780px' : '620px',
          }}
        >
          {/* Image 0 — top-left square */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '1.2rem',
              gridColumn: '1',
              gridRow: '1',
            }}
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="260px"
            />
          </div>

          {/* Image 1 — bottom-left square */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '1.2rem',
              gridColumn: '1',
              gridRow: '2',
            }}
          >
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="260px"
            />
          </div>

          {/* Image 2 — tall right column, row-span-2 */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '1.2rem',
              gridColumn: '2',
              gridRow: '1 / 3',
            }}
          >
            <Image
              src={images[2].src}
              alt={images[2].alt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="260px"
            />
          </div>
        </div>
      )}
    </section>
  );
}
