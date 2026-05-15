import { Package } from 'lucide-react';

export function OrderHistoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
      <Package size={48} className="mx-auto mb-4 text-slate-200" />
      <span className="mb-3 inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
        Phase 5
      </span>
      <h1 className="mt-2 text-2xl font-bold text-slate-800">My Orders</h1>
      <p className="mt-2 text-slate-400">
        Order history with status timeline and re-order action coming in Phase 5.
      </p>
    </div>
  );
}
