'use client';

import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ImageLoader from './ImageLoader';
import { useCartStore } from '@/lib/store/cartStore';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatPrice } from '@/lib/utils/helpers';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Partial<Product>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);

  const productId = product._id || product.id || '';
  const isInBasket = items.some((item) => item.id === productId);

  const onClickItem = () => {
    if (!productId) return;
    router.push(`/shop/${productId}`);
  };

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInBasket) {
      // Remove from basket
      useCartStore.getState().removeItem(productId);
      toast.success(`${product.name} removed from basket`);
    } else {
      addItem({
        id: productId,
        name: product.name || '',
        price: product.price || 0,
        image: product.image || '',
        category: product.category || '',
      });
      toast.success(`${product.name} added to basket`);
    }
  };

  return (
    <SkeletonTheme baseColor="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className={`max-w-[180px] h-[230px] border text-center relative bg-white overflow-hidden group
          ${!productId ? '' : 'cursor-pointer'}
          max-md:h-[200px]`}
        style={{
          borderColor: isInBasket ? '#a6a5a5' : '#e1e1e1',
          boxShadow: isInBasket ? '0 10px 15px rgba(0, 0, 0, .07)' : 'none',
        }}
      >
        {/* Check icon if in basket */}
        {isInBasket && (
          <Check
            size={16}
            className="absolute top-[1rem] right-[1rem] text-success z-[1]"
          />
        )}

        {/* Card content - slides up on hover */}
        <div
          className={`p-0 transition-all duration-[400ms] ease-in-out
            ${productId ? 'group-hover:-translate-y-[10px]' : ''}`}
          onClick={onClickItem}
        >
          {/* Image wrapper */}
          <div
            className={`w-full h-[100px] px-[1.6rem] mx-auto relative bg-[#f6f6f6] transition-all duration-[400ms] ease-in-out
              ${productId ? 'group-hover:h-[8rem] group-hover:p-[1rem]' : ''}
              max-md:h-[8rem]`}
          >
            {product.image ? (
              <ImageLoader
                alt={product.name || ''}
                className="w-full h-full object-contain"
                src={product.image}
              />
            ) : (
              <Skeleton width="100%" height="90%" />
            )}
          </div>

          {/* Details */}
          <div className="p-[1.6rem]">
            <h5 className="w-full h-[20px] m-0 overflow-hidden text-ellipsis text-[1.3rem] text-heading">
              {product.name || <Skeleton width={80} />}
            </h5>
            <p className="mt-0 text-[1.2rem] text-gray-20 italic mb-[0.5rem]">
              {product.brand || product.category || <Skeleton width={60} />}
            </p>
            <h4 className="text-black text-[1.4rem] m-0">
              {product.price ? formatPrice(product.price) : <Skeleton width={40} />}
            </h4>
          </div>
        </div>

        {/* Add to basket button - slides up from bottom on hover */}
        {productId && (
          <button
            className={`absolute -bottom-full text-[1.2rem] transition-all duration-[400ms] ease-in-out w-full
              button button-small
              ${isInBasket ? 'button-border button-border-gray' : ''}
              group-hover:bottom-0
              max-md:hidden`}
            onClick={handleAddToBasket}
            type="button"
          >
            {isInBasket ? 'Remove from basket' : 'Add to basket'}
          </button>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default ProductCard;
