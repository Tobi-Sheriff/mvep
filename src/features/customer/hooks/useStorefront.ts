import { useState } from 'react';
import { useGetStorefrontProductsQuery } from '@/features/vendor/api/productsApi';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { StorefrontFilters, SortOption } from '@/features/customer/types';

const DEFAULT_FILTERS: StorefrontFilters = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  rating: '',
  sort: 'newest' as SortOption,
};

export function useStorefront() {
  const [filters, setFilters] = useState<StorefrontFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(filters.search, 350);

  const { data, isLoading, error } = useGetStorefrontProductsQuery({
    page,
    search: debouncedSearch,
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
    sort: filters.sort,
  });

  function updateFilter<K extends keyof StorefrontFilters>(key: K, value: StorefrontFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }

  return {
    products: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    page, setPage,
    filters, updateFilter, resetFilters,
    isLoading,
    error: error ? 'Failed to load products' : null,
  };
}
