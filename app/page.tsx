'use client';

import React from 'react';
import Navbar from '@/components/organisms/navbar';
import Footer from '@/components/organisms/footer';
import HeroSection from '@/components/organisms/hero-section';
import MainSection from '@/components/organisms/main-section';

import HoverCollectionCard from '@/components/molecules/hover-collection-card';

const featuredHoverCards = [
  {
    title: 'Algodon Premium',
    mainImage: '/axiriam/collections/fuegos-nobg.png',
    secondaryImages: [
      '/axiriam/collections/fresas-nobg.png',
      '/axiriam/collections/elementos-nobg.png',
    ],
  },
  {
    title: 'Elementos Naturales',
    mainImage: '/axiriam/collections/comidas-nobg.png',
    secondaryImages: [
      '/axiriam/collections/fresas-nobg.png',
      '/axiriam/collections/fuegos-nobg.png',
    ],
  },
  {
    title: 'Pima Deluxe',
    mainImage: '/axiriam/collections/fresas-nobg.png',
    secondaryImages: [
      '/axiriam/collections/fuegos-nobg.png',
      '/axiriam/collections/comidas-nobg.png',
    ],
  },
];

export default function Home() {
  return (
    <main className="content !p-0 !block !min-h-0">
      <Navbar />

      {/* 1 — Hero */}
      <HeroSection />
      {/* 3 — Featured Products */}
      <section className="w-full bg-[#f5f4f2] px-[1.6rem] py-[5rem] md:px-[6rem] md:py-[8rem] lg:px-[10rem]">
        <div className="mx-auto w-full max-w-[120rem]">
          <h2 className="m-0 mb-[2.4rem] text-[2.8rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#101010] [font-family:var(--font-montserrat)] md:mb-[3.2rem] md:text-[3.6rem]">
            Productos Destacados
          </h2>

          <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-3 md:gap-[3.6rem]">
            {featuredHoverCards.map((card) => (
              <HoverCollectionCard
                key={card.title}
                title={card.title}
                mainImage={card.mainImage}
                secondaryImages={card.secondaryImages}
              />
            ))}
          </div>
        </div>
      </section>
      {/* 2 — Collections: blocks 1 & 2 (Alpaca Premium + Algodón Pima) */}
      <MainSection slice={[0, 2]} />



      <Footer />
    </main>
  );
}
