'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { DiscountType } from '@/types/inventory';

interface DiscountInputProps {
  value: number;
  type: DiscountType;
  onChange: (value: number, type: DiscountType) => void;
  maxAmount?: number;
  disabled?: boolean;
  ariaLabel?: string;
}

interface PopoverPos {
  top: number;
  right: number;
}

export function DiscountInput({
  value,
  type,
  onChange,
  maxAmount,
  disabled = false,
  ariaLabel,
}: DiscountInputProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PopoverPos>({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent): void {
      const target = e.target as Node;
      if (triggerRef.current && triggerRef.current.contains(target)) return;
      if (popoverRef.current && popoverRef.current.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent): void {
      if (e.key === 'Escape') setOpen(false);
    }
    function onScroll(): void {
      setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  function handleTriggerClick(): void {
    if (!triggerRef.current) return;
    if (!open) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setOpen((v) => !v);
  }

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const val = Number(e.target.value) || 0;
    if (type === 'percentage' && val >= 100) return;
    if (type === 'amount' && maxAmount !== undefined && val >= maxAmount) return;
    onChange(val, type);
  }

  function handleTypeSelect(next: DiscountType): void {
    setOpen(false);
    if (next !== type) onChange(0, next);
  }

  return (
    <div className="relative">
      <div className="flex items-stretch rounded-[0.4rem] border border-gray-200 focus-within:border-blue-400 transition-colors duration-150">
        {/* Number input */}
        <input
          type="number"
          value={value || ''}
          onChange={handleValueChange}
          min={0}
          max={
            type === 'percentage'
              ? 99
              : maxAmount !== undefined
                ? Math.max(0, maxAmount - 0.01)
                : undefined
          }
          step={type === 'percentage' ? 1 : 0.01}
          placeholder="0"
          disabled={disabled}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          aria-label={ariaLabel}
          className="min-w-0 w-full bg-transparent px-[0.8rem] py-[0.6rem] text-[1.3rem] text-heading focus:outline-none placeholder:text-gray-400 disabled:opacity-50"
        />

        {/* Dropdown trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={handleTriggerClick}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-[0.3rem] px-[0.6rem] border-l border-gray-200 text-[1.2rem] font-medium text-subtle bg-gray-50 hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 shrink-0"
        >
          <span className="w-[1.2rem] text-center leading-none">
            {type === 'percentage' ? '%' : '$'}
          </span>
          <ChevronDown
            className={`w-[1.2rem] h-[1.2rem] transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Popover — rendered in <body> via portal to escape overflow clipping */}
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ position: 'fixed', top: pos.top, right: pos.right }}
            className="z-[9999] min-w-[15rem] bg-white border border-gray-200 rounded-[0.6rem] shadow-lg py-[0.4rem]"
          >
            {(['percentage', 'amount'] as DiscountType[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleTypeSelect(opt)}
                className="w-full flex items-center gap-[0.8rem] px-[1.2rem] py-[0.8rem] text-[1.3rem] text-heading hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="w-[1.4rem] shrink-0 flex items-center justify-center">
                  {type === opt && <Check className="w-[1.3rem] h-[1.3rem] text-blue-500" />}
                </span>
                <span>{opt === 'percentage' ? '% Porcentaje' : '$ Cantidad'}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
