'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TransitionLink } from '@/components/transitions/navigation-events';
import { ArrowRight, Sparkles } from 'lucide-react';

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
        width: '100%',
        minHeight: isMobile ? 'auto' : '100vh',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        overflow: isMobile ? 'visible' : 'hidden',
        background: '#fafafa',
      }}
    >
      {/* Image — on mobile renders first via order */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#f0eeec',
          height: isMobile ? '80vw' : 'auto',
          order: isMobile ? -1 : 1,
        }}
      >
        <Image
          src={isMobile ? '/hero-dentists4.png' : '/hero-dentists3.png'}
          alt="Profesionales de la salud usando gorros Axiriam"
          fill
          priority
          quality={100}
          style={{
            objectFit: 'cover',
            objectPosition: isMobile ? 'center 45%' : 'center 15%',
          }}
          sizes="(max-width: 800px) 100vw, 50vw"
        />

        {/* Gradient blend */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isMobile
              ? 'linear-gradient(to bottom, rgba(250,250,250,0.45) 0%, transparent 30%)'
              : 'linear-gradient(to right, rgba(250,250,250,0.18) 0%, transparent 18%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating tag — hidden on mobile */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '3rem',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '1.6rem',
              padding: '1.4rem 2rem',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'rgba(0,0,0,0.4)',
                margin: 0,
                letterSpacing: '0.1em',
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
                color: '#101010',
                margin: '0.2rem 0 0',
              }}
            >
              100% algodón
            </p>
          </div>
        )}
      </div>

      {/* Copy */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '3.6rem 2.4rem 5rem' : '12rem 6rem 8rem 8rem',
          gap: isMobile ? '2rem' : '2.4rem',
          order: isMobile ? 1 : 0,
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '9999px',
            padding: '0.5rem 1.4rem',
            width: 'fit-content',
          }}
        >
          <Sparkles size={12} style={{ color: '#101010', opacity: 0.6 }} />
          <span
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              color: '#101010',
              textTransform: 'uppercase',
              opacity: 0.65,
            }}
          >
            Nueva colección
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: isMobile ? 'clamp(3.2rem, 9vw, 4.8rem)' : 'clamp(3.6rem, 5vw, 6.4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#101010',
            margin: 0,
          }}
        >
          Gorros que
          <br />
          <span style={{ color: '#101010', opacity: 0.35 }}>hablan por</span>
          <br />
          ti.
        </h1>

        {/* Subtext */}
        <p
          style={{
            fontFamily: 'var(--font-geist)',
            fontSize: isMobile ? '1.5rem' : '1.6rem',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(0,0,0,0.5)',
            maxWidth: '38ch',
            margin: 0,
          }}
        >
          Gorros quirúrgicos de alta calidad para profesionales de la salud que no renuncian al
          estilo.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: '1.2rem',
            marginTop: '0.8rem',
          }}
        >
          <TransitionLink
            href="/catalogo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              background: '#101010',
              color: 'white',
              borderRadius: '9999px',
              padding: '1.3rem 2.8rem',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.4rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'background 0.2s ease, transform 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#2a2a2a';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#101010';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            Ver colección
            <ArrowRight size={15} />
          </TransitionLink>

          <TransitionLink
            href="/catalogo?category=gorros"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              background: 'transparent',
              color: 'rgba(0,0,0,0.55)',
              borderRadius: '9999px',
              padding: '1.3rem 2.4rem',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.4rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1.5px solid rgba(0,0,0,0.12)',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#101010';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.12)';
              (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(0,0,0,0.55)';
            }}
          >
            Explorar gorros
          </TransitionLink>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginTop: '0.4rem' }}>
          <div style={{ display: 'flex' }}>
            {['#e8d5c4', '#c4d5e8', '#c4e8d5'].map((bg, i) => (
              <div
                key={i}
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  background: bg,
                  border: '2px solid #fafafa',
                  marginLeft: i === 0 ? 0 : '-0.8rem',
                }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: '1.25rem',
              color: 'rgba(0,0,0,0.45)',
            }}
          >
            +500 profesionales confían en Axiriam
          </span>
        </div>
      </div>
    </section>
  );
}
