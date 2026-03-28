'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedCard, { type AnimatedCardProps } from '@/components/molecules/animated-card';

gsap.registerPlugin(ScrollTrigger);

// Gap between cards in pixels (matches the inline gap style below)
const CARD_GAP = 16;

interface AnimatedCardsSectionProps {
  title: string;
  cards: AnimatedCardProps[];
}

export default function AnimatedCardsSection({
  title,
  cards,
}: AnimatedCardsSectionProps): React.ReactElement {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth < 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Entry animation via ScrollTrigger ─────────────────────────────────────
  useGSAP(
    () => {
      if (!titleRef.current || !trackRef.current) return;

      // Title slides up on entry
      gsap.set(titleRef.current, { opacity: 0, y: 24 });
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 90%',
          once: true,
        },
      });

      // Cards stagger
      const cardEls = trackRef.current.querySelectorAll('[data-card]');
      gsap.set(cardEls, { opacity: 0, y: 32 });
      gsap.to(cardEls, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  // ── Carousel scroll helper ─────────────────────────────────────────────────
  const scrollCarousel = (direction: 'left' | 'right'): void => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    // Use the first card's width as scroll step, falling back to 300px
    const cardEl = track.querySelector<HTMLElement>('[data-card]');
    const cardWidth = cardEl ? cardEl.offsetWidth : 300;
    const scrollAmount = cardWidth + CARD_GAP;
    const targetX = track.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);

    gsap.to(track, {
      scrollLeft: targetX,
      duration: 0.55,
      ease: 'power2.inOut',
    });
  };

  // ── Arrow button styles ────────────────────────────────────────────────────
  const arrowBtn: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4.4rem',
    height: '4.4rem',
    borderRadius: '50%',
    background: '#101010',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fafafa',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.2s ease, border-color 0.2s ease',
    // reset button defaults
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '1.8rem',
    lineHeight: 1,
  };

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        background: '#f5f4f2',
        boxSizing: 'border-box',
        padding: isMobile ? '5rem 0 5rem 1.6rem' : '10rem 0 10rem 15rem',
        overflow: 'hidden',
      }}
      aria-label={title}
    >
      {/* ── Header row: title + navigation ───────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4rem',
          paddingRight: isMobile ? '1.6rem' : '15rem',
        }}
      >
        <h2
          ref={titleRef}
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 'clamp(2.4rem, 3vw, 3.6rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#101010',
            margin: 0,
          }}
        >
          {title}
        </h2>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
          <button
            type="button"
            aria-label="Anterior"
            style={arrowBtn}
            onClick={() => scrollCarousel('left')}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#222';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#101010';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            style={arrowBtn}
            onClick={() => scrollCarousel('right')}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#222';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.25)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#101010';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* ── Carousel track ───────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: `${CARD_GAP}px`,
          overflowX: 'auto',
          overflowY: 'visible',
          scrollbarWidth: 'none', // Firefox
          // Padding right so last card isn't flush against the edge
          paddingRight: isMobile ? '1.6rem' : '15rem',
          paddingBottom: '2rem', // room for shadow if any
          // Allow the hover image to overflow card bounds
          paddingTop: '2rem',
          marginTop: '-2rem',
          boxSizing: 'content-box',
        }}
        // Hide scrollbar on WebKit
        className="carousel-track"
      >
        {cards.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            data-card
          >
            <AnimatedCard {...card} />
          </div>
        ))}
      </div>

      {/* Hide WebKit scrollbar via injected style */}
      <style>{`.carousel-track::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
