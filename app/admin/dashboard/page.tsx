'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated' && session.user?.role === 'admin') {
      fetchStats();
    }
  }, [status, session]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heading mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-brown-700">Total Revenue</span>
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-heading font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-brown-700">Total Orders</span>
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-heading font-bold">{stats?.totalOrders || 0}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-brown-700">Total Products</span>
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-heading font-bold">{stats?.totalProducts || 0}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-brown-700">Total Users</span>
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-2xl font-heading font-bold">{stats?.totalUsers || 0}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-heading mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brown-200">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order: any) => (
                    <tr key={order._id} className="border-b border-brown-100 hover:bg-cream-50">
                      <td className="py-3 px-4">#{order._id.slice(-8)}</td>
                      <td className="py-3 px-4">{order.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{formatPrice(order.totalPrice)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
