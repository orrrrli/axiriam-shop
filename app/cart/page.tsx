'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/helpers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="container mx-auto container-padding py-24">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-brown-300" />
            <h1 className="text-3xl font-heading mb-4">Your Cart is Empty</h1>
            <p className="text-brown-700 mb-8">Add some delicious items to get started!</p>
            <Link href="/#menu" className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="container mx-auto container-padding py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="text-brown-600 hover:text-brown-800 flex items-center mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-heading font-medium mb-1">{item.name}</h3>
                      <p className="text-brown-600 text-sm mb-2">{item.category}</p>
                      <p className="text-brown-800 font-medium">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-brown-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-brown-100 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-brown-100 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={clearCart}
                className="mt-6 text-red-600 hover:text-red-800 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-xl font-heading mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-brown-700">Subtotal</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-700">Tax (8%)</span>
                    <span className="font-medium">{formatPrice(getTotalPrice() * 0.08)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-700">Shipping</span>
                    <span className="font-medium">{getTotalPrice() >= 50 ? 'FREE' : formatPrice(5.99)}</span>
                  </div>
                  <div className="border-t border-brown-200 pt-3 flex justify-between text-lg">
                    <span className="font-heading font-medium">Total</span>
                    <span className="font-heading font-bold text-brown-800">
                      {formatPrice(getTotalPrice() + (getTotalPrice() * 0.08) + (getTotalPrice() >= 50 ? 0 : 5.99))}
                    </span>
                  </div>
                </div>

                {getTotalPrice() < 50 && (
                  <p className="text-sm text-brown-600 mb-4 bg-cream-100 p-3 rounded-lg">
                    Add {formatPrice(50 - getTotalPrice())} more for free shipping!
                  </p>
                )}

                <Link href="/checkout" className="btn btn-primary w-full">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
