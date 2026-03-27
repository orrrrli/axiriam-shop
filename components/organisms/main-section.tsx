'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface Collection {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  secondaryImageUrl: string;
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
    secondaryImageUrl: '/axiriam/collections/fresas.png',
    linkUrl: '/collections/alpaca-premium',
    linkText: 'COMPRAR AHORA',
  },
  {
    id: 'algodon-pima',
    title: 'Algodón Pima',
    description:
      'El algodón más fino del mundo, cultivado en la costa norte del Perú. Textura sedosa, resistencia superior y un acabado que mejora con cada lavado.',
    imageUrl: '/axiriam/collections/fuegos.png',
    secondaryImageUrl: '/axiriam/collections/fuegos.png',
    linkUrl: '/collections/algodon-pima',
    linkText: 'COMPRAR AHORA',
  },
  {
    id: 'lana-merino',
    title: 'Lana Merino',
    description:
      'Regulación térmica natural para todas las estaciones. Liviana, transpirable y con la elegancia que solo la lana merino australiana puede ofrecer.',
    imageUrl: '/axiriam/collections/fuegos.png',
    secondaryImageUrl: '/axiriam/collections/fuegos.png',
    linkUrl: '/collections/lana-merino',
    linkText: 'COMPRAR AHORA',
  },
  {
    id: 'mezclas-signature',
    title: 'Mezclas Signature',
    description:
      'Combinaciones exclusivas de fibras nobles diseñadas por nuestro equipo. Lo mejor de cada material en una sola prenda.',
    imageUrl: '/axiriam/collections/fresas.png',
    secondaryImageUrl: '/axiriam/collections/fresas.png',
    linkUrl: '/collections/mezclas-signature',
    linkText: 'COMPRAR AHORA',
  },
];

interface MainSectionProps {
  slice?: [number, number];
}

interface CollectionCardProps {
  collection: Collection;
  isMobile: boolean;
  /** true → big photo on left, content on right. false → content on left, big photo on right. */
  imageLeft: boolean;
}

function CollectionCard({ collection, isMobile, imageLeft }: CollectionCardProps): React.ReactElement {
  const words = collection.title.split(' ');
  const mid = Math.ceil(words.length / 2);
  const titleLine1 = words.slice(0, mid).join(' ');
  const titleLine2 = words.slice(mid).join(' ');

  const BORDER = '1px solid #e0e0e0';

  /* ── Big editorial photo panel ── */
  const bigPhoto = (
    <div
      style={{
        position: 'relative',
        width: isMobile ? '100%' : '50%',
        flexShrink: 0,
        minHeight: isMobile ? '64vw' : 'auto',
        alignSelf: 'stretch',
        background: '#e8e4df',
        order: isMobile ? 0 : imageLeft ? 0 : 1,
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
  );

  /* ── Content panel (title top + thumbnail/description bottom) ── */
  const contentPanel = (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: isMobile ? 'none' : imageLeft ? BORDER : 'none',
        borderRight: isMobile ? 'none' : imageLeft ? 'none' : BORDER,
        background: '#fafaf8',
        order: isMobile ? 1 : imageLeft ? 1 : 0,
      }}
    >
      {/* ── TOP: large title ── */}
      <div
        style={{
          padding: isMobile ? '4rem 3.2rem 3.2rem' : '5.6rem 5.6rem 4.8rem',
          borderBottom: BORDER,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: isMobile ? 'clamp(3.2rem, 11vw, 5rem)' : 'clamp(4.4rem, 5.5vw, 7rem)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            color: '#101010',
            margin: 0,
          }}
        >
          {titleLine1}
          {titleLine2 && (
            <>
              <br />
              {titleLine2}
            </>
          )}
        </h2>
      </div>

      {/* ── BOTTOM: thumbnail left + description right ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: 'relative',
            width: isMobile ? '40%' : '45%',
            flexShrink: 0,
            minHeight: isMobile ? '44vw' : '28vh',
            borderRight: BORDER,
            background: '#f0ede8',
            alignSelf: 'stretch',
          }}
        >
          <Image
            src={collection.secondaryImageUrl}
            alt={`${collection.title} detalle`}
            fill
            sizes="(max-width: 800px) 40vw, 25vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        {/* Description + arrow */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: isMobile ? '2.4rem 2.4rem 2.4rem' : '4rem 4.8rem 4rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: isMobile ? '1.3rem' : '1.45rem',
              fontWeight: 400,
              lineHeight: 1.75,
              color: 'rgba(0,0,0,0.55)',
              margin: 0,
            }}
          >
            {collection.description}
          </p>

          {/* CTA — bottom right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link
              href={collection.linkUrl}
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: '1.2rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#101010',
                textDecoration: 'underline',
                textUnderlineOffset: '0.4em',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '0.45';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
              }}
            >
              {collection.linkText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <article
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        minHeight: isMobile ? 'auto' : '62vh',
        borderBottom: BORDER,
      }}
    >
      {bigPhoto}
      {contentPanel}
    </article>
  );
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
        const globalIndex = slice ? slice[0] + localIndex : localIndex;
        return (
          <CollectionCard
            key={collection.id}
            collection={collection}
            isMobile={isMobile}
            imageLeft={globalIndex % 2 === 0}
          />
        );
      })}
    </section>
  );
}
