'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TransitionLink } from '@/components/transitions/navigation-events';

export interface AnimatedCardProps {
  title: string;
  imageSrc: string;
  href: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ title, imageSrc, href }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // GSAP context handles cleanup automatically on unmount
  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      y: -16,
      scale: 1.07,
      duration: 0.45,
      ease: 'power2.out',
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out',
    });
  });

  return (
    <TransitionLink href={href} style={{ display: 'block', textDecoration: 'none' }}>
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '1.6rem',
          overflow: 'hidden',
          background: '#101010',
          border: '1px solid rgba(255,255,255,0.06)',
          width: '30rem',
          height: '38rem',
          flexShrink: 0,
          cursor: 'pointer',
          boxSizing: 'border-box',
          padding: '3.2rem 2.4rem 0',
        }}
      >
        {/* Title at the top */}
        <h3
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fafafa',
            margin: '0 0 2.4rem',
            lineHeight: 1.1,
            alignSelf: 'flex-start',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h3>

        {/* Image container — overflow visible so image can slide up */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            width: '100%',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            ref={imageRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformOrigin: 'bottom center',
            }}
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="30rem"
              style={{
                objectFit: 'contain',
                objectPosition: 'center bottom',
              }}
            />
          </div>
        </div>
      </div>
    </TransitionLink>
  );
};

export default AnimatedCard;
