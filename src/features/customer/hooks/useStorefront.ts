import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import type { CustomerProduct, StorefrontResponse, StorefrontFilters } from '@/features/customer/types';
import { useDebounce } from '@/shared/hooks/useDebounce';

const DEFAULT_FILTERS: StorefrontFilters = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  rating: '',
  sort: 'newest',
};

export function useStorefront() {
  const [filters, setFilters] = useState<StorefrontFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 350);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.rating) params.set('rating', filters.rating);
      if (filters.sort) params.set('sort', filters.sort);

      const { data } = await api.get<StorefrontResponse>(`/products?${params}`);
      setProducts(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.rating, filters.sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function updateFilter<K extends keyof StorefrontFilters>(key: K, value: StorefrontFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  return {
    products, total, totalPages, page, setPage,
    filters, updateFilter, resetFilters,
    isLoading, error,
  };
}
