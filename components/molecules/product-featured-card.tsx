'use client';

import React, { useRef } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ImageLoader from '@/components/atoms/image-loader';
import { useRouter } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Product } from '@/types/product';

interface ProductFeaturedCardProps {
  product: Partial<Product>;
}

// Scale needed to compensate for -1.7deg rotation (covers corners)
const BASE_SCALE = 1.08;
const HOVER_SCALE = 1.14;

const ProductFeaturedCard: React.FC<ProductFeaturedCardProps> = ({ product }) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const productId = product._id || product.id || '';

  // Let GSAP fully own all transforms on imageRef
  useGSAP(
    () => {
      if (!imageRef.current) return;
      gsap.set(imageRef.current, {
        rotation: -1.7,
        scale: BASE_SCALE,
        transformOrigin: 'center center',
      });
    },
    { scope: cardRef }
  );

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      y: -16,
      scale: HOVER_SCALE,
      duration: 0.45,
      ease: 'power2.out',
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      y: 0,
      scale: BASE_SCALE,
      duration: 0.5,
      ease: 'power3.out',
    });
  });

  const onClickItem = () => {
    if (!productId) return;
    router.push(`/catalogo/${productId}`);
  };

  return (
    <SkeletonTheme baseColor="#e1e1e1" highlightColor="#f2f2f2">
      <div
        ref={cardRef}
        onClick={onClickItem}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'pointer', width: '100%' }}
      >
        {/* Rounded card — overflow:hidden clips the rotated+scaled image */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)',
            width: '100%',
            aspectRatio: '408 / 438',
            position: 'relative',
          }}
        >
          <div
            ref={imageRef}
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            {product.image ? (
              <ImageLoader
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Skeleton width="100%" height="100%" />
            )}
          </div>
        </div>

        {/* Text: "Coleccion" + collection/product name bold — matches Figma 24px Inter */}
        <div style={{ marginTop: '1.2rem', paddingLeft: '0.4rem' }}>
          {product.name ? (
            <>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'inherit',
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  color: 'var(--color-heading, #1a1a1a)',
                  lineHeight: 'normal',
                }}
              >
                {product.category ?? 'Coleccion'}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'inherit',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-heading, #1a1a1a)',
                  lineHeight: 'normal',
                }}
              >
                {product.name}
              </p>
            </>
          ) : (
            <>
              <Skeleton width={90} height={16} />
              <Skeleton width={140} height={16} style={{ marginTop: 6 }} />
            </>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProductFeaturedCard;
