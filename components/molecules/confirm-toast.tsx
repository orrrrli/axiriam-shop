'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';

interface ConfirmToastProps {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmToast({ productName, onConfirm, onCancel }: ConfirmToastProps): React.ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  function handleCancel(): void {
    setClosing(true);
    setTimeout(() => onCancel(), 220);
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
      <div style={backdropStyle} onClick={handleCancel} />
      <div style={toastStyle}>
        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1.25rem 1.75rem 0.75rem' }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(248,113,113,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Trash2 style={{ width: 14, height: 14, color: '#f87171' }} />
          </div>
          <span style={{ color: '#f87171', fontSize: '1.5rem', fontWeight: 600, fontFamily: 'var(--font-fustat), sans-serif' }}>
            Eliminar producto
          </span>
        </div>

        {/* Body */}
        <div style={{ padding: '0.5rem 2.5rem 2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.4rem', fontWeight: 300, lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Estás a punto de eliminar el producto{' '}
            <span style={{ color: '#ffffff', fontWeight: 500, fontSize: '1.4rem' }}>
              &ldquo;{productName}&rdquo;
            </span>
            . Esta acción no se puede deshacer.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.8rem 0',
                fontSize: '1.3rem',
                fontWeight: 500,
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'inherit',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              style={{
                flex: 1,
                background: '#ef4444',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.8rem 0',
                fontSize: '1.3rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#ffffff',
                fontFamily: 'inherit',
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
