'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/helpers';
import Navbar from '@/components/organisms/navbar';
import StepTracker from '@/components/molecules/step-tracker';
import ImageLoader from '@/components/atoms/image-loader';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CheckoutStep1() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const subtotal = getTotalPrice();

  // Redirect if not authenticated
  if (!session) {
    return (
      <div className="content">
        <Navbar />
        <div className="w-full max-w-[80rem] mx-auto py-[10rem] text-center animate-slide-up">
          <h3 className="text-heading text-[2rem] mb-[1rem]">Please Sign In</h3>
          <p className="text-paragraph text-[1.4rem] mb-[3rem]">
            You need to be signed in to proceed with checkout.
          </p>
          <Link href="/auth/signin" className="button">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Redirect if basket is empty
  if (items.length === 0) {
    return (
      <div className="content">
        <Navbar />
        <div className="w-full max-w-[80rem] mx-auto py-[10rem] text-center animate-slide-up">
          <h3 className="text-heading text-[2rem] mb-[1rem]">Your basket is empty</h3>
          <p className="text-paragraph text-[1.4rem] mb-[3rem]">
            Add some items to your basket before proceeding to checkout.
          </p>
          <Link href="/catalogo" className="button">
            <ShoppingBag size={16} />
            &nbsp; Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <Navbar />
      <div className="w-full animate-slide-up">
        <StepTracker current={1} />

        <div className="w-[80rem] mx-auto max-md:w-full max-md:px-[1.6rem]">
          <h3 className="text-center text-heading text-[2rem] mb-[0.5rem]">
            Order Summary
          </h3>
          <span className="block text-center text-paragraph text-[1.4rem]">
            Review items in your basket.
          </span>

          <br />

          {/* Basket items */}
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center border border-border mb-[0.5rem] mx-[1rem] max-xs:mx-0"
              >
                {/* Image */}
                <div className="w-[90px] h-[90px] p-[1rem] flex-shrink-0">
                  <ImageLoader
                    alt={item.name}
                    src={item.image}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow px-[1.2rem]">
                  <Link
                    href={`/catalogo/${item.id}`}
                    className="no-underline"
                  >
                    <h4 className="underline text-heading text-[1.3rem] my-[0.3rem]">
                      {item.name}
                    </h4>
                  </Link>
                  <div className="flex gap-[2rem]">
                    <div>
                      <span className="text-[1.1rem] text-gray-10 block">Quantity</span>
                      <h5 className="my-0 text-[1.3rem] text-heading">{item.quantity}</h5>
                    </div>
                    <div>
                      <span className="text-[1.1rem] text-gray-10 block">Size</span>
                      <h5 className="my-0 text-[1.3rem] text-heading">{item.category || '—'}</h5>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="pr-[2rem] flex-shrink-0">
                  <h4 className="my-0 text-[1.4rem] text-heading">
                    {formatPrice(item.price * item.quantity)}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          <br />

          {/* Subtotal */}
          <div className="text-right pr-[1rem]">
            <p className="text-paragraph text-[1.4rem] m-0">Subtotal:</p>
            <h2 className="text-heading text-[2.4rem] my-[0.5rem]">
              {formatPrice(subtotal)}
            </h2>
          </div>

          <br />

          {/* Navigation buttons */}
          <div className="flex items-center justify-between max-xs:px-[1.6rem]">
            <button
              className="button button-muted"
              onClick={() => router.push('/')}
              type="button"
            >
              <ShoppingBag size={14} />
              &nbsp; Continue Shopping
            </button>
            <button
              className="button"
              onClick={() => router.push('/checkout/shipping')}
              type="button"
            >
              Next Step &nbsp;
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
