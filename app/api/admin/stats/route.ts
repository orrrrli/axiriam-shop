import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockStats } from '@/lib/data/mockData';
import { getDemoSession } from '@/lib/demoAuth';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

export async function GET(req: NextRequest) {
  try {
    // DEMO MODE: Use mock stats
    if (DEMO_MODE) {
      const demoSession = getDemoSession();

      if (!demoSession || demoSession.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      return NextResponse.json({ stats: mockStats }, { status: 200 });
    }

    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenueData,
      recentOrders,
    ] = await Promise.all([
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

    const stats = {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: totalRevenueData._sum.totalPrice || 0,
      avgOrderValue: totalRevenueData._avg.totalPrice || 0,
      recentOrders,
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
