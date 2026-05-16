import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { removeItem, updateQuantity } from '@/features/cart/slice/cartSlice';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const items = useAppSelector((state) => state.cart.items);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 50 ? 5.99 : 0;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
        <ShoppingBag size={52} className="mx-auto mb-4 text-slate-200" />
        <h1 className="mb-2 text-xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="mb-6 text-slate-400">Add some products to get started.</p>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        Your cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Item list */}
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/store/product/${item.productId}`}
                    className="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => dispatch(removeItem(item.productId))}
                    className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                      disabled={item.quantity <= 1}
                      className="px-2.5 py-1 text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-40"
                    >–</button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      className="px-2.5 py-1 text-sm text-slate-500 hover:bg-slate-50"
                    >+</button>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                    {item.quantity > 1 && (
                      <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="w-full rounded-xl border border-slate-200 bg-white p-6 lg:w-80 lg:flex-shrink-0">
          <h2 className="mb-4 text-base font-bold text-slate-800">Order summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="font-medium text-green-600">Free</span>
              ) : (
                <span>${shipping.toFixed(2)}</span>
              )}
            </div>
            {shipping > 0 && (
              <p className="text-xs text-slate-400">Free shipping on orders over $50</p>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(isAuthenticated ? '/store/checkout' : '/login')}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            {isAuthenticated ? 'Proceed to checkout' : 'Sign in to checkout'}
          </button>
          <Link
            to="/store"
            className="mt-3 block text-center text-xs text-slate-400 hover:text-slate-600"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
