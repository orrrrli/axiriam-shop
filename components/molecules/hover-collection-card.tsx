'use client';

import React, { useMemo, useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface ImageMotion {
  from: { xPercent: number; yPercent: number; rotation: number; scale: number };
  to:   { xPercent: number; yPercent: number; rotation: number; scale: number };
  duration: number;
  delay: number;
  ease: string;
}

/**
 * Solo 2 imágenes secundarias: una a cada orilla.
 * La principal ocupa casi toda la card.
 */
const MOTIONS: ImageMotion[] = [
  {
    // Izquierda — entra diagonal desde abajo-izquierda
    from: { xPercent: -70, yPercent: 100, rotation: -20, scale: 0.75 },
    to:   { xPercent: -45, yPercent:   2, rotation: 18, scale: 0.78 },
    duration: 0.55,
    delay: 0.00,
    ease: 'power3.out',
  },
  {
    // Derecha — entra diagonal desde abajo-derecha
    from: { xPercent:  70, yPercent: 100, rotation:  20, scale: 0.75 },
    to:   { xPercent:  52, yPercent:   2, rotation:  6, scale: 0.78 },
    duration: 0.30,
    delay: 0.08,
    ease: 'power3.out',
  },
];

export interface HoverCollectionCardProps {
  mainImage: string;
  secondaryImages: string[];
  title: string;
  label?: string;
  className?: string;
}

const HoverCollectionCard: React.FC<HoverCollectionCardProps> = ({
  mainImage,
  secondaryImages,
  title,
  label = 'Coleccion',
  className = '',
}) => {
  const cardRef       = useRef<HTMLDivElement>(null);
  const mainImageRef  = useRef<HTMLDivElement>(null);
  const secondaryRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tlRef         = useRef<GSAPTimeline | null>(null);

  const mapped = useMemo(
    () => secondaryImages.slice(0, MOTIONS.length),
    [secondaryImages]
  );

  const { contextSafe } = useGSAP(
    () => {
      if (!mainImageRef.current) return;

      const els = secondaryRefs.current.filter(
        (el): el is HTMLDivElement => Boolean(el)
      );

      gsap.set(mainImageRef.current, {
        xPercent: 0, yPercent: 0, rotation: 0,
        scale: 1, autoAlpha: 1, zIndex: 10,
      });

      els.forEach((el, i) => {
        gsap.set(el, { ...MOTIONS[i].from, autoAlpha: 0, zIndex: 2 + i });
      });

      const tl = gsap.timeline({ paused: true });

      // Principal: leve escala hacia arriba para que las orillas queden visibles
      tl.to(
        mainImageRef.current,
        { scale: 0.90, yPercent: -5, duration: 0.42, ease: 'power2.out' },
        0
      );

      els.forEach((el, i) => {
        const m = MOTIONS[i];
        tl.to(
          el,
          {
            xPercent:  m.to.xPercent,
            yPercent:  m.to.yPercent,
            rotation:  m.to.rotation,
            scale:     m.to.scale,
            autoAlpha: 1,
            duration:  m.duration,
            ease:      m.ease,
          },
          m.delay
        );
      });

      tlRef.current = tl;
      return () => { tlRef.current = null; };
    },
    { scope: cardRef, dependencies: [mapped.length] }
  );

  const handleEnter = contextSafe(() => tlRef.current?.play());
  const handleLeave = contextSafe(() => tlRef.current?.reverse());

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className={`relative isolate w-full max-w-[38rem] aspect-[4/5] rounded-[2.6rem] bg-[#ebebeb] overflow-hidden cursor-pointer ${className}`}
      tabIndex={0}
      aria-label={`${label} ${title}`}
    >
      <div className="relative w-full h-full pb-[7rem]">

        {/* Secundarias — detrás, en las orillas */}
        {mapped.map((src, i) => (
          <div
            key={`${src}-${i}`}
            ref={(el) => { secondaryRefs.current[i] = el; }}
            className="absolute inset-0 will-change-transform"
            aria-hidden="true"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 92vw, 38rem"
              className="pointer-events-none select-none object-contain"
            />
          </div>
        ))}

        {/* Principal — ocupa toda la card, siempre al frente */}
        <div
          ref={mainImageRef}
          className="absolute inset-0 will-change-transform"
          style={{ zIndex: 10 }}
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 92vw, 38rem"
            className="pointer-events-none select-none object-contain"
            priority
          />
        </div>

        {/* Label */}
        <div className="absolute left-[2.4rem] right-[2.4rem] bottom-[2rem] pointer-events-none" style={{ zIndex: 20 }}>
          <p className="m-0 text-[2.2rem] leading-none tracking-[-0.02em] text-black [font-family:var(--font-inter)]">
            {label}
          </p>
          <h3 className="m-0 mt-[0.8rem] text-[2.6rem] font-bold leading-[1.02] tracking-[-0.02em] text-black [font-family:var(--font-montserrat)]">
            {title}
          </h3>
        </div>

      </div>
    </div>
  );
};

export default HoverCollectionCard;