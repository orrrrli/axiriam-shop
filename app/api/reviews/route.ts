import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST create review
// Refactored to use Prisma
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const productId = data.productId;
    const rating = data.rating;
    const comment = data.comment;

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: productId,
        userId: session.user?.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    // Create review
    await prisma.review.create({
      data: {
        rating,
        comment,
        userId: session.user?.id as string,
        productId: productId,
      },
    });

    // Update product stats
    // We can use aggregation to fetch the new stats
    const aggregations = await prisma.review.aggregate({
      where: { productId: productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: aggregations._avg.rating || 0,
        totalReviews: aggregations._count.rating || 0,
      },
      include: {
        reviews: {
          include: {
            user: { select: { name: true, image: true } }
          }
        }
      }
    });

    return NextResponse.json(
      { message: 'Review added successfully', product: updatedProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    );
  }
}
