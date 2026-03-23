'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import { formatPrice } from '@/lib/utils/helpers';
import Navbar from '@/components/organisms/navbar';
import StepTracker from '@/components/molecules/step-tracker';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CheckoutStep2() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const { shipping, setShippingDetails } = useCheckoutStore();

  const [formData, setFormData] = useState({
    fullName: shipping.fullName || '',
    email: shipping.email || (session?.user?.email ?? ''),
    address: shipping.address || '',
    mobile: shipping.mobile || '',
    isInternational: shipping.isInternational || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getTotalPrice();
  const shippingFee = formData.isInternational ? 50 : 0;
  const total = subtotal + shippingFee;

  // Guard: redirect if not authenticated or basket empty
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

  if (items.length === 0) {
    router.push('/checkout');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (min 2 characters).';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Shipping address is required.';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setShippingDetails({
      fullName: formData.fullName,
      email: formData.email,
      address: formData.address,
      mobile: formData.mobile,
      isInternational: formData.isInternational,
      isDone: true,
    });

    router.push('/checkout/payment');
  };

  return (
    <div className="content">
      <Navbar />
      <div className="w-full animate-slide-up">
        <StepTracker current={2} />

        <div className="w-[70rem] mx-auto max-md:w-full max-md:px-[1.6rem]">
          <h3 className="text-center text-heading text-[2rem] mb-[2rem]">
            Shipping Details
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Shipping form */}
            <div className="w-full">
              {/* Row 1: Full Name + Email */}
              <div className="flex items-start gap-[1.2rem] mb-[1.2rem] max-xs:flex-col">
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input capitalize"
                  />
                  {errors.fullName && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.fullName}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.email && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Address + Mobile */}
              <div className="flex items-start gap-[1.2rem] mb-[1.2rem] max-xs:flex-col">
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * Shipping Address
                  </label>
                  <input
                    name="address"
                    type="text"
                    placeholder="Enter full shipping address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.address && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.address}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                    * Mobile Number
                  </label>
                  <input
                    name="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="input"
                  />
                  {errors.mobile && (
                    <span className="block text-[1.1rem] text-red-500 mt-[0.3rem]">
                      {errors.mobile}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: International Shipping checkbox */}
              <div className="mb-[1.2rem]">
                <label className="block text-[1.2rem] text-paragraph mb-[0.5rem]">
                  Shipping Option
                </label>
                <div className="flex items-center justify-between p-[1.6rem] border border-border bg-[#f1f1f1]">
                  <input
                    id="isInternational"
                    name="isInternational"
                    type="checkbox"
                    checked={formData.isInternational}
                    onChange={handleChange}
                    className="mr-[1rem] w-[1.6rem] h-[1.6rem] flex-shrink-0"
                  />
                  <label
                    htmlFor="isInternational"
                    className="flex items-center w-full cursor-pointer"
                  >
                    <div className="flex-grow">
                      <h5 className="m-0 text-heading text-[1.4rem]">
                        &nbsp; International Shipping &nbsp;
                        <span className="text-gray-10 text-[1.2rem] font-normal">
                          7-14 days
                        </span>
                      </h5>
                    </div>
                    <h4 className="m-0 text-heading text-[1.4rem]">$50.00</h4>
                  </label>
                </div>
              </div>
            </div>

            <br />

            {/* Shipping total */}
            <div className="flex justify-end pr-[1rem]">
              <table className="text-[1.4rem]">
                <tbody>
                  <tr>
                    <td className="pr-[1.6rem] text-right">
                      <span className="text-paragraph">International Shipping:</span>
                    </td>
                    <td className="text-right">
                      <h4 className="m-0 text-gray-10 text-[1.4rem]">
                        {formData.isInternational ? '$50.00' : '$0.00'}
                      </h4>
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-[1.6rem] text-right">
                      <span className="text-paragraph">Subtotal:</span>
                    </td>
                    <td className="text-right">
                      <h4 className="m-0 text-gray-10 text-[1.4rem]">
                        {formatPrice(subtotal)}
                      </h4>
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-[1.6rem] text-right">
                      <span className="text-paragraph">Total:</span>
                    </td>
                    <td className="text-right">
                      <h2 className="m-0 text-heading text-[2.4rem]">
                        {formatPrice(total)}
                      </h2>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <br />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between max-xs:px-[1.6rem]">
              <button
                className="button button-muted"
                onClick={() => router.push('/checkout')}
                type="button"
              >
                <ArrowLeft size={14} />
                &nbsp; Go Back
              </button>
              <button
                className="button button-icon"
                type="submit"
              >
                Next Step &nbsp;
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
