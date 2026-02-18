import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
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

    await connectDB();

    const [
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      orderStats,
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            avgOrderValue: { $avg: '$totalPrice' },
          },
        },
      ]),
    ]);

    const stats = {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: orderStats[0]?.totalRevenue || 0,
      avgOrderValue: orderStats[0]?.avgOrderValue || 0,
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
