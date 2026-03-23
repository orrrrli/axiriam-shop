'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export function SlideOver({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = '52rem',
}: SlideOverProps): React.ReactElement {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-modal transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-modal flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slideover-title"
      >
        {/* Header */}
        <div className="px-[3rem] py-[2rem] border-b border-border flex items-center justify-between shrink-0">
          <h2 id="slideover-title" className="text-heading text-[1.8rem]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-[0.6rem] text-gray-400 hover:text-heading hover:bg-admin-bg rounded-[0.4rem] transition-colors duration-150"
            aria-label="Cerrar"
          >
            <X className="w-[1.8rem] h-[1.8rem]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[3rem] py-[2.4rem]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-[3rem] py-[2rem] border-t border-border shrink-0 flex items-center justify-end gap-[1.2rem]">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
