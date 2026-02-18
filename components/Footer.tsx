'use client';

import React from 'react';
import Link from 'next/link';
import { Coffee, Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone, Wind as Wing } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brown-900 text-cream-100">
      <div className="container mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center mb-6">
              <div className="relative">
                <Coffee className="h-8 w-8 text-cream-300" />
                <Wing className="h-5 w-5 text-cream-500 absolute -top-1 -right-2 transform rotate-12" />
                <Wing className="h-5 w-5 text-cream-500 absolute -top-1 -left-2 transform -scale-x-100 rotate-12" />
              </div>
              <span className="ml-2 text-2xl font-heading font-semibold text-cream-200">Bean Haven Café</span>
            </div>
            <p className="text-cream-300 mb-6">
              Your neighborhood coffee haven, serving premium beans and artisan pastries with warm hospitality since 2020.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" aria-label="Instagram" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-medium mb-6 text-cream-200">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/#menu" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">Our Menu</Link></li>
              <li><Link href="/#story" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">About Us</Link></li>
              <li><Link href="/#locations" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">Locations</Link></li>
              <li><Link href="/profile" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">My Orders</Link></li>
              <li><Link href="/cart" className="text-cream-400 hover:text-cream-200 transition-colors duration-300">Shopping Cart</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-heading font-medium mb-6 text-cream-200">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cream-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-cream-300">123 Coffee Lane<br />Seattle, WA 98101</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cream-400 mr-3 flex-shrink-0" />
                <span className="text-cream-300">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cream-400 mr-3 flex-shrink-0" />
                <span className="text-cream-300">hello@beanhavencafe.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-heading font-medium mb-6 text-cream-200">Join Our Newsletter</h3>
            <p className="text-cream-300 mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  aria-label="Email for newsletter"
                  className="flex-grow p-3 bg-brown-800 border border-brown-700 rounded-l-lg focus:ring-2 focus:ring-cream-500 focus:border-transparent outline-none transition text-cream-100"
                />
                <button 
                  type="submit" 
                  className="bg-cream-500 text-brown-900 px-4 rounded-r-lg font-medium hover:bg-cream-400 transition-colors duration-300"
                >
                  Join
                </button>
              </div>
            </form>
            <p className="text-cream-400 text-sm">
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-brown-800 text-center">
          <p className="text-cream-400 text-sm">
            &copy; {new Date().getFullYear()} Bean Haven Café. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
