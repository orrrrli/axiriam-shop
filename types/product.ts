export interface Product {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  averageRating?: number;
  totalReviews?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  reviews?: Review[];
}

export interface Review {
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
}

export type SortBy = '' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface FilterState {
  category: string;
  sortBy: SortBy;
  minPrice: number;
  maxPrice: number;
  keyword: string;
}
