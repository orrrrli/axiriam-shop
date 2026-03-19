'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/Footer';
import ImageLoader from '@/components/ImageLoader';
import ProductShowcaseGrid from '@/components/ProductShowcaseGrid';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/helpers';
import { toast } from 'react-hot-toast';
import type { Product } from '@/types/product';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const items = useCartStore((state) => state.items);
  const isInBasket = items.some((item) => item.id === id);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          setError('Product not found');
          return;
        }
        const data = await res.json();
        setProduct(data.product);
        setSelectedImage(data.product?.image || '');
      } catch {
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch recommended
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch('/api/products?limit=6');
        const data = await res.json();
        // Exclude current product
        const filtered = (data.products || []).filter(
          (p: Product) => (p._id || p.id) !== id
        );
        setRecommendedProducts(filtered.slice(0, 6));
      } catch {
        // silent fail
      }
    };

    fetchRecommended();
  }, [id]);

  const handleAddToBasket = () => {
    if (!product) return;

    if (isInBasket) {
      removeItem(id);
      toast.success(`${product.name} removed from basket`);
    } else {
      addItem({
        id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      toast.success(`${product.name} added to basket`);
    }
  };

  return (
    <main className="content !p-0 !block !min-h-0">
      <Navbar />
      <div className="w-full pt-[10rem] px-[5rem] max-xs:pt-[8.5rem] max-xs:px-[1.6rem]">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-[15rem]">
            <h4 className="text-heading text-[1.6rem] mb-[1rem]">Loading Product...</h4>
            <Loader2 className="animate-spin-slow text-heading" size={30} />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-[15rem]">
            <h3 className="text-heading text-[1.8rem] mb-[1rem]">{error}</h3>
            <Link href="/shop" className="button button-small no-underline">
              Back to Shop
            </Link>
          </div>
        )}

        {/* Product detail */}
        {product && !isLoading && (
          <div className="mx-0 md:mx-[5rem] max-xs:mt-[5rem]">
            {/* Back link */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-[0.8rem] text-heading no-underline text-[1.4rem] mb-[2rem] hover:opacity-70 transition-opacity"
            >
              <ArrowLeft size={16} />
              Back to shop
            </Link>

            {/* Product modal / card */}
            <div className="w-full flex bg-white border border-border max-md:flex-col">
              {/* Main image */}
              <div className="w-[40rem] flex-grow h-auto relative bg-[#f8f8f8] max-xs:w-full max-xs:h-[20rem]">
                <ImageLoader
                  alt={product.name}
                  className="w-full h-full object-contain"
                  src={selectedImage}
                />
              </div>

              {/* Details */}
              <div className="w-[500px] p-[3rem] max-md:w-full max-md:p-[1.6rem] max-md:pb-[3rem]">
                <span className="text-[1.2rem] text-gray-10 italic">
                  {product.brand || product.category}
                </span>
                <h1 className="text-heading text-[2.4rem] mt-0 mb-[0.5rem]">{product.name}</h1>
                <span className="text-[1.4rem] text-paragraph leading-[2.2rem] block">
                  {product.description}
                </span>

                <div className="my-[2rem] h-px bg-border" />

                {/* Rating */}
                {product.averageRating !== undefined && product.averageRating > 0 && (
                  <div className="mb-[1.6rem]">
                    <span className="text-[1.2rem] text-gray-10 block mb-[0.4rem]">Rating</span>
                    <div className="flex items-center gap-[0.5rem]">
                      <span className="text-[1.6rem] text-heading">
                        {'★'.repeat(Math.round(product.averageRating))}
                        {'☆'.repeat(5 - Math.round(product.averageRating))}
                      </span>
                      <span className="text-[1.2rem] text-gray-10">
                        ({product.totalReviews} {product.totalReviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                )}

                {/* Stock status */}
                <div className="mb-[1.6rem]">
                  <span className="text-[1.2rem] text-gray-10 block mb-[0.4rem]">Availability</span>
                  <span
                    className={`text-[1.4rem] font-bold ${
                      product.inStock !== false ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Price */}
                <h1 className="text-heading text-[2.8rem] m-0 mt-[2rem]">
                  {formatPrice(product.price)}
                </h1>

                {/* Add to basket */}
                <div className="flex mt-[1.6rem] max-xs:justify-center">
                  <button
                    className={`button button-small ${
                      isInBasket ? 'button-border button-border-gray' : ''
                    } max-xs:w-full`}
                    onClick={handleAddToBasket}
                    type="button"
                    disabled={product.inStock === false}
                  >
                    {isInBasket ? 'Remove From Basket' : 'Add To Basket'}
                  </button>
                </div>
              </div>
            </div>

            {/* Recommended products */}
            {recommendedProducts.length > 0 && (
              <div className="mt-[10rem] max-xs:mt-[5rem]">
                <div className="flex justify-between items-center mb-[2rem]">
                  <h1 className="text-heading text-[2.4rem] m-0">Recommended</h1>
                  <Link href="/shop" className="underline text-[1.8rem] text-heading">
                    See All
                  </Link>
                </div>
                <ProductShowcaseGrid products={recommendedProducts} skeletonCount={3} />
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
