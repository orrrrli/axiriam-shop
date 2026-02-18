import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { mockProducts } from '@/lib/data/mockData';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

// GET all products with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // DEMO MODE: Use mock data
    if (DEMO_MODE) {
      let products = [...mockProducts];

      if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }

      if (featured === 'true') {
        products = products.filter(p => p.featured);
      }

      return NextResponse.json({ products }, { status: 200 });
    }

    // NORMAL MODE: Use database
    await connectDB();

    let query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // DEMO MODE: Return success without saving
    if (DEMO_MODE) {
      const data = await req.json();
      return NextResponse.json({ 
        product: { ...data, _id: 'demo-' + Date.now() },
        message: 'Demo mode: Product not saved to database'
      }, { status: 201 });
    }

    await connectDB();

    const data = await req.json();
    const product = await Product.create(data);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
