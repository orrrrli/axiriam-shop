import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { sendOrderConfirmationEmail } from '@/lib/utils/email';
import { generateOrderNumber, generateTrackingNumber } from '@/lib/utils/helpers';
import { mockOrders } from '@/lib/data/mockData';
import { getDemoSession } from '@/lib/demoAuth';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

// GET orders
export async function GET(req: NextRequest) {
  try {
    // DEMO MODE: Use mock data
    if (DEMO_MODE) {
      const demoSession = getDemoSession();
      
      if (!demoSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      let orders = [...mockOrders];

      if (demoSession.user.role !== 'admin') {
        // Regular users see only their orders
        orders = orders.filter(o => o.user._id === demoSession.user.id);
      }

      return NextResponse.json({ orders }, { status: 200 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let query: any = {};

    if (session.user?.role === 'admin') {
      // Admin can see all orders or filter by userId
      if (userId) {
        query.user = userId;
      }
    } else {
      // Regular users can only see their own orders
      query.user = session.user?.id;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(req: NextRequest) {
  try {
    // DEMO MODE: Return mock order
    if (DEMO_MODE) {
      const demoSession = getDemoSession();
      
      if (!demoSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const data = await req.json();
      const mockOrder = {
        _id: 'demo-order-' + Date.now(),
        ...data,
        user: demoSession.user.id,
        status: 'pending',
        trackingNumber: generateTrackingNumber(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json({ 
        order: mockOrder,
        message: 'Demo mode: Order created (not saved to database)'
      }, { status: 201 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const data = await req.json();
    
    const orderNumber = generateOrderNumber();
    
    const order = await Order.create({
      ...data,
      user: session.user?.id,
      status: 'pending',
    });

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(session.user?.email || '', {
        orderId: order._id.toString(),
        items: order.items,
        total: order.totalPrice,
        shippingAddress: order.shippingAddress,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
