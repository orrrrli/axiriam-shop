'use client';

import React, { useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ImageLoader from '@/components/atoms/image-loader';
import { useCartStore } from '@/lib/store/cartStore';
import { useRouter } from 'next/navigation';
import { Check, ShoppingBag, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice } from '@/lib/utils/helpers';
import {
  getProductViewTransitionNames,
  getStartViewTransition,
  shouldSkipViewTransition,
} from '@/lib/utils/view-transition';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Partial<Product>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const [pressing, setPressing] = useState(false);
  const [isTransitionSource, setIsTransitionSource] = useState(false);

  const productId = product._id || product.id || '';
  const isInBasket = items.some((item) => item.id === productId);
  const isEmpty = !productId;
  const transitionNames = useMemo(() => getProductViewTransitionNames(productId), [productId]);

  const onClickCard = () => {
    if (!productId) return;

    const navigate = () => router.push(`/catalogo/${productId}`);
    const startViewTransition = getStartViewTransition();

    if (!startViewTransition || shouldSkipViewTransition()) {
      navigate();
      return;
    }

    // Usamos flushSync para asegurarnos de que React aplique el view-transition-name
    // en el DOM *antes* de que startViewTransition capture la foto inicial (old).
    flushSync(() => {
      setIsTransitionSource(true);
    });

    startViewTransition(() => {
      navigate();
    });
  };

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPressing(true);
    setTimeout(() => setPressing(false), 200);

    if (isInBasket) {
      useCartStore.getState().removeItem(productId);
      toast.success(`${product.name} eliminado del carrito`);
    } else {
      addItem({
        id: productId,
        name: product.name || '',
        price: product.price || 0,
        image: product.image || '',
        category: product.category || '',
      });
      toast.success(`${product.name} agregado al carrito`);
    }
  };

  return (
    <SkeletonTheme baseColor="#ebebeb" highlightColor="#f5f5f5">
      <div
        onClick={onClickCard}
        style={{
          viewTransitionName: isTransitionSource ? transitionNames.card : 'none',
        }}
        className={`
          group relative flex flex-col rounded-[1.4rem] overflow-hidden bg-white
          transition-all duration-[350ms] ease-out
          ${isEmpty
            ? 'cursor-default border border-[#ebebeb]'
            : `cursor-pointer border
               hover:-translate-y-[6px]
               hover:shadow-[0_20px_48px_rgba(0,0,0,0.11)]
               ${isInBasket
                 ? 'border-[#101010]/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                 : 'border-[#e8e8e8] shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
               }`
          }
        `}
      >
        {/* ── Image area ── */}
        <div
          className="relative w-full aspect-square bg-[#f5f5f5] overflow-hidden"
          style={{
            viewTransitionName: isTransitionSource ? transitionNames.image : 'none',
          }}
        >

          {product.image ? (
            <ImageLoader
              alt={product.name || ''}
              src={product.image}
              className="w-full h-full object-contain p-[1.8rem] transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full"><Skeleton height="100%" /></div>
          )}

          {/* Hover overlay */}
          {!isEmpty && (
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none" />
          )}

          {/* ── Floating CTA pill ── */}
          {!isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                type="button"
                onClick={handleAddToBasket}
                onMouseDown={() => setPressing(true)}
                onMouseUp={() => setPressing(false)}
                className={`
                  pointer-events-auto
                  flex items-center gap-[0.7rem]
                  px-[2rem] py-[1rem] rounded-full
                  text-[1.25rem] font-semibold tracking-tight
                  shadow-[0_8px_24px_rgba(0,0,0,0.18)]
                  transition-all duration-300 ease-out
                  opacity-0 translate-y-[10px] scale-[0.92]
                  group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                  ${pressing ? 'scale-[0.95]' : ''}
                  ${isInBasket
                    ? 'bg-[#101010] text-white'
                    : 'bg-white text-[#101010] hover:bg-[#101010] hover:text-white'
                  }
                `}
              >
                {isInBasket
                  ? <><X size={13} strokeWidth={2.5} /> Quitar</>
                  : <><ShoppingBag size={13} strokeWidth={2} /> Agregar</>
                }
              </button>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="px-[1.4rem] pt-[1.2rem] pb-[1.4rem] flex flex-col gap-[0.3rem]">
          <span className="text-[1.05rem] font-semibold text-[rgba(0,0,0,0.35)] uppercase tracking-[0.08em] [font-family:var(--font-inter)]">
            {product.category || <Skeleton width={60} />}
          </span>

          <p className="text-[1.45rem] font-semibold text-[#101010] leading-snug line-clamp-2 m-0 [font-family:var(--font-source-sans)]">
            {product.name || <Skeleton width={100} />}
          </p>

          <div className="flex items-center justify-between mt-[0.2rem]">
            <span className="text-[1.3rem] text-[rgba(0,0,0,0.5)] [font-family:var(--font-karla)]">
              {product.price
                ? product.brand
                  ? `${product.brand} — ${formatPrice(product.price)}`
                  : formatPrice(product.price)
                : <Skeleton width={80} />}
            </span>

            {/* In-basket indicator */}
            {isInBasket && (
              <span className="flex items-center gap-[0.3rem] text-[1.1rem] font-medium text-[#101010] [font-family:var(--font-inter)]">
                <span className="w-[1.6rem] h-[1.6rem] rounded-full bg-[#101010] flex items-center justify-center">
                  <Check size={9} className="text-white" strokeWidth={3} />
                </span>
                En carrito
              </span>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProductCard;
