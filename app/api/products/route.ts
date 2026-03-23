import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mockProducts } from '@/lib/data/mockData';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

// GET all products with optional filtering, sorting, and pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

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

      if (minPrice) {
        products = products.filter(p => p.price >= parseFloat(minPrice));
      }

      if (maxPrice) {
        products = products.filter(p => p.price <= parseFloat(maxPrice));
      }

      // Sort
      if (sortBy) {
        switch (sortBy) {
          case 'name-asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
        }
      }

      const total = products.length;

      // Pagination
      if (offset) {
        products = products.slice(parseInt(offset));
      }
      if (limit) {
        products = products.slice(0, parseInt(limit));
      }

      return NextResponse.json({ products, total }, { status: 200 });
    }

    // NORMAL MODE: Use database

    // Build filter query
    const where: Prisma.ProductWhereInput = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Build sort
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderBy = { name: 'asc' };
          break;
        case 'name-desc':
          orderBy = { name: 'desc' };
          break;
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
      }
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { reviews: true },
      ...(limit ? { take: parseInt(limit) } : {}),
      ...(offset ? { skip: parseInt(offset) } : {}),
    });

    return NextResponse.json({ products, total }, { status: 200 });
  } catch (error: unknown) {
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
        product: { ...data, id: 'demo-' + Date.now() },
        message: 'Demo mode: Product not saved to database'
      }, { status: 201 });
    }

    const data = await req.json();

    // Ensure numeric types are correct
    const productData = {
      ...data,
      price: parseFloat(data.price),
    };

    const product = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
