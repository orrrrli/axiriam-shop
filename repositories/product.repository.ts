import prisma from '@/lib/prisma';
import { mockProducts } from '@/lib/data/mockData';
import type { Product } from '@/types/product';

type PrismaProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
};

function mapToProduct(raw: PrismaProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    image: raw.image,
    category: raw.category,
    inStock: raw.inStock,
    featured: raw.featured,
    averageRating: raw.averageRating,
    totalReviews: raw.totalReviews,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function findAllProducts(): Promise<Product[]> {
  const records = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return records.map(mapToProduct);
}

export async function findProductById(id: string): Promise<Product | null> {
  try {
    const raw = await prisma.product.findUnique({
      where: { id },
      include: { reviews: true },
    });
    if (raw) return mapToProduct(raw);
  } catch {
    // DB unavailable — fall through to mock
  }
  const mock = mockProducts.find((p) => p._id === id);
  return mock ? (mock as unknown as Product) : null;
}
