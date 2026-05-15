export interface CustomerProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  vendorId: string;
  vendorName: string;
  createdAt: string;
}

export interface StorefrontResponse {
  data: CustomerProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular';

export interface StorefrontFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  sort: SortOption;
}
