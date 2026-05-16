import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '@/features/vendor/api/productsApi';
import type { Product } from '@/features/vendor/types';
import type { ProductFormData } from '@/features/vendor/types/schemas';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page = 1, limit = 10, search = '', category = '' } = options;

  const { data, isLoading, error } = useGetProductsQuery({ page, limit, search, category });
  const [createProductMutation] = useCreateProductMutation();
  const [updateProductMutation] = useUpdateProductMutation();
  const [deleteProductMutation] = useDeleteProductMutation();

  async function createProduct(formData: ProductFormData): Promise<Product> {
    return createProductMutation(formData).unwrap();
  }

  async function updateProduct(id: string, formData: ProductFormData): Promise<Product> {
    return updateProductMutation({ id, data: formData }).unwrap();
  }

  async function deleteProduct(id: string): Promise<void> {
    await deleteProductMutation(id).unwrap();
  }

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error ? 'Failed to load products' : null,
    refetch: () => {},
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
