'use client';

import React, { useEffect, useRef } from 'react';
import { Coffee, Leaf, Heart, Bird } from 'lucide-react';

const AboutSection = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const element = document.getElementById('story');
      
      if (element && imageRef.current && textRef.current) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementScrollPosition = scrollPosition - elementTop;
        
        if (elementScrollPosition > -400 && elementScrollPosition < 600) {
          imageRef.current.style.transform = `translateY(${elementScrollPosition * 0.1}px)`;
          const opacity = Math.min(1, (elementScrollPosition + 400) / 400);
          textRef.current.style.opacity = opacity.toString();
          textRef.current.style.transform = `translateY(${20 - (opacity * 20)}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Coffee, title: 'Premium Beans', description: 'We source only the highest quality beans from sustainable farms around the world.' },
    { icon: Leaf, title: 'Eco-Friendly', description: 'Our packaging and practices are designed to minimize environmental impact.' },
    { icon: Heart, title: 'Crafted with Love', description: 'Every cup is prepared by our passionate baristas who are dedicated to their craft.' },
    { icon: Bird, title: 'Free as a Bird', description: 'We believe in freedom of expression through coffee, with unique flavors and blends.' }
  ];

  return (
    <div id="story" className="section-padding bg-brown-900 text-white overflow-hidden">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] overflow-hidden rounded-lg" ref={imageRef}>
            <img 
              src="https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
              alt="Coffee Beans" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brown-900/70 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full p-8">
              <h3 className="text-2xl font-heading font-medium mb-2 text-cream-200">Our Story</h3>
              <p className="text-cream-100">From bean to cup, we're dedicated to excellence</p>
            </div>
          </div>
          
          <div ref={textRef} className="opacity-0 transition-all duration-700">
            <div className="mb-6">
              <span className="text-cream-400 uppercase tracking-wider font-medium text-sm">About Bean Haven Café</span>
              <h2 className="text-3xl md:text-4xl font-heading mb-4 text-white">Your Neighborhood Coffee Haven</h2>
              <p className="text-cream-200 mb-6">
                Founded in 2020, Bean Haven Café was born from a passion for exceptional coffee and a desire to create 
                a welcoming space where quality meets community.
              </p>
              <p className="text-cream-200 mb-8">
                Our journey began with a simple idea: to source the finest coffee beans from around the world and 
                create a haven where every customer feels at home. From our carefully crafted espresso drinks to our 
                freshly baked pastries, everything is made with love and attention to detail.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start p-4 rounded-lg transition-all duration-300 hover:bg-brown-800">
                    <div className="flex-shrink-0 bg-cream-500 text-brown-900 p-2 rounded-full mr-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-cream-200 mb-1">{feature.title}</h3>
                      <p className="text-cream-300 text-sm">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
