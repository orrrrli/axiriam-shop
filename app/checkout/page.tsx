'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice, calculateTax, calculateShipping } from '@/lib/utils/helpers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const subtotal = getTotalPrice();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  if (!session) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="container mx-auto container-padding py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-heading mb-4">Please Sign In</h1>
            <p className="text-brown-700 mb-8">You need to be signed in to checkout.</p>
            <Link href="/auth/signin" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: formData,
        paymentMethod: 'stripe',
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
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
        router.push(`/profile/orders`);
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="container mx-auto container-padding py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-heading mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brown-700 mb-1">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} className="input" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brown-700 mb-1">Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">City</label>
                    <input name="city" value={formData.city} onChange={handleChange} className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">Postal Code</label>
                    <input name="postalCode" value={formData.postalCode} onChange={handleChange} className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">Country</label>
                    <input name="country" value={formData.country} onChange={handleChange} className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-1">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} className="input" required />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-heading mb-4">Order Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-brown-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-xl font-heading mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-brown-700">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-700">Tax</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-700">Shipping</span>
                    <span className="font-medium">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-brown-200 pt-3 flex justify-between text-lg">
                    <span className="font-heading font-medium">Total</span>
                    <span className="font-heading font-bold text-brown-800">{formatPrice(total)}</span>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary w-full">
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
