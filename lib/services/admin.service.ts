import prisma from '@/lib/prisma';

export async function getAdminStats() {
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
    totalRevenue: revenueData._sum.totalPrice || 0,
    avgOrderValue: revenueData._avg.totalPrice || 0,
    recentOrders,
  };
}
