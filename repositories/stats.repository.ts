import prisma from '@/lib/prisma';

export interface AdminStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  avgOrderValue: number;
  recentOrders: RecentOrder[];
}

export interface RecentOrder {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
  user: { name: string | null; email: string } | null;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const [totalOrders, totalProducts, totalUsers, revenueData, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        _avg: { totalPrice: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: revenueData._sum.totalPrice ?? 0,
    avgOrderValue: revenueData._avg.totalPrice ?? 0,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      user: o.user,
    })),
  };
}
