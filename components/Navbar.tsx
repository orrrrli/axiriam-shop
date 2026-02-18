'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, Wind as Wing, X, Menu, ShoppingCart, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { getDemoSession, demoSignOut } from '@/lib/demoAuth';
import { useRouter } from 'next/navigation';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [demoUser, setDemoUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (DEMO_MODE) {
      const demoSession = getDemoSession();
      setDemoUser(demoSession?.user || null);
    }
  }, []);

  const currentSession = DEMO_MODE ? (demoUser ? { user: demoUser } : null) : session;

  const handleSignOut = () => {
    if (DEMO_MODE) {
      demoSignOut();
      setDemoUser(null);
      router.push('/');
      router.refresh();
    } else {
      signOut();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-cream-50 shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative">
              <Coffee className="h-8 w-8 text-brown-700" />
              <Wing className="h-5 w-5 text-cream-500 absolute -top-1 -right-2 transform rotate-12" />
              <Wing className="h-5 w-5 text-cream-500 absolute -top-1 -left-2 transform -scale-x-100 rotate-12" />
            </div>
            <span className="ml-2 text-2xl font-heading font-semibold text-brown-800">Bean Haven Café</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/#menu" className="nav-link text-brown-800 hover:text-brown-600">Menu</Link>
            <Link href="/#story" className="nav-link text-brown-800 hover:text-brown-600">Our Story</Link>
            <Link href="/#locations" className="nav-link text-brown-800 hover:text-brown-600">Locations</Link>
            <Link href="/#contact" className="nav-link text-brown-800 hover:text-brown-600">Contact</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative text-brown-800 hover:text-brown-600">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-brown-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {currentSession ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile" className="flex items-center space-x-1 text-brown-800 hover:text-brown-600">
                  <User className="h-5 w-5" />
                  <span>{currentSession.user?.name}</span>
                </Link>
                {currentSession.user?.role === 'admin' && (
                  <Link href="/admin/dashboard" className="btn btn-secondary text-sm">
                    Admin
                  </Link>
                )}
                <button onClick={handleSignOut} className="text-brown-800 hover:text-brown-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="btn btn-primary">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-brown-800 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cream-50 absolute top-full left-0 w-full shadow-md">
          <div className="container mx-auto py-4 px-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/#menu" className="text-brown-800 py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Menu
              </Link>
              <Link href="/#story" className="text-brown-800 py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Our Story
              </Link>
              <Link href="/#locations" className="text-brown-800 py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Locations
              </Link>
              <Link href="/#contact" className="text-brown-800 py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
              <Link href="/cart" className="text-brown-800 py-2 font-medium flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({getTotalItems()})
              </Link>
              {currentSession ? (
                <>
                  <Link href="/profile" className="text-brown-800 py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  {currentSession.user?.role === 'admin' && (
                    <Link href="/admin/dashboard" className="text-brown-800 py-2 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="text-brown-800 py-2 font-medium text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="btn btn-primary w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
