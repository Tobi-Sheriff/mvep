import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { StarRating } from './StarRating';
import { useAppDispatch } from '@/app/hooks';
import { addItem } from '@/features/cart/slice/cartSlice';
import type { CustomerProduct } from '@/features/customer/types';

interface ProductCardProps {
  product: CustomerProduct;
  isWishlisted: boolean;
  onWishlistToggle: (id: string) => void;
}

export function ProductCard({ product, isWishlisted, onWishlistToggle }: ProductCardProps) {
  const dispatch = useAppDispatch();

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    }));
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    onWishlistToggle(product.id);
  }

  const outOfStock = product.stock === 0;

  return (
    <Link
      to={`/store/product/${product.id}`}
      className="group relative flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Out of stock
            </span>
          </div>
        )}
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={cn(
            'absolute right-2 top-2 rounded-full p-1.5 shadow transition-colors',
            isWishlisted
              ? 'bg-red-50 text-red-500'
              : 'bg-white/90 text-slate-400 hover:text-red-400',
          )}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-0.5 text-xs text-slate-400">{product.category}</p>
        <h3 className="mb-1 line-clamp-2 flex-1 text-sm font-semibold text-slate-800 group-hover:text-blue-600">
          {product.name}
        </h3>
        <StarRating rating={product.rating} showValue reviewCount={product.reviewCount} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart size={13} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}
