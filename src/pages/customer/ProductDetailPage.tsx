import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Package } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useProductDetail } from '@/features/customer/hooks/useProductDetail';
import { useWishlist } from '@/features/customer/hooks/useWishlist';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppDispatch } from '@/app/hooks';
import { addItem } from '@/features/cart/slice/cartSlice';
import { StarRating } from '@/features/customer/components/StarRating';
import { ReviewList } from '@/features/customer/components/ReviewList';
import { Skeleton } from '@/shared/components/ui/Skeleton';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const { product, reviews, isLoading, error } = useProductDetail(id);
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isWishlisted = wishlistIds.includes(id ?? '');

  function handleAddToCart() {
    if (!product) return;
    dispatch(addItem({ productId: product.id, name: product.name, price: product.price, image: product.images[0], quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
        <Package size={48} className="mx-auto mb-4 text-slate-300" />
        <p className="text-lg font-semibold text-slate-700">Product not found</p>
        <Link to="/store" className="mt-4 inline-block text-sm text-blue-600 hover:underline">Back to store</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <Link to="/store" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={15} />
        Back to store
      </Link>

      {isLoading ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <Skeleton className="h-80 w-full rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-16 rounded-lg" />)}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-11 flex-1 rounded-xl" />
              <Skeleton className="h-11 w-11 rounded-xl" />
            </div>
          </div>
        </div>
      ) : product ? (
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-80 w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'h-16 w-16 overflow-hidden rounded-lg border-2 transition',
                      i === selectedImage ? 'border-blue-500' : 'border-slate-200 hover:border-slate-400',
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="mb-1 text-xs text-slate-400">{product.category}</p>
            <h1 className="mb-3 text-2xl font-bold text-slate-900">{product.name}</h1>
            <div className="mb-3">
              <StarRating rating={product.rating} showValue reviewCount={product.reviewCount} />
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Sold by <span className="font-medium text-slate-700">{product.vendorName}</span>
            </p>
            <p className="mb-6 text-3xl font-bold text-slate-900">${product.price.toFixed(2)}</p>

            <p className="mb-6 text-sm leading-relaxed text-slate-600">{product.description}</p>

            {product.stock === 0 ? (
              <p className="mb-4 text-sm font-semibold text-red-500">Out of stock</p>
            ) : (
              <p className="mb-4 text-sm text-green-600">{product.stock} in stock</p>
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-50"
                >–</button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition',
                  added
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                <ShoppingCart size={16} />
                {added ? 'Added!' : 'Add to cart'}
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    'rounded-xl border p-2.5 transition',
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-slate-300 text-slate-400 hover:border-red-200 hover:text-red-400',
                  )}
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Customer Reviews{!isLoading && product ? ` (${product.reviewCount})` : ''}
        </h2>
        <ReviewList reviews={reviews} isLoading={isLoading} />
      </div>
    </div>
  );
}
