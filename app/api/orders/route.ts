import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/utils/email';
import { generateOrderNumber, generateTrackingNumber } from '@/lib/utils/helpers';
import { mockOrders } from '@/lib/data/mockData';
import { getDemoSession } from '@/lib/demo-auth';

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
        orders = orders.filter(o => o.user._id === demoSession.user.id || (o.user as any) === demoSession.user.id);
      }

      return NextResponse.json({ orders }, { status: 200 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let where: Prisma.OrderWhereInput = {};

    if (session.user?.role === 'admin') {
      // Admin can see all orders or filter by userId
      if (userId) {
        where.userId = userId;
      }
    } else {
      // Regular users can only see their own orders
      where.userId = session.user?.id;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: true,
      },
    });

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

    // await connectDB();

    const data = await req.json();

    // const orderNumber = generateOrderNumber(); // Not used in Schema currently but could be added

    // Prepare items for Prisma (mapping from request structure to database structure)
    type CartItem = { productName?: string; name?: string; quantity: number; price: number; product: string };
    const orderItemsData = data.items.map((item: CartItem) => ({
      name: item.productName || item.name, // Handle potentially different field names
      quantity: item.quantity,
      price: item.price,
      productId: item.product,
    }));

    // Extract shipping address
    const { shippingAddress, ...orderData } = data;

    const order = await prisma.order.create({
      data: {
        userId: session.user?.id as string,
        paymentMethod: orderData.paymentMethod,
        itemsPrice: orderData.itemsPrice,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        status: 'pending',
        isPaid: orderData.isPaid || false,
        orderItems: {
          create: orderItemsData,
        },
        shippingAddress: {
          create: shippingAddress,
        },
      },
      include: {
        orderItems: true,
        shippingAddress: true,
      }
    });

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(session.user?.email || '', {
        orderId: order.id,
        items: order.orderItems,
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
