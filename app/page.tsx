'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/organisms/navbar';
import Footer from '@/components/organisms/footer';
import HeroSection from '@/components/organisms/hero-section';
import ProductShowcaseGrid from '@/components/organisms/product-showcase-grid';
import type { Product } from '@/types/product';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);

  useEffect(() => {
    fetchFeatured();
    fetchRecommended();
  }, []);

  const fetchFeatured = async () => {
    try {
      setIsLoadingFeatured(true);
      const res = await fetch('/api/products?featured=true&limit=6');
      const data = await res.json();
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      setIsLoadingRecommended(true);
      const res = await fetch('/api/products?limit=6');
      const data = await res.json();
      setRecommendedProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch recommended products:', error);
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  return (
    <main className="content !p-0 !block !min-h-0">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      <div className="w-full px-[10rem] max-xs:px-[1.6rem]">
        {/* Featured Products */}
        <div className="mt-[10rem] mx-[5rem] max-xs:mx-0 max-xs:mt-[5rem]">
          <div className="flex justify-between items-center mb-[2rem]">
            <h1 className="text-heading text-[2.4rem] m-0">Featured Products</h1>
            <Link href="/catalogo?filter=featured" className="underline text-[1.8rem] text-heading">
              See All
            </Link>
          </div>
          <ProductShowcaseGrid
            products={featuredProducts}
            skeletonCount={6}
          />
        </div>

        {/* Recommended Products */}
        <div className="mt-[10rem] mx-[5rem] max-xs:mx-0 max-xs:mt-[5rem]">
          <div className="flex justify-between items-center mb-[2rem]">
            <h1 className="text-heading text-[2.4rem] m-0">Recommended Products</h1>
            <Link href="/catalogo" className="underline text-[1.8rem] text-heading">
              See All
            </Link>
          </div>
          <ProductShowcaseGrid
            products={recommendedProducts}
            skeletonCount={6}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
