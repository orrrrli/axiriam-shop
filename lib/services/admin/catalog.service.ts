import { findAllProducts, findProductById } from '@/repositories/product.repository';
import { mockProducts } from '@/lib/data/mockData';
import type { Product } from '@/types/product';
import type { ServiceResult } from './types';

export async function getProducts(): Promise<Product[]> {
  const products = await findAllProducts();
  if (products.length === 0) return mockProducts as Product[];
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  return findProductById(id);
}

export async function fetchFilteredProducts(
  category: string,
  sortBy: string,
): Promise<ServiceResult<Product[]>> {
  try {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (sortBy) params.set('sortBy', sortBy);

    const res = await fetch(`/api/products?${params.toString()}`);

    if (!res.ok) {
      return { success: false, error: 'Failed to fetch products' };
    }

    const data = (await res.json()) as { products: Product[] };
    return { success: true, data: data.products ?? [] };
  } catch {
    return { success: false, error: 'Network error occurred' };
  }
}
