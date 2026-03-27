'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface AlertToastProps {
  title?: string;
  message: string;
  onClose: () => void;
}

export default function AlertToast({ title = 'Acción no permitida', message, onClose }: AlertToastProps): React.ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function handleClose(): void {
    setClosing(true);
    setTimeout(() => onClose(), 220);
  }

  if (!mounted) return null;

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    zIndex: 9999,
    width: '440px',
    background: '#1a1a1a',
    borderRadius: '1.25rem',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    fontFamily: 'var(--font-inter), sans-serif',
    transition: 'opacity 200ms ease, transform 200ms ease',
    opacity: visible && !closing ? 1 : 0,
    transform: `translate(-50%, -50%) scale(${visible && !closing ? 1 : 0.92})`,
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9998,
    background: 'rgba(0,0,0,0.4)',
    transition: 'opacity 200ms ease',
    opacity: visible && !closing ? 1 : 0,
  };

  return createPortal(
    <>
      <div style={backdropStyle} onClick={handleClose} />
      <div style={toastStyle}>
        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1.25rem 1.75rem 0.75rem' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(251,191,36,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle style={{ width: 14, height: 14, color: '#fbbf24' }} />
          </div>
          <span style={{ color: '#fbbf24', fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-fustat), sans-serif' }}>
            {title}
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '0.5rem 2.5rem 2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', fontWeight: 300, lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {message}
          </p>

          <button
            type="button"
            onClick={handleClose}
            style={{
              width: '100%',
              background: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.8rem 0',
              fontSize: '1.3rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#1a1a1a',
              fontFamily: 'inherit',
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
