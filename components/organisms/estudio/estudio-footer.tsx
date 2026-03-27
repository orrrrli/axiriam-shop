'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo', href: '/catalogo' },
  { label: 'Estudio', href: '/estudio' },
  { label: 'Comunidad', href: '/nosotros' },
];

export default function EstudioFooter(): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth <= 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <footer
      style={{
        background: '#101010',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        width: '100%',
        padding: isMobile ? '4rem 2.8rem' : '4rem 8rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '3.2rem' : '0',
        }}
      >
        {/* Logo + tagline */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#ffffff',
              margin: 0,
              marginBottom: '0.4rem',
            }}
          >
            AXIRIAM
          </p>
          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: '1.2rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
            }}
          >
            Gorros Quirúrgicos de Alta Calidad
          </p>
        </div>

        {/* Nav links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1.2rem' : '2.4rem',
          }}
          aria-label="Footer navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: '1.3rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)';
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social icons + copyright */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '1.6rem' : '2rem',
          }}
        >
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '1.2rem' }}>
            {[
              { icon: <Instagram size={16} />, label: 'Instagram', href: '#' },
              { icon: <Facebook size={16} />, label: 'Facebook', href: '#' },
              { icon: <Twitter size={16} />, label: 'Twitter', href: '#' },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3.2rem',
                  height: '3.2rem',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'rgba(255,255,255,0.4)';
                  el.style.color = 'rgba(255,255,255,0.85)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'rgba(255,255,255,0.12)';
                  el.style.color = 'rgba(255,255,255,0.4)';
                }}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: '1.15rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.25)',
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} Axiriam
          </p>
        </div>
      </div>
    </footer>
  );
}
