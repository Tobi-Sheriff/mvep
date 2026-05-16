import { useAppSelector } from '@/app/hooks';
import type { CheckoutAddress, CheckoutPayment } from '@/features/checkout/types';

interface Props {
  address: CheckoutAddress;
  payment: CheckoutPayment;
  subtotal: number;
  shipping: number;
  total: number;
  onBack: () => void;
  onPlaceOrder: () => void;
  isPlacing: boolean;
  error: string | null;
}

export function ReviewStep({ address, payment, subtotal, shipping, total, onBack, onPlaceOrder, isPlacing, error }: Props) {
  const items = useAppSelector((state) => state.cart.items);

  return (
    <div>
      <h2 className="mb-6 text-lg font-bold text-slate-800">Review your order</h2>

      {/* Items */}
      <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
        <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Items ({items.length})
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
              <img src={item.image} alt={item.name} className="h-10 w-10 flex-shrink-0 rounded-lg object-cover" />
              <div className="flex flex-1 justify-between text-sm">
                <span className="text-slate-700 line-clamp-1">{item.name} × {item.quantity}</span>
                <span className="font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="divide-y divide-slate-100 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <div className="flex justify-between py-1 text-slate-600">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'font-medium text-green-600' : ''}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between pt-2 font-bold text-slate-900">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="mb-4 rounded-xl border border-slate-200 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery address</p>
        <p className="text-sm text-slate-700">{address.firstName} {address.lastName}</p>
        <p className="text-sm text-slate-700">{address.address}</p>
        <p className="text-sm text-slate-700">{address.city}, {address.state} {address.zipCode}</p>
        <p className="text-sm text-slate-700">{address.country}</p>
        <p className="mt-1 text-sm text-slate-500">{address.email}</p>
      </div>

      {/* Payment */}
      <div className="mb-6 rounded-xl border border-slate-200 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Payment</p>
        <p className="text-sm text-slate-700">{payment.nameOnCard}</p>
        <p className="text-sm text-slate-700">Card ending in ···· {payment.cardNumber.slice(-4)}</p>
        <p className="text-sm text-slate-500">Expires {payment.expiryMonth}/{payment.expiryYear}</p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isPlacing}
          className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          disabled={isPlacing}
          className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPlacing ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </div>
  );
}
