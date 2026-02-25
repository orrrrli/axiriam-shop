'use client';

import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
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
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const router = useRouter();

  const onCheckOut = () => {
    if (items.length === 0) return;
    onClose();
    router.push('/checkout');
  };

  const onClearBasket = () => {
    if (items.length > 0) clearCart();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[59] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-[60rem] h-screen bg-white z-basket shadow-[-10px_0_15px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-bezier
          max-xs:w-full
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Scrollable list area */}
        <div className="p-[1.6rem] pb-[120px] overflow-y-auto h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center sticky top-[-20px] bg-white z-basket pb-[1rem]">
            <h3 className="flex-grow text-heading text-[1.8rem] m-0">
              My Basket&nbsp;
              <span className="text-[1.4rem] text-gray-10 font-normal">
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            </h3>
            <button
              className="button button-border button-border-gray button-small mr-[1rem]"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
            <button
              className="button button-border button-border-gray button-small"
              disabled={items.length === 0}
              onClick={onClearBasket}
              type="button"
            >
              Clear Basket
            </button>
          </div>

          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex-grow flex justify-center items-center">
              <h5 className="text-gray-10 text-[1.4rem]">Your basket is empty</h5>
            </div>
          )}

          {/* Basket items */}
          {items.map((item) => (
            <BasketItem key={item.id} item={item} onClose={onClose} />
          ))}
        </div>

        {/* Checkout footer */}
        <div className="absolute bottom-0 right-0 w-full bg-white p-[1.6rem] flex items-center justify-between
          before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:mx-auto before:w-[93%] before:h-px before:bg-border">
          <div>
            <p className="text-[1.2rem] text-paragraph m-0">Subtotal Amount:</p>
            <h2 className="text-heading text-[2rem] my-[0.5rem]">
              {formatPrice(getTotalPrice())}
            </h2>
          </div>
          <button
            className="button text-[1.6rem] uppercase px-[3rem] py-[1.6rem]"
            disabled={items.length === 0}
            onClick={onCheckOut}
            type="button"
          >
            Check Out
          </button>
        </div>
      </div>
    </>
  );
};

// --- BasketItem ---

interface BasketItemProps {
  item: CartItem;
  onClose: () => void;
}

const BasketItem: React.FC<BasketItemProps> = ({ item, onClose }) => {
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const onAddQty = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const onMinusQty = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const onRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center border border-border mb-[1.2rem] animate-slide-up">
      {/* Quantity controls */}
      <div className="w-[30px] h-[90px] flex flex-col items-center">
        <button
          className="button button-border button-border-gray w-[35px] h-full p-[5px] !text-[9px]"
          onClick={onAddQty}
          type="button"
        >
          <Plus size={9} />
        </button>
        <button
          className="button button-border button-border-gray w-[35px] h-full p-[5px] !text-[9px]"
          disabled={item.quantity <= 1}
          onClick={onMinusQty}
          type="button"
        >
          <Minus size={9} />
        </button>
      </div>

      {/* Item details */}
      <div className="w-full grid grid-cols-[90px_1fr_80px_40px] items-center px-[1.2rem]">
        {/* Image */}
        <div className="w-[90px] h-[90px] mr-[1.6rem] relative">
          <ImageLoader
            alt={item.name}
            className="w-full h-full object-contain"
            src={item.image}
          />
        </div>

        {/* Name + specs */}
        <div className="flex-grow">
          <Link
            href={`/shop/${item.id}`}
            onClick={onClose}
            className="no-underline"
          >
            <h4 className="underline text-heading text-[1.3rem] my-[0.5rem] w-[142px] whitespace-nowrap overflow-hidden text-ellipsis">
              {item.name}
            </h4>
          </Link>
          <div className="grid grid-cols-2 gap-[0.5rem]">
            <div>
              <span className="text-[1.1rem] text-gray-10 block mb-[0.3rem]">Quantity</span>
              <h5 className="my-0 text-[1.3rem] text-heading">{item.quantity}</h5>
            </div>
            <div>
              <span className="text-[1.1rem] text-gray-10 block mb-[0.3rem]">Category</span>
              <h5 className="my-0 text-[1.3rem] text-heading">{item.category}</h5>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mr-[2rem]">
          <h4 className="my-0 text-[1.4rem] text-heading">
            {formatPrice(item.price * item.quantity)}
          </h4>
        </div>

        {/* Remove */}
        <button
          className="button button-border button-border-gray button-small self-center !p-[0.8rem]"
          onClick={onRemove}
          type="button"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

export default Basket;
