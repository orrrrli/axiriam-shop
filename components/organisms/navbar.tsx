'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, LogOut, ChevronDown, Scissors, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { getDemoSession, demoSignOut } from '@/lib/demo-auth';
import { useRouter } from 'next/navigation';
import Badge from '@/components/atoms/badge';
import { useBasketToggle } from '@/components/providers/basket-provider';
import { TransitionLink } from '@/components/transitions/navigation-events';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

interface DemoUser {
  name?: string;
  email?: string;
  role?: string;
}

const CATEGORIES = [
  { label: 'Gorros Quirúrgicos', href: '/catalogo?category=gorros' },
  { label: 'Estampados', href: '/catalogo?category=estampados' },
  { label: 'Lisos', href: '/catalogo?category=lisos' },
  { label: 'Edición Limitada', href: '/catalogo?category=limitada' },
];

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

const Navbar = (): React.ReactElement | null => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { openBasket } = useBasketToggle();

  useEffect(() => {
    if (DEMO_MODE) {
      const demoSession = getDemoSession();
      setDemoUser(demoSession?.user ?? null);
    }
  }, []);

  const currentSession = DEMO_MODE ? (demoUser ? { user: demoUser } : null) : session;

  const handleSignOut = (): void => {
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
    const checkMobile = (): void => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = (): void => setIsScrolled(window.pageYOffset >= 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const basketDisabledPaths = ['/checkout', '/auth/signin', '/auth/signup'];
  const isOnShop = pathname === '/catalogo' || pathname.startsWith('/catalogo');
  const isOnAbout = pathname === '/nosotros' || pathname.startsWith('/nosotros');
  const isOnStudio = pathname === '/studio' || pathname.startsWith('/studio');

  if (currentSession?.user?.role === 'admin' && pathname.startsWith('/admin')) {
    return null;
  }

  // Mobile
  if (isMobile) {
    const mobileNavLink = (href: string, label: string, active: boolean, icon?: React.ReactElement) => (
      <TransitionLink
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 16px',
          borderRadius: '12px',
          fontSize: '1.5rem',
          fontWeight: active ? 600 : 500,
          color: active ? '#101010' : 'rgba(0,0,0,0.55)',
          background: active ? 'rgba(0,0,0,0.04)' : 'transparent',
          textDecoration: 'none',
        }}
      >
        {icon}
        {label}
      </TransitionLink>
    );

    return (
      <>
        <nav
          className="nav-island"
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            right: '16px',
            zIndex: 55,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: isScrolled ? '9px 16px' : '12px 20px',
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '9999px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            transition: `padding 0.4s ${EASE}`,
          }}
        >
          <TransitionLink href="/" className="no-underline" style={{ flex: 1 }}>
            <span style={{ color: '#101010', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              AXIRIAM
            </span>
          </TransitionLink>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <button
              style={{ background: 'transparent', border: 'none', color: '#101010', padding: '8px', cursor: 'pointer', position: 'relative', borderRadius: '9999px' }}
              disabled={basketDisabledPaths.includes(pathname)}
              onClick={openBasket}
              type="button"
            >
              <Badge count={getTotalItems()}>
                <ShoppingBag size={20} />
              </Badge>
            </button>

            {currentSession ? (
              <TransitionLink href="/profile" style={{ color: '#101010', padding: '8px', display: 'flex', alignItems: 'center', borderRadius: '9999px' }}>
                <User size={20} />
              </TransitionLink>
            ) : (
              pathname !== '/auth/signin' && (
                <TransitionLink
                  href="/auth/signin"
                  style={{ color: 'white', background: '#101010', borderRadius: '9999px', padding: '6px 16px', fontSize: '1.2rem', fontWeight: 600, textDecoration: 'none' }}
                >
                  Entrar
                </TransitionLink>
              )
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              style={{ background: 'transparent', border: 'none', color: '#101010', padding: '8px', cursor: 'pointer', borderRadius: '9999px', display: 'flex', alignItems: 'center' }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <>
            <div
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 54, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)' }}
            />
            <div
              style={{
                position: 'fixed',
                top: '76px',
                left: '16px',
                right: '16px',
                zIndex: 56,
                background: 'rgba(255,255,255,0.99)',
                borderRadius: '20px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
                border: '1px solid rgba(0,0,0,0.07)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {mobileNavLink('/', 'Inicio', pathname === '/')}
              {mobileNavLink('/catalogo', 'Tienda', isOnShop)}
              <button
                type="button"
                onClick={() => setCategoriesOpen((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: 'rgba(0,0,0,0.55)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                Colecciones
                <ChevronDown size={15} style={{ transition: 'transform 0.25s ease', transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.4 }} />
              </button>
              {categoriesOpen && (
                <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {CATEGORIES.map((cat) => (
                    <TransitionLink
                      key={cat.href}
                      href={cat.href}
                      onClick={() => { setCategoriesOpen(false); setMobileMenuOpen(false); }}
                      style={{ display: 'block', padding: '10px 16px', borderRadius: '10px', fontSize: '1.4rem', fontWeight: 500, color: 'rgba(0,0,0,0.6)', textDecoration: 'none' }}
                      className="hover:bg-[#f5f5f5]"
                    >
                      {cat.label}
                    </TransitionLink>
                  ))}
                </div>
              )}
              {mobileNavLink('/studio', 'Estudio', isOnStudio)}
              {mobileNavLink('/nosotros', 'Comunidad', isOnAbout)}

              {currentSession && (
                <>
                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 8px' }} />
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 500, color: 'rgba(0,0,0,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%' }}
                  >
                    <LogOut size={15} />
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </>
    );
  }

  // Styles for the collapsible links section
  const linksWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    overflow: 'hidden',
    // Animate max-width (numeric → numeric, CSS can interpolate) + opacity
    maxWidth: isScrolled ? '0px' : '700px',
    opacity: isScrolled ? 0 : 1,
    transition: `max-width 0.5s ${EASE}, opacity 0.35s ${EASE}`,
    pointerEvents: isScrolled ? 'none' : 'auto',
  };

  const sepStyle: React.CSSProperties = {
    width: '1px',
    height: '14px',
    background: 'rgba(0,0,0,0.1)',
    flexShrink: 0,
    overflow: 'hidden',
    maxWidth: isScrolled ? '0px' : '1px',
    opacity: isScrolled ? 0 : 1,
    transition: `max-width 0.5s ${EASE}, opacity 0.35s ${EASE}`,
    margin: '0 6px',
  };

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    color: active ? '#101010' : 'rgba(0,0,0,0.45)',
    padding: '6px 12px',
    borderRadius: '9999px',
    fontSize: '1.3rem',
    fontWeight: active ? 600 : 500,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <nav
      className="nav-island"
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 55,
        display: 'flex',
        alignItems: 'center',
        padding: isScrolled ? '8px 16px' : '11px 24px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '9999px',
        boxShadow: isScrolled
          ? '0 4px 20px rgba(0,0,0,0.11)'
          : '0 2px 16px rgba(0,0,0,0.07)',
        color: '#101010',
        // Only animate padding and shadow — NO width animation
        transition: `padding 0.5s ${EASE}, box-shadow 0.4s ${EASE}`,
        whiteSpace: 'nowrap',
      }}
    >
      {/* Logo */}
      <TransitionLink href="/" className="no-underline">
        <span style={{ color: '#101010', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em' }}>
          AXIRIAM
        </span>
      </TransitionLink>

      {/* Collapsible separator + links */}
      <div style={sepStyle} />

      <div style={linksWrapperStyle}>
        <TransitionLink href="/" style={navLinkStyle(pathname === '/')}>
          Inicio
        </TransitionLink>

        <TransitionLink href="/catalogo" style={navLinkStyle(isOnShop)}>
          Tienda
        </TransitionLink>

        {/* Colecciones dropdown */}
        <div ref={categoriesRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            style={navLinkStyle(false)}
            onClick={() => setCategoriesOpen((v) => !v)}
            type="button"
          >
            Colecciones
            <ChevronDown
              size={13}
              style={{
                transition: 'transform 0.25s ease',
                transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                opacity: 0.4,
              }}
            />
          </button>

          {categoriesOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '6px',
              minWidth: '200px',
              zIndex: 56,
            }}>
              {CATEGORIES.map((cat) => (
                <TransitionLink
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setCategoriesOpen(false)}
                  className="hover:bg-[#f5f5f5]"
                  style={{
                    display: 'block',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    fontSize: '1.3rem',
                    fontWeight: 500,
                    color: '#101010',
                    textDecoration: 'none',
                  }}
                >
                  {cat.label}
                </TransitionLink>
              ))}
            </div>
          )}
        </div>

        <TransitionLink
          href="/studio"
          style={{
            ...navLinkStyle(isOnStudio),
            color: isOnStudio ? '#101010' : 'rgba(0,0,0,0.5)',
            background: isOnStudio ? 'rgba(0,0,0,0.05)' : 'transparent',
          }}
        >
          <Scissors size={13} style={{ opacity: 0.65 }} />
          Estudio
        </TransitionLink>

        <TransitionLink href="/nosotros" style={navLinkStyle(isOnAbout)}>
          Comunidad
        </TransitionLink>
      </div>

      {/* Permanent separator */}
      <div style={{ width: '1px', height: '14px', background: 'rgba(0,0,0,0.1)', margin: '0 10px', flexShrink: 0 }} />

      {/* Actions — always visible */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <button
          style={{ background: 'transparent', border: 'none', color: '#101010', padding: '6px 8px', cursor: 'pointer', position: 'relative', borderRadius: '9999px' }}
          disabled={basketDisabledPaths.includes(pathname)}
          onClick={openBasket}
          type="button"
        >
          <Badge count={getTotalItems()}>
            <ShoppingBag size={18} />
          </Badge>
        </button>

        {currentSession ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TransitionLink href="/profile" style={{ color: '#101010', padding: '6px 8px', display: 'flex', alignItems: 'center', borderRadius: '9999px' }}>
              <User size={18} />
            </TransitionLink>
            {currentSession.user?.role === 'admin' && (
              <TransitionLink
                href="/admin/dashboard"
                style={{ color: 'white', background: '#101010', borderRadius: '9999px', padding: '5px 14px', fontSize: '1.2rem', fontWeight: 600, textDecoration: 'none' }}
              >
                Admin
              </TransitionLink>
            )}
            <button
              onClick={handleSignOut}
              style={{ background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', padding: '6px 6px', cursor: 'pointer', borderRadius: '9999px', display: 'flex', alignItems: 'center' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {pathname !== '/auth/signup' && (
              <TransitionLink
                href="/auth/signup"
                style={{ color: 'rgba(0,0,0,0.55)', background: 'rgba(0,0,0,0.04)', borderRadius: '9999px', padding: '5px 16px', fontSize: '1.2rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(0,0,0,0.07)' }}
              >
                Registrarse
              </TransitionLink>
            )}
            {pathname !== '/auth/signin' && (
              <TransitionLink
                href="/auth/signin"
                style={{ color: 'white', background: '#101010', borderRadius: '9999px', padding: '5px 16px', fontSize: '1.2rem', fontWeight: 600, textDecoration: 'none' }}
              >
                Entrar
              </TransitionLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
