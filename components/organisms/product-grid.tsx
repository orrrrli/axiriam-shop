'use client';

import React from 'react';
import ProductCard from '@/components/molecules/product-card';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  imageClassOverrides?: Record<string, string>;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, imageClassOverrides }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[2.8rem] max-xs:grid-cols-2">
      {products.length === 0
        ? new Array(12).fill({}).map((_, index) => (
            <ProductCard key={`skeleton-${index}`} product={{}} />
          ))
        : products.map((product) => {
            const id = product._id || product.id || '';
            return (
              <ProductCard
                key={id}
                product={product}
                imageClassName={imageClassOverrides?.[id]}
              />
            );
          })}
    </div>
  );
};

export default ProductGrid;
