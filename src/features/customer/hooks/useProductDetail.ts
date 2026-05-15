import { useState, useEffect } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import type { CustomerProduct, Review } from '@/features/customer/types';

export function useProductDetail(id: string | undefined) {
  const [product, setProduct] = useState<CustomerProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      api.get<CustomerProduct>(`/products/${id}`),
      api.get<Review[]>(`/products/${id}/reviews`),
    ])
      .then(([productRes, reviewsRes]) => {
        if (cancelled) return;
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      })
      .catch(() => {
        if (!cancelled) setError('Product not found');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  return { product, reviews, isLoading, error };
}
