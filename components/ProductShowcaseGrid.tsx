'use client';

import React from 'react';
import ProductFeaturedCard from './ProductFeaturedCard';
import type { Product } from '@/types/product';

interface ProductShowcaseGridProps {
  products: Product[];
  skeletonCount?: number;
}

const ProductShowcaseGrid: React.FC<ProductShowcaseGridProps> = ({ products, skeletonCount = 4 }) => {
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] gap-[2rem]">
      {products.length === 0
        ? new Array(skeletonCount).fill({}).map((_, index) => (
            <ProductFeaturedCard key={`skeleton-${index}`} product={{}} />
          ))
        : products.map((product) => (
            <ProductFeaturedCard
              key={product._id || product.id}
              product={product}
            />
          ))}
    </div>
  );
};

export default ProductShowcaseGrid;
