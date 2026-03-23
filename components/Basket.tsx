'use client';

import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ImageLoader from './ImageLoader';
import { useCartStore, CartItem } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/helpers';
import { useRouter } from 'next/navigation';

interface BasketProps {
  isOpen: boolean;
  onClose: () => void;
}

const Basket: React.FC<BasketProps> = ({ isOpen, onClose }) => {
  const items         = useCartStore((state) => state.items);
  const clearCart     = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const router        = useRouter();

  const onCheckOut = () => {
    if (items.length === 0) return;
    onClose();
    router.push('/checkout');
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-[59] bg-black transition-opacity duration-300
          ${isOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* ── Drawer ── */}
      <div
        className={`
          fixed top-0 right-0 h-screen z-[60]
          w-[46rem] max-xs:w-full
          bg-white flex flex-col
          shadow-[-20px_0_60px_rgba(0,0,0,0.1)]
          transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-[2.4rem] py-[2rem] border-b border-[#f0f0f0] shrink-0">
          <div className="flex items-center gap-[1rem]">
            <ShoppingBag size={18} strokeWidth={1.8} className="text-[#101010]" />
            <span className="text-[1.6rem] font-semibold text-[#101010] [font-family:var(--font-inter)]">
              Mi carrito
            </span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center w-[2.2rem] h-[2.2rem] rounded-full bg-[#101010] text-white text-[1.1rem] font-bold [font-family:var(--font-inter)]">
                {totalItems}
              </span>
            )}
          </div>

          <div className="flex items-center gap-[1.2rem]">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="flex items-center gap-[0.4rem] text-[1.2rem] text-[rgba(0,0,0,0.4)] hover:text-[#e53e3e] transition-colors duration-150 [font-family:var(--font-inter)]"
              >
                <Trash2 size={13} strokeWidth={1.8} />
                Vaciar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-[3.2rem] h-[3.2rem] rounded-full bg-[#f5f5f5] flex items-center justify-center hover:bg-[#ebebeb] transition-colors duration-150"
            >
              <X size={15} strokeWidth={2} className="text-[#101010]" />
            </button>
          </div>
        </div>

        {/* ── Items list ── */}
        <div className="flex-1 overflow-y-auto px-[2.4rem] py-[2rem]">

          {/* Empty state */}
          {items.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-[1.6rem] text-center">
              <div className="w-[6rem] h-[6rem] rounded-full bg-[#f5f5f5] flex items-center justify-center">
                <ShoppingBag size={26} strokeWidth={1.5} className="text-[rgba(0,0,0,0.3)]" />
              </div>
              <div>
                <p className="text-[1.6rem] font-semibold text-[#101010] m-0 [font-family:var(--font-inter)]">
                  Tu carrito está vacío
                </p>
                <p className="text-[1.3rem] text-[rgba(0,0,0,0.4)] mt-[0.4rem] [font-family:var(--font-inter)]">
                  Agrega productos desde el catálogo
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-[2rem] py-[1rem] rounded-full bg-[#101010] text-white text-[1.3rem] font-medium [font-family:var(--font-inter)]"
              >
                Ver catálogo
              </button>
            </div>
          )}

          {/* Items */}
          {items.length > 0 && (
            <div className="flex flex-col gap-[0.8rem]">
              {items.map((item) => (
                <BasketItem key={item.id} item={item} onClose={onClose} />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer / checkout ── */}
        {items.length > 0 && (
          <div className="shrink-0 px-[2.4rem] py-[2.4rem] border-t border-[#f0f0f0] bg-white">
            <div className="flex items-center justify-between mb-[0.6rem]">
              <span className="text-[1.3rem] text-[rgba(0,0,0,0.5)] [font-family:var(--font-inter)]">
                Subtotal
              </span>
              <span className="text-[2rem] font-bold text-[#101010] [font-family:var(--font-inter)]">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <p className="text-[1.2rem] text-[rgba(0,0,0,0.35)] mb-[2rem] [font-family:var(--font-inter)]">
              Envío calculado en el siguiente paso
            </p>

            <button
              type="button"
              onClick={onCheckOut}
              className="
                w-full flex items-center justify-center gap-[0.8rem]
                py-[1.5rem] rounded-[1rem] bg-[#101010] text-white
                text-[1.4rem] font-semibold tracking-tight
                hover:bg-[#222] active:scale-[0.99]
                transition-all duration-200
                [font-family:var(--font-inter)]
              "
            >
              Ir al checkout
              <ArrowRight size={16} strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-[1rem] py-[1.2rem] text-[1.3rem] text-[rgba(0,0,0,0.45)] hover:text-[#101010] transition-colors duration-150 [font-family:var(--font-inter)]"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// BasketItem
// ─────────────────────────────────────────────

interface BasketItemProps {
  item: CartItem;
  onClose: () => void;
}

const BasketItem: React.FC<BasketItemProps> = ({ item, onClose }) => {
  const removeItem     = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  return (
    <div className="
      flex items-center gap-[1.4rem] p-[1.2rem]
      rounded-[1.2rem] bg-[#fafafa] border border-[#f0f0f0]
      hover:border-[#e0e0e0] hover:bg-[#f7f7f7]
      transition-all duration-200
    ">
      {/* Image */}
      <Link
        href={`/catalogo/${item.id}`}
        onClick={onClose}
        className="shrink-0 w-[7rem] h-[7rem] rounded-[0.8rem] bg-white border border-[#eee] overflow-hidden flex items-center justify-center"
      >
        <ImageLoader
          alt={item.name}
          src={item.image}
          className="w-full h-full object-contain p-[0.6rem]"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={`/catalogo/${item.id}`} onClick={onClose} className="no-underline">
          <p className="text-[1.35rem] font-semibold text-[#101010] truncate m-0 leading-snug [font-family:var(--font-source-sans)] hover:underline">
            {item.name}
          </p>
        </Link>
        <p className="text-[1.15rem] text-[rgba(0,0,0,0.4)] mt-[0.2rem] capitalize m-0 [font-family:var(--font-inter)]">
          {item.category}
        </p>

        {/* Qty + price */}
        <div className="flex items-center justify-between mt-[1rem]">
          {/* Stepper */}
          <div className="flex items-center rounded-full border border-[#e8e8e8] bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-[3rem] h-[3rem] flex items-center justify-center text-[#101010] hover:bg-[#f5f5f5] disabled:opacity-30 transition-colors duration-150"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span className="w-[3rem] text-center text-[1.3rem] font-semibold text-[#101010] [font-family:var(--font-inter)]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-[3rem] h-[3rem] flex items-center justify-center text-[#101010] hover:bg-[#f5f5f5] transition-colors duration-150"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Price */}
          <span className="text-[1.4rem] font-bold text-[#101010] [font-family:var(--font-inter)]">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => removeItem(item.id)}
        className="shrink-0 w-[3rem] h-[3rem] rounded-full flex items-center justify-center text-[rgba(0,0,0,0.3)] hover:text-[#e53e3e] hover:bg-[#fff0f0] transition-all duration-150"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
};

export default Basket;
