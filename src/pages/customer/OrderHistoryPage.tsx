import { Package } from 'lucide-react';
import { useCustomerOrders } from '@/features/orders/hooks/useCustomerOrders';
import { Badge } from '@/shared/components/ui/Badge';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import type { OrderStatus } from '@/features/orders/types';

const STATUS_VARIANT: Record<OrderStatus, 'warning' | 'info' | 'default' | 'success' | 'danger'> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'danger',
};

function OrderSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-3 w-full" />
      <div className="flex justify-between pt-1">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

export function OrderHistoryPage() {
  const { orders, isLoading } = useCustomerOrders();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">My orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center">
          <Package size={48} className="mx-auto mb-4 text-slate-200" />
          <p className="font-semibold text-slate-700">No orders yet</p>
          <p className="mt-1 text-sm text-slate-400">Your completed orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-slate-800">{order.id}</p>
                </div>
                <Badge variant={STATUS_VARIANT[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              <div className="mb-3 divide-y divide-slate-100 rounded-lg border border-slate-100">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between px-3 py-2 text-sm">
                    <span className="text-slate-700">
                      {item.productName} <span className="text-slate-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-slate-900">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                <span className="font-bold text-slate-900">Total: ${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
