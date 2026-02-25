'use client';

import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-[1.2rem] justify-center max-xs:!grid-cols-2">
      {products.length === 0
        ? new Array(12).fill({}).map((_, index) => (
            <ProductCard key={`skeleton-${index}`} product={{}} />
          ))
        : products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
    </div>
  );
};

export default ProductGrid;
