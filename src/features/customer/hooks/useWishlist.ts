import { useGetWishlistQuery, useToggleWishlistMutation } from '@/features/customer/api/wishlistApi';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const { data: wishlistIds = [], isLoading } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleMutation] = useToggleWishlistMutation();

  async function toggleWishlist(productId: string): Promise<void> {
    if (!isAuthenticated) return;
    const isWishlisted = wishlistIds.includes(productId);
    await toggleMutation({ productId, isWishlisted });
  }

  return {
    wishlistIds,
    isLoading,
    toggleWishlist,
    isWishlisted: (id: string) => wishlistIds.includes(id),
  };
}
