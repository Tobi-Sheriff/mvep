import { useState } from 'react';
import { OrderTable } from '@/features/vendor/components/OrderTable';
import { useOrders } from '@/features/vendor/hooks/useOrders';
import { type OrderStatus } from '@/features/orders/types';
import { cn } from '@/shared/utils/cn';

type Tab = 'all' | OrderStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function VendorOrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [statusError, setStatusError] = useState<string | null>(null);

  const statusFilter = activeTab === 'all' ? undefined : activeTab;
  const { orders, total, isLoading, error, updateOrderStatus } = useOrders(statusFilter);

  async function handleStatusChange(id: string, status: OrderStatus) {
    setStatusError(null);
    try {
      await updateOrderStatus(id, status);
    } catch {
      setStatusError('Failed to update order status. Please try again.');
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-500">{total} order{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Status tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex-shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeTab === key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {(error || statusError) && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || statusError}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="p-6">
          <OrderTable
            orders={orders}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
