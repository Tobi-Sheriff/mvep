import { useState, useEffect } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { setWishlistIds([]); return; }
    setIsLoading(true);
    api.get<string[]>('/users/wishlist')
      .then((res) => setWishlistIds(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  async function toggleWishlist(productId: string): Promise<void> {
    if (!isAuthenticated) return;
    const isWishlisted = wishlistIds.includes(productId);

    // Optimistic update
    setWishlistIds((prev) =>
      isWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId],
    );

    try {
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${productId}`);
      } else {
        await api.post(`/users/wishlist/${productId}`);
      }
    } catch {
      // Roll back
      setWishlistIds((prev) =>
        isWishlisted ? [...prev, productId] : prev.filter((id) => id !== productId),
      );
    }
  }

  return { wishlistIds, isLoading, toggleWishlist, isWishlisted: (id: string) => wishlistIds.includes(id) };
}
