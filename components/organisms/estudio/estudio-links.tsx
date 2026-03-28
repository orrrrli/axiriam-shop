'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LinkItem {
  label: string;
  href: string;
}

interface Column {
  heading: string;
  links: LinkItem[];
}

interface LinksProps {
  title: string;
  columns: Column[];
}

export default function EstudioLinks({ title, columns }: LinksProps): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = (): void => setIsMobile(window.innerWidth <= 800);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      style={{
        background: '#fafafa',
        borderTop: '1px solid rgba(16,16,16,0.07)',
        width: '100%',
        padding: isMobile ? '6rem 2.8rem' : '8rem 8rem',
      }}
      aria-label="Navegación del estudio"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <p
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#101010',
            margin: 0,
            marginBottom: isMobile ? '3.6rem' : '5rem',
          }}
        >
          {title}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '3.2rem' : '4rem',
          }}
        >
          {columns.map((col) => (
            <div key={col.heading}>
              <p
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(16,16,16,0.4)',
                  margin: 0,
                  marginBottom: '1.6rem',
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
                  gap: '0.8rem',
                }}
              >
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-geist)',
                        fontSize: '1.45rem',
                        fontWeight: 400,
                        color: 'rgba(16,16,16,0.65)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#101010';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(16,16,16,0.65)';
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
    </section>
  );
}
