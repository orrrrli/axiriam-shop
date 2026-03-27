'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TransitionLink } from '@/components/transitions/navigation-events';
import { ArrowRight } from 'lucide-react';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';

export default function HeroSection(): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth <= 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      className="shop-layout"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isMobile ? '90vw' : '100vh',
        overflow: 'hidden',
        background: '#e8e4df',
      }}
      aria-label="Hero — nueva colección"
    >
      {/* Full-bleed background image */}
      <Image
        src={isMobile ? '/hero-dentists4.png' : '/hero-dentists3.png'}
        alt="Profesionales de la salud usando gorros Axiriam"
        fill
        priority
        quality={90}
        style={{
          objectFit: 'cover',
          objectPosition: isMobile ? 'center 45%' : 'center 20%',
        }}
        sizes="100vw"
      />

      {/* Dark gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: isMobile
            ? 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.52) 50%, rgba(10,10,10,0.08) 100%)'
            : 'linear-gradient(to right, rgba(10,10,10,0.86) 0%, rgba(10,10,10,0.70) 38%, rgba(10,10,10,0.24) 65%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Copy panel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMobile ? 'flex-end' : 'center',
          // ↑ More breathing room: bigger padding, especially bottom on mobile
          padding: isMobile ? '0 2.8rem 7rem' : '10rem 8rem',
          maxWidth: isMobile ? '100%' : '60rem',
        }}
      >
        {/* Badge */}
        <div style={{ marginBottom: isMobile ? '2rem' : '2.8rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(16, 16, 16, 0.72)',
              color: '#ffffff',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0.65rem 1.4rem',
              borderRadius: '9999px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <span
              style={{
                width: '0.45rem',
                height: '0.45rem',
                background: '#e8e4df',
                borderRadius: '50%',
              }}
            />
            <AnimatedShinyText shimmerWidth={80}>
              Nueva colección
            </AnimatedShinyText>
          </span>
        </div>

        {/* Headline — more breathing room below */}
        <h1
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: isMobile ? 'clamp(3.2rem, 9vw, 4.8rem)' : 'clamp(4rem, 5.5vw, 6rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0,
            marginBottom: isMobile ? '1.6rem' : '2.4rem',
            textShadow: '0 4px 60px rgba(0,0,0,0.45)',
          }}
        >
          Gorros que hablan
          <br />
          por ti.
        </h1>

        {/* Subtext — lighter weight, shorter measure, more air above CTAs */}
        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: isMobile ? '1.35rem' : '1.6rem',
            fontWeight: 400,            // ↓ lighter so it doesn't compete with headline
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.72)',
            maxWidth: '34ch',           // ↓ shorter measure = easier to scan
            margin: 0,
            marginBottom: isMobile ? '2.8rem' : '3.6rem',
          }}
        >
          Gorros quirúrgicos de alta calidad para profesionales que no renuncian al estilo.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? '1.2rem' : '1.6rem',
            marginBottom: isMobile ? '3.2rem' : '4rem', // ↑ space before social proof
          }}
        >
          <TransitionLink
            href="/catalogo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              background: '#ffffff',
              color: '#101010',
              borderRadius: '9999px',
              padding: '1.5rem 3.4rem',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.4rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
              boxShadow: '0 4px 20px rgba(255,255,255,0.15)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#f5f5f5';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 30px rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#ffffff';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(255,255,255,0.15)';
            }}
          >
            Ver colección
            <ArrowRight size={18} />
          </TransitionLink>

          <TransitionLink
            href="/catalogo?category=gorros"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              background: 'rgba(255,255,255,0.10)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#ffffff',
              borderRadius: '9999px',
              padding: '1.5rem 3rem',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.4rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.25)',
              transition: 'border-color 0.2s ease, background 0.2s ease, transform 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.6)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.10)';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            Explorar gorros
          </TransitionLink>
        </div>

        {/* Divider + Social proof — separated with a thin rule */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '3rem',
              height: '1px',
              background: 'rgba(255,255,255,0.18)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ display: 'flex' }}>
              {['#e8d5c4', '#c4d5e8', '#c4e8d5'].map((bg, i) => (
                <div
                  key={i}
                  style={{
                    width: '2.6rem',
                    height: '2.6rem',
                    borderRadius: '50%',
                    background: bg,
                    border: '2px solid rgba(255,255,255,0.25)',
                    marginLeft: i === 0 ? 0 : '-0.8rem',
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: '1.15rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: '0.01em',
              }}
            >
              +500 profesionales confían en Axiriam
            </span>
          </div>
        </div>
      </div>

      {/* Floating material tag — bottom-right, desktop only */}
      {!isMobile && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '4rem',
            right: '4rem',
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '1.6rem',
            padding: '1.4rem 2.2rem',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.45)',
              margin: 0,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Tela premium
          </p>
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0.4rem 0 0',
            }}
          >
            100% algodón
          </p>
        </div>
      )}
    </section>
  );
}