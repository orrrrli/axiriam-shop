import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAdminStats } from '@/lib/services/admin.service';
import { DollarSign, ShoppingBag, Users, Package, Clock, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';
import Link from 'next/link';

export default async function AdminDashboard(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

  const stats = await getAdminStats();

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign },
    { label: 'Total Orders', value: stats.totalOrders, icon: Package },
    { label: 'Total Products', value: stats.totalProducts, icon: ShoppingBag },
    { label: 'Total Users', value: stats.totalUsers, icon: Users },
  ];

  return (
    <div className="w-full max-w-[120rem] mx-auto px-[3rem] py-[3rem] animate-fade-in max-xs:px-[1.6rem]">
      {/* Header */}
      <div className="mb-[3rem] flex items-start justify-between gap-[2rem]">
        <div>
          <h1 className="text-heading text-[2.4rem]">Dashboard</h1>
          <p className="text-admin-muted text-[1.4rem] mt-[0.4rem]">
            Welcome back, {session.user?.name?.split(' ')[0] || 'Admin'}
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[0.8rem] px-[1.6rem] py-[1rem] text-[1.3rem] font-semibold text-paragraph bg-white border border-border rounded-[0.8rem] hover:border-border-focus hover:bg-admin-bg transition-all duration-200 whitespace-nowrap"
        >
          <ExternalLink className="w-[1.6rem] h-[1.6rem]" />
          Ver tienda
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1.6rem] mb-[3rem]">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-border rounded-[0.8rem] p-[2rem] transition-all duration-300 hover:border-border-focus"
          >
            <div className="flex items-center justify-between mb-[1.2rem]">
              <span className="text-admin-muted text-[1.2rem] font-medium">{card.label}</span>
              <card.icon className="w-[2rem] h-[2rem] text-admin-active-text" />
            </div>
            <p className="text-heading text-[2.2rem] font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-border rounded-[0.8rem]">
        <div className="px-[2rem] py-[1.6rem] border-b border-border">
          <h2 className="text-heading text-[1.6rem]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left py-[1.2rem] px-[2rem] text-[1.2rem] text-admin-muted font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-[4rem] text-center text-admin-muted text-[1.4rem]">
                    No orders yet
                  </td>
                </tr>
              )}
              {stats.recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border last:border-b-0 hover:bg-admin-bg transition-colors duration-200"
                >
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-semibold">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-paragraph">
                    {order.user?.name || 'N/A'}
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-heading font-semibold">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="py-[1.2rem] px-[2rem]">
                    <span
                      className={`inline-block px-[1rem] py-[0.3rem] text-[1.1rem] font-semibold rounded-[0.4rem] ${
                        order.status === 'delivered'
                          ? 'bg-[#e8f5e9] text-[#2e7d32]'
                          : order.status === 'shipped'
                            ? 'bg-[#e3f2fd] text-[#1565c0]'
                            : order.status === 'processing'
                              ? 'bg-[#fff8e1] text-[#f57f17]'
                              : 'bg-body-alt text-paragraph'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-[1.2rem] px-[2rem] text-[1.3rem] text-admin-muted flex items-center gap-[0.4rem]">
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
  );
}
