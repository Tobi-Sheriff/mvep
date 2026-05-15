import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import type { Product, ProductsResponse } from '@/features/vendor/types';
import type { ProductFormData } from '@/features/vendor/types/schemas';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page = 1, limit = 10, search = '', category = '' } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      const { data } = await api.get<ProductsResponse>(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
    } catch {
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function createProduct(data: ProductFormData): Promise<Product> {
    const res = await api.post<Product>('/products', data);
    await fetchProducts();
    return res.data;
  }

  async function updateProduct(id: string, data: ProductFormData): Promise<Product> {
    const res = await api.put<Product>(`/products/${id}`, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    return res.data;
  }

  async function deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotal((t) => t - 1);
  }

  return { products, total, isLoading, error, refetch: fetchProducts, createProduct, updateProduct, deleteProduct };
}
