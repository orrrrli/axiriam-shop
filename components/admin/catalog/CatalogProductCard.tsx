import Image from 'next/image';
import type { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils/helpers';

interface CatalogProductCardProps {
  product: Product;
}

export default function CatalogProductCard({ product }: CatalogProductCardProps): React.ReactElement {
  return (
    <div className="flex flex-col rounded-[1.2rem] overflow-hidden bg-white border border-border hover:shadow-md transition-shadow duration-200">
      {/* Image area */}
      <div className="relative w-full aspect-square bg-[#f5f5f5] flex items-center justify-center p-[2rem]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-[1.6rem]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-admin-muted text-[1.2rem]">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="px-[1.4rem] py-[1.2rem] flex flex-col gap-[0.4rem]">
        <span className="text-[1.1rem] text-admin-muted capitalize">
          {product.category}
        </span>
        <p className="text-[1.4rem] font-semibold text-heading leading-tight line-clamp-2">
          {product.name}
        </p>
        <span className="text-[1.3rem] text-body">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
}
