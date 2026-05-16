import { useGetProductQuery, useGetProductReviewsQuery } from '@/features/vendor/api/productsApi';

export function useProductDetail(id: string | undefined) {
  const { data: product = null, isLoading: l1, error } = useGetProductQuery(id!, { skip: !id });
  const { data: reviews = [], isLoading: l2 } = useGetProductReviewsQuery(id!, { skip: !id });

  return {
    product,
    reviews,
    isLoading: l1 || l2,
    error: error ? 'Product not found' : null,
  };
}
