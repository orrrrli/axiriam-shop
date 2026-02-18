'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Package, User, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="container mx-auto container-padding py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brown-600 border-r-transparent"></div>
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
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <div className="flex items-center mb-6">
              <User className="h-12 w-12 text-brown-600 mr-4" />
              <div>
                <h1 className="text-3xl font-heading">{session?.user?.name}</h1>
                <p className="text-brown-700">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-heading mb-6">Your Orders</h2>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-md text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-brown-300" />
              <h3 className="text-xl font-heading mb-2">No Orders Yet</h3>
              <p className="text-brown-700 mb-6">Start shopping to see your orders here!</p>
              <Link href="/#menu" className="btn btn-primary">Browse Menu</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-heading font-medium">Order #{order._id.slice(-8)}</h3>
                      <p className="text-sm text-brown-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.productName} x {item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-brown-200 pt-4 flex justify-between items-center">
                    <span className="font-heading font-medium">Total</span>
                    <span className="text-lg font-heading font-bold text-brown-800">{formatPrice(order.totalPrice)}</span>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 bg-cream-50 p-3 rounded">
                      <p className="text-sm text-brown-700">
                        <strong>Tracking:</strong> {order.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
