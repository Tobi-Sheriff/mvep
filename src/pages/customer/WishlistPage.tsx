import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { api } from '@/shared/utils/axiosInstance';
import { useWishlist } from '@/features/customer/hooks/useWishlist';
import { ProductGrid } from '@/features/customer/components/ProductGrid';
import type { CustomerProduct } from '@/features/customer/types';

export function WishlistPage() {
  const { wishlistIds, toggleWishlist, isLoading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (wishlistLoading) return;
    if (!wishlistIds.length) { setProducts([]); return; }
    setIsLoading(true);
    Promise.all(wishlistIds.map((id) => api.get<CustomerProduct>(`/products/${id}`)))
      .then((responses) => setProducts(responses.map((r) => r.data)))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [wishlistIds, wishlistLoading]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Heart size={20} className="text-red-500" fill="currentColor" />
        <h1 className="text-xl font-bold text-slate-800">My Wishlist</h1>
        {wishlistIds.length > 0 && (
          <span className="text-sm text-slate-400">({wishlistIds.length} items)</span>
        )}
      </div>
      <ProductGrid
        products={products}
        wishlistIds={wishlistIds}
        onWishlistToggle={toggleWishlist}
        isLoading={isLoading || wishlistLoading}
      />
    </div>
  );
}
