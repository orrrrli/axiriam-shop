'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
}

export const collections: Collection[] = [
  {
    id: 'alpaca-premium',
    title: 'Alpaca Premium',
    description:
      'Fibras de alpaca seleccionadas a mano en los Andes peruanos. Suavidad incomparable, calidez sin peso y durabilidad que trasciende temporadas.',
    imageUrl: '/axiriam/collections/fresas.png',
    linkUrl: '/collections/alpaca-premium',
    linkText: 'COMPRAR AHORA',
  },
  {
    id: 'algodon-pima',
    title: 'Algodón Pima',
    description:
      'El algodón más fino del mundo, cultivado en la costa norte del Perú. Textura sedosa, resistencia superior y un acabado que mejora con cada lavado.',
    imageUrl: '/axiriam/collections/fuegos.png',
    linkUrl: '/collections/algodon-pima',
    linkText: 'COMPRAR AHORA',
  },
  {
    id: 'lana-merino',
    title: 'Lana Merino',
    description:
      'Regulación térmica natural para todas las estaciones. Liviana, transpirable y con la elegancia que solo la lana merino australiana puede ofrecer.',
    imageUrl: '/axiriam/collections/fuegos.png',
    linkUrl: '/collections/lana-merino',
    linkText: 'COMPRAR AHORA',
  },
  {
    id: 'mezclas-signature',
    title: 'Mezclas Signature',
    description:
      'Combinaciones exclusivas de fibras nobles diseñadas por nuestro equipo. Lo mejor de cada material en una sola prenda.',
          imageUrl: '/axiriam/collections/fresas.png',
    linkUrl: '/collections/mezclas-signature',
    linkText: 'COMPRAR AHORA',
  },
];

interface MainSectionProps {
  /**
   * Optional [start, end] indices into the `collections` array (exclusive end).
   * When omitted, all collections are rendered.
   * Example: slice={[0, 2]} renders the first two blocks.
   */
  slice?: [number, number];
}

export default function MainSection({ slice }: MainSectionProps = {}): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth < 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const visibleCollections = slice
    ? collections.slice(slice[0], slice[1])
    : collections;

  return (
    <section className="shop-layout w-full" aria-label="Colecciones destacadas">
      {visibleCollections.map((collection, localIndex) => {
        // Preserve the original left/right alternation based on global position.
        const globalIndex = slice ? slice[0] + localIndex : localIndex;
        const isImageLeft = globalIndex % 2 === 0;

        return (
          <article
            key={collection.id}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              minHeight: isMobile ? 'auto' : '70vh',
              overflow: 'hidden',
            }}
          >
            {/* Image panel */}
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: '#e8e4df',
                /* Mobile: aspect ratio drives height, full width */
                ...(isMobile
                  ? { aspectRatio: '4 / 3', width: '100%', order: 0 }
                  : {
                      /* Desktop: fixed 50% width, self-stretch for full height */
                      width: '50%',
                      flexShrink: 0,
                      alignSelf: 'stretch',
                      order: isImageLeft ? 0 : 1,
                    }),
              }}
            >
              <Image
                src={collection.imageUrl}
                alt={collection.title}
                fill
                sizes="(max-width: 800px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>

            {/* Content panel */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
                padding: isMobile ? '4.8rem 3.2rem' : '8rem',
                flex: 1,
                minWidth: 0,
                order: isMobile ? 1 : isImageLeft ? 1 : 0,
              }}
            >
              <div style={{ maxWidth: '44ch', width: '100%' }}>
                {/* Eyebrow */}
                <p
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    color: 'rgba(0,0,0,0.4)',
                    textTransform: 'uppercase',
                    margin: '0 0 1.6rem',
                  }}
                >
                  Colección
                </p>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: isMobile ? 'clamp(2.8rem, 8vw, 4rem)' : 'clamp(2.8rem, 4vw, 4.8rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: '#101010',
                    margin: '0 0 2rem',
                  }}
                >
                  {collection.title}
                </h2>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-geist)',
                    fontSize: isMobile ? '1.4rem' : '1.55rem',
                    fontWeight: 400,
                    lineHeight: 1.7,
                    color: 'rgba(0,0,0,0.5)',
                    margin: '0 0 3.2rem',
                  }}
                >
                  {collection.description}
                </p>

                {/* CTA — underlined text link, NOT a button */}
                <Link
                  href={collection.linkUrl}
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#101010',
                    textDecoration: 'underline',
                    textUnderlineOffset: '0.4em',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = '0.5';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                  }}
                >
                  {collection.linkText}
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
