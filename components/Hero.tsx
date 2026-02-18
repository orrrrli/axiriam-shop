'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, Coffee } from 'lucide-react';

const Hero = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollRef.current) {
        scrollRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const bgImageUrl = 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750';

  return (
    <div className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div 
          ref={scrollRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        />
        <div className="absolute inset-0 bg-brown-900/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto container-padding relative z-10 text-white">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center">
            <Coffee className="h-6 w-6 mr-2 text-cream-400" />
            <span className="text-cream-300 uppercase tracking-wider font-medium text-sm">Premium Coffee Experience</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold mb-4 text-white leading-tight">
            Your Haven for <br />
            <span className="text-cream-400">Premium Coffee</span>
          </h1>
          <p className="text-lg md:text-xl text-cream-100 mb-8 max-w-2xl">
            Welcome to Bean Haven Café, where every cup is crafted with passion and every visit feels like home. 
            Experience the perfect blend of quality beans and warm hospitality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#menu" className="btn btn-primary">
              Explore Menu
            </Link>
            <Link href="/cart" className="btn btn-outline border-cream-200 text-cream-100 hover:bg-cream-400 hover:text-brown-900 hover:border-cream-400">
              View Cart
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <button 
        onClick={scrollToMenu}
        aria-label="Scroll to menu"
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center animate-bounce"
      >
        <span className="text-sm mb-2">Scroll Down</span>
        <ChevronDown className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Hero;
