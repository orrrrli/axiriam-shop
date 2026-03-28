'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const LINK_COLUMNS = [
  {
    heading: 'TIENDA',
    links: [
      { label: 'Todos los gorros', href: '/catalogo' },
      { label: 'Gorros estampados', href: '/catalogo' },
      { label: 'Gorros lisos', href: '/catalogo' },
      { label: 'Edición limitada', href: '/catalogo' },
    ],
  },
  {
    heading: 'ESTUDIO',
    links: [
      { label: 'Nuestra historia', href: '/estudio' },
      { label: 'Cómo trabajamos', href: '/estudio' },
      { label: 'Materiales', href: '/estudio' },
      { label: 'Comunidad', href: '/nosotros' },
    ],
  },
  {
    heading: 'AYUDA',
    links: [
      { label: 'Preguntas frecuentes', href: '#' },
      { label: 'Guía de tallas', href: '#' },
      { label: 'Envíos y devoluciones', href: '#' },
      { label: 'Contacto', href: '#' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: <Instagram size={18} />, label: 'Instagram', href: '#' },
  { icon: <Facebook size={18} />, label: 'Facebook', href: '#' },
  { icon: <Twitter size={18} />, label: 'Twitter', href: '#' },
];

export default function Footer(): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <footer style={{ background: '#111111', width: '100%' }}>
      {/* Main area */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: isMobile ? '5rem 2.8rem 4rem' : '7rem 8rem 6rem',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4.8rem' : '0',
        }}
      >
        {/* Left — brand + tagline + social */}
        <div
          style={{
            flex: isMobile ? '1' : '0 0 38%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '2.4rem',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontSize: isMobile ? '3.2rem' : '4rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                lineHeight: 1.05,
                color: '#ffffff',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
              }}
            >
              AXIRIAM
            </p>
            <p
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: '1.2rem',
                fontWeight: 400,
                letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              #GORROSQUIRÚRGICOS
            </p>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '1.6rem', alignItems: 'center' }}>
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)';
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right — link columns */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '3.2rem 2rem' : '0 2rem',
          }}
        >
          {LINK_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.35)',
                  margin: '0 0 2rem 0',
                  textTransform: 'uppercase',
                }}
              >
                {col.heading}
              </p>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                }}
              >
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        fontSize: '1.3rem',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.5)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: isMobile ? '2.4rem 2.8rem' : '2.4rem 8rem',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '1.2rem' : '0',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p
              style={{
                fontFamily: 'var(--font-geist)',
                fontSize: '1.1rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.22)',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              &copy; {new Date().getFullYear()} Axiriam. Todos los derechos reservados.
            </p>
            <p style={{ margin: 0, display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)'; }}
              >
                Términos de uso
              </a>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.1rem' }}>·</span>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-geist)',
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)'; }}
              >
                Política de privacidad
              </a>
            </p>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-geist)',
              fontSize: '1.1rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.22)',
              margin: 0,
            }}
          >
            Desarrollado por{' '}
            <a
              href="https://github.com/orrrrli"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'underline',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'; }}
            >
              AXIRIAM TEAM
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
