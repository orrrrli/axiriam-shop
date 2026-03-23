'use client';

import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ImageLoader from './ImageLoader';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types/product';

interface ProductFeaturedCardProps {
  product: Partial<Product>;
}

const ProductFeaturedCard: React.FC<ProductFeaturedCardProps> = ({ product }) => {
  const router = useRouter();
  const productId = product._id || product.id || '';

  const onClickItem = () => {
    if (!productId) return;
    router.push(`/catalogo/${productId}`);
  };

  return (
    <SkeletonTheme baseColor="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className="w-full max-h-[30rem] border border-border cursor-pointer group"
        onClick={onClickItem}
      >
        {/* Image */}
        <div className="w-full h-[20rem] bg-[#f1f1f1] relative overflow-hidden">
          {product.image ? (
            <ImageLoader
              className="w-full h-full object-contain transition-all duration-500 ease-bezier group-hover:scale-110"
              src={product.image}
              alt={product.name}
            />
          ) : (
            <Skeleton width="100%" height="100%" />
          )}
        </div>

        {/* Details */}
        <div className="p-[2rem]">
          <h2 className="m-0 text-[1.6rem] text-heading">
            {product.name || <Skeleton width={80} />}
          </h2>
          <p className="mt-0 text-[1.2rem] text-gray-10 italic">
            {product.brand || product.category || <Skeleton width={40} />}
          </p>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ProductFeaturedCard;
