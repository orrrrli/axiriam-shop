'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, LogOut, Search } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { getDemoSession, demoSignOut } from '@/lib/demoAuth';
import { useRouter } from 'next/navigation';
import Badge from './Badge';
import SearchBar from './SearchBar';
import { useBasketToggle } from './providers/BasketProvider';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navbar = useRef<HTMLElement>(null);
  const { data: session } = useSession();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [demoUser, setDemoUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { openBasket } = useBasketToggle();

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

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll handler for desktop
  useEffect(() => {
    const handleScroll = () => {
      if (navbar.current && window.innerWidth > 480) {
        setIsScrolled(window.pageYOffset >= 70);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable basket on certain paths
  const basketDisabledPaths = ['/checkout', '/auth/signin', '/auth/signup'];

  // Hide nav for admin
  if (currentSession?.user?.role === 'admin' && pathname.startsWith('/admin')) {
    return null;
  }

  // Mobile Navigation
  if (isMobile) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-white z-navigation shadow-[0_5px_10px_rgba(0,0,0,0.1)]">
        {/* Top row */}
        <div className="flex items-center h-[50px] px-[1.2rem]">
          <div className="flex-grow pl-2 mr-[4.8rem]">
            <Link href="/" className="no-underline">
              <h2 className="text-heading text-[1.8rem] m-0">AXIRIAM</h2>
            </Link>
          </div>

          <button
            className="bg-transparent border-none text-heading relative p-[1rem_1.6rem]"
            disabled={basketDisabledPaths.includes(pathname)}
            onClick={openBasket}
            type="button"
          >
            <Badge count={getTotalItems()}>
              <ShoppingBag size={20} />
            </Badge>
          </button>

          <ul className="h-full flex items-center m-0 p-0 list-none">
            {currentSession ? (
              <li className="h-full flex items-center justify-center list-none">
                <Link href="/profile" className="text-heading p-[1rem] no-underline">
                  <User size={20} />
                </Link>
              </li>
            ) : (
              pathname !== '/auth/signin' && (
                <li className="h-full flex items-center justify-center list-none">
                  <Link
                    className="text-heading p-[1rem] no-underline text-[1.2rem] uppercase font-bold"
                    href="/auth/signin"
                  >
                    Sign In
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Bottom row */}
        <div className="flex items-center px-[1.2rem] py-[5px]">
          <SearchBar />
        </div>
      </nav>
    );
  }

  // Desktop Navigation
  return (
    <nav
      ref={navbar}
      className={`w-full flex items-center px-[5rem] absolute top-0 z-navigation transition-all duration-300 ease-bezier
        ${isScrolled
          ? 'fixed h-[6rem] pt-[0.5rem] bg-white shadow-[0_5px_10px_rgba(0,0,0,0.02)] animate-slide-down'
          : 'h-[100px] pt-[3rem] bg-body'
        }`}
    >
      {/* Logo */}
      <div className="h-inherit mr-[2rem]">
        <Link href="/" className="block h-full no-underline">
          <h2 className="text-heading text-[2rem] m-0 whitespace-nowrap">AXIRIAM</h2>
        </Link>
      </div>

      {/* Main nav links */}
      <ul className="pl-0 mr-[2rem] flex-grow list-none m-0">
        <li className="inline-block">
          <Link
            href="/"
            className={`px-[15px] py-[10px] text-[1.4rem] no-underline hover:bg-body-alt transition-colors
              ${pathname === '/' ? 'font-bold opacity-100' : 'opacity-50'}`}
          >
            Home
          </Link>
        </li>
        <li className="inline-block">
          <Link
            href="/catalogo"
            className={`px-[15px] py-[10px] text-[1.4rem] no-underline hover:bg-body-alt transition-colors
              ${pathname === '/catalogo' || pathname.startsWith('/catalogo') ? 'font-bold opacity-100' : 'opacity-50'}`}
          >
            Shop
          </Link>
        </li>
      </ul>

      {/* Search + Filter (show on shop page) */}
      {(pathname === '/catalogo' || pathname.startsWith('/catalogo')) && (
        <SearchBar />
      )}

      {/* Right menu */}
      <ul className="flex items-center justify-end p-0 m-0 list-none">
        {/* Basket */}
        <li className="inline-block list-none">
          <button
            className="bg-transparent border-none text-heading relative p-[1rem_1.6rem] cursor-pointer hover:bg-body-alt transition-colors"
            disabled={basketDisabledPaths.includes(pathname)}
            onClick={openBasket}
            type="button"
          >
            <Badge count={getTotalItems()}>
              <ShoppingBag size={24} />
            </Badge>
          </button>
        </li>

        {/* User section */}
        {currentSession ? (
          <li className="inline-block list-none">
            <div className="flex items-center ml-[5.6rem]">
              <Link href="/profile" className="text-heading no-underline flex items-center gap-2 hover:bg-body-alt p-[1rem]">
                <User size={20} />
              </Link>
              {currentSession.user?.role === 'admin' && (
                <Link href="/admin/dashboard" className="button button-small ml-2 no-underline text-[1.2rem]">
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="bg-transparent border-none text-heading cursor-pointer p-[1rem] hover:bg-body-alt transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </li>
        ) : (
          <li className="flex items-center ml-[5.6rem] list-none">
            {pathname !== '/auth/signup' && (
              <Link
                className="button button-small no-underline text-[1.2rem]"
                href="/auth/signup"
              >
                Sign Up
              </Link>
            )}
            {pathname !== '/auth/signin' && (
              <Link
                className="button button-small button-muted ml-[1.2rem] no-underline text-[1.2rem]"
                href="/auth/signin"
              >
                Sign In
              </Link>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
