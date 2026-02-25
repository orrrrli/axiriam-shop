'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { DollarSign, ShoppingBag, Users, Package, Loader2, Clock } from 'lucide-react';
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
      <div className="content-admin">
        <Navbar />
        <div className="content-admin-wrapper flex items-center justify-center">
          <Loader2 className="w-[3rem] h-[3rem] animate-spin text-heading" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: Package,
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
    },
  ];

  return (
    <div className="content-admin">
      <Navbar />
      <div className="content-admin-wrapper">
        <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
          {/* Header */}
          <div className="mb-[3rem]">
            <h1 className="text-heading text-[2.4rem]">Admin Dashboard</h1>
            <p className="text-subtle text-[1.4rem] mt-[0.4rem]">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1.6rem] mb-[3rem]">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white border border-border p-[2rem] transition-all duration-300 hover:border-border-focus"
              >
                <div className="flex items-center justify-between mb-[1.2rem]">
                  <span className="text-subtle text-[1.2rem]">{card.label}</span>
                  <card.icon className="w-[2rem] h-[2rem] text-heading" />
                </div>
                <p className="text-heading text-[2.2rem] font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white border border-border">
            <div className="px-[2rem] py-[1.6rem] border-b border-border">
              <h2 className="text-heading text-[1.6rem]">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-body-alt">
                    <th className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                      Order ID
                    </th>
                    <th className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-subtle font-bold uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-[4rem] text-center text-subtle text-[1.4rem]"
                      >
                        No orders yet
                      </td>
                    </tr>
                  )}
                  {stats?.recentOrders?.map((order: any) => (
                    <tr
                      key={order._id || order.id}
                      className="border-b border-border last:border-b-0 hover:bg-body transition-colors duration-200"
                    >
                      <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">
                        #{(order._id || order.id || '').slice(-8)}
                      </td>
                      <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">
                        {order.user?.name || 'N/A'}
                      </td>
                      <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-bold">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="py-[1.2rem] px-[2rem]">
                        <span
                          className={`
                            inline-block px-[1rem] py-[0.3rem] text-[1.1rem] font-bold
                            ${
                              order.status === 'delivered'
                                ? 'bg-[#e8f5e9] text-[#2e7d32]'
                                : order.status === 'shipped'
                                  ? 'bg-[#e3f2fd] text-[#1565c0]'
                                  : order.status === 'processing'
                                    ? 'bg-[#fff8e1] text-[#f57f17]'
                                    : 'bg-body-alt text-paragraph'
                            }
                          `}
                        >
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-subtle flex items-center gap-[0.4rem]">
                        <Clock className="w-[1.2rem] h-[1.2rem]" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
