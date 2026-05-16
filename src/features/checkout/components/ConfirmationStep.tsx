import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export function ConfirmationStep({ orderId }: { orderId: string }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 size={34} className="text-green-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-800">Order placed!</h2>
      <p className="mb-1 text-slate-500">Thank you for your purchase.</p>
      <p className="mb-8 text-sm text-slate-400">
        Order ID:{' '}
        <span className="font-mono font-semibold text-slate-700">{orderId}</span>
      </p>
      <div className="flex justify-center gap-3">
        <Link
          to="/store"
          className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Continue shopping
        </Link>
        <Link
          to="/store/orders"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          View my orders
        </Link>
      </div>
    </div>
  );
}
