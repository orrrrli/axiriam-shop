'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { formatPrice, calculateTax } from '@/lib/utils/helpers';
import Navbar from '@/components/organisms/navbar';
import StepTracker from '@/components/molecules/step-tracker';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CheckoutStep3() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const { shipping, payment, setPaymentDetails, resetCheckout } = useCheckoutStore();

  const [formData, setFormData] = useState({
    name: payment.name || '',
    cardNumber: payment.cardNumber || '',
    expiry: payment.expiry || '',
    ccv: payment.ccv || '',
    type: payment.type || 'credit' as 'credit' | 'paypal',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Refs for collapsible credit card section
  const creditContainerRef = useRef<HTMLDivElement>(null);
  const creditCheckboxRef = useRef<HTMLDivElement>(null);
  const creditCollapseRef = useRef<HTMLDivElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);

  const subtotal = getTotalPrice();
  const shippingFee = shipping.isInternational ? 50 : 0;
  const tax = calculateTax(subtotal);
  const total = subtotal + shippingFee + tax;

  // Toggle collapse for credit card section
  useEffect(() => {
    const cn = creditContainerRef.current;
    const cb = creditCheckboxRef.current;
    const cl = creditCollapseRef.current;

    if (cb && cn && cl) {
      if (formData.type === 'credit') {
        cn.style.height = `${cb.offsetHeight + cl.offsetHeight}px`;
        cardInputRef.current?.focus();
      } else {
        cn.style.height = `${cb.offsetHeight}px`;
        cardInputRef.current?.blur();
      }
    }
  }, [formData.type]);

  // Guard: redirect if not authenticated
  if (!session) {
    return (
      <div className="content">
        <Navbar />
        <div className="w-full max-w-[70rem] mx-auto py-[10rem] text-center animate-slide-up">
          <h3 className="text-heading text-[2rem] mb-[1rem]">Please Sign In</h3>
          <p className="text-paragraph text-[1.4rem] mb-[3rem]">
            You need to be signed in to proceed.
          </p>
          <Link href="/auth/signin" className="button">Sign In</Link>
        </div>
      </div>
    );
  }

  // Guard: redirect if basket empty or shipping not done
  if (items.length === 0 || !shipping.isDone) {
    router.push('/checkout');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    if (/\D/.test(key) && key !== 'Backspace' && key !== 'Tab' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  const validate = (): boolean => {
    if (formData.type === 'paypal') {
      // PayPal doesn't need card validation
      return true;
    }

    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 4) {
      newErrors.name = 'Name should be at least 4 characters.';
    }
    if (!formData.cardNumber.trim() || formData.cardNumber.length < 13 || formData.cardNumber.length > 19) {
      newErrors.cardNumber = 'Card number should be 13-19 digits.';
    }
    if (!formData.expiry) {
      newErrors.expiry = 'Expiry date is required.';
    }
    if (!formData.ccv || formData.ccv.length < 3 || formData.ccv.length > 4) {
      newErrors.ccv = 'CCV should be 3-4 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoBack = () => {
    // Save payment details (without sensitive data) and go back
    const { cardNumber, ccv, ...rest } = formData;
    setPaymentDetails(rest);
    router.push('/checkout/shipping');
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: shipping.fullName,
          address: shipping.address,
          email: shipping.email,
          phone: shipping.mobile,
          country: shipping.isInternational ? 'International' : 'Domestic',
        },
        paymentMethod: formData.type === 'credit' ? 'stripe' : 'paypal',
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shippingFee,
        totalPrice: total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Order placed successfully!');
        clearCart();
        resetCheckout();
        router.push('/profile/orders');
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <Navbar />
      <div className="w-full animate-slide-up">
        <StepTracker current={3} />

        <div className="w-[70rem] mx-auto max-md:w-full max-md:px-[1.6rem]">
          <h3 className="text-center text-heading text-[2rem] mb-[0.5rem]">
            Payment
          </h3>

          <br />

          <span className="block text-paragraph text-[1.4rem] px-[1rem] mb-[0.5rem]">
            Payment Option
          </span>

          {/* Credit Card Option */}
          <div
            ref={creditContainerRef}
            className={`flex flex-col items-center overflow-hidden transition-all duration-500 ease-in-out
              ${formData.type === 'credit' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            style={{ height: '97px' }}
          >
            {/* Credit card radio */}
            <div className="w-full" ref={creditCheckboxRef}>
              <div className="flex items-center justify-between p-[1.6rem] border border-border bg-[#f1f1f1]">
                <input
                  type="radio"
                  id="modeCredit"
                  name="type"
                  checked={formData.type === 'credit'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({ ...prev, type: 'credit' }));
                    }
                  }}
                  className="mr-[1rem] w-[1.6rem] h-[1.6rem] flex-shrink-0"
                />
                <label htmlFor="modeCredit" className="flex items-center w-full cursor-pointer">
                  <div className="flex-grow ml-[1rem]">
                    <h4 className="m-0 text-heading text-[1.4rem]">Credit Card</h4>
                    <span className="text-gray-10 text-[1.2rem] block mt-[0.3rem]">
                      Pay with Visa, Master Card and other debit or credit card
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Collapsible credit card form */}
            <div
              ref={creditCollapseRef}
              className="w-full p-[1.6rem] border border-border border-t-0 bg-white"
            >
              <span className="block text-center text-paragraph text-[1.2rem] mb-[1rem]">
                Accepted Cards
              </span>
              <div className="flex justify-center gap-[0.5rem] mb-[1.6rem]">
                <span className="text-[1.1rem] px-[0.8rem] py-[0.3rem] bg-border/30 rounded text-gray-10">VISA</span>
                <span className="text-[1.1rem] px-[0.8rem] py-[0.3rem] bg-border/30 rounded text-gray-10">AMEX</span>
                <span className="text-[1.1rem] px-[0.8rem] py-[0.3rem] bg-border/30 rounded text-gray-10">MC</span>
                <span className="text-[1.1rem] px-[0.8rem] py-[0.3rem] bg-border/30 rounded text-gray-10">MAESTRO</span>
              </div>

              {/* Row 1: Name + Card Number */}
              <div className="flex items-start gap-[1.2rem] mb-[1.2rem] max-xs:flex-col">
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * Name on Card
                  </label>
                  <input
                    ref={cardInputRef}
                    name="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="input capitalize"
                  />
                  {errors.name && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * Card Number
                  </label>
                  <input
                    name="cardNumber"
                    type="text"
                    maxLength={19}
                    onKeyDown={handleOnlyNumbers}
                    placeholder="Enter your card number"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.cardNumber && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.cardNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Expiry + CCV */}
              <div className="flex items-start gap-[1.2rem] max-xs:flex-col">
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * Expiry Date
                  </label>
                  <input
                    name="expiry"
                    type="date"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.expiry && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.expiry}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * CCV
                  </label>
                  <input
                    name="ccv"
                    type="text"
                    maxLength={4}
                    onKeyDown={handleOnlyNumbers}
                    placeholder="****"
                    value={formData.ccv}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.ccv && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.ccv}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PayPal Option */}
          <div
            className={`mt-[0.5rem] transition-opacity duration-300
              ${formData.type === 'paypal' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
          >
            <div className="flex items-center justify-between p-[1.6rem] border border-border bg-[#f1f1f1]">
              <input
                type="radio"
                id="modePayPal"
                name="type"
                checked={formData.type === 'paypal'}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData((prev) => ({ ...prev, type: 'paypal' }));
                  }
                }}
                className="mr-[1rem] w-[1.6rem] h-[1.6rem] flex-shrink-0"
              />
              <label htmlFor="modePayPal" className="flex items-center w-full cursor-pointer">
                <div className="flex-grow ml-[1rem]">
                  <h4 className="m-0 text-heading text-[1.4rem]">PayPal</h4>
                  <span className="text-gray-10 text-[1.2rem] block mt-[0.3rem]">
                    Pay easily, fast and secure with PayPal.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <br />

          {/* Total */}
          <div className="text-right pr-[1rem]">
            <p className="text-paragraph text-[1.4rem] m-0">Total:</p>
            <h2 className="text-heading text-[2.4rem] my-[0.5rem]">
              {formatPrice(total)}
            </h2>
          </div>

          <br />

          {/* Navigation buttons */}
          <div className="flex items-center justify-between max-xs:px-[1.6rem]">
            <button
              className="button button-muted"
              onClick={handleGoBack}
              type="button"
            >
              <ArrowLeft size={14} />
              &nbsp; Go Back
            </button>
            <button
              className="button"
              disabled={loading}
              onClick={handleConfirm}
              type="button"
            >
              <Check size={14} />
              &nbsp;
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
