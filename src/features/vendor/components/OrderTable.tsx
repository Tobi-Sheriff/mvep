import { Badge } from '@/shared/components/ui/Badge';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import type { Order, OrderStatus } from '@/features/orders/types';

const STATUS_BADGE: Record<OrderStatus, { variant: 'default' | 'info' | 'warning' | 'success' | 'danger'; label: string }> = {
  pending: { variant: 'warning', label: 'Pending' },
  processing: { variant: 'info', label: 'Processing' },
  shipped: { variant: 'default', label: 'Shipped' },
  delivered: { variant: 'success', label: 'Delivered' },
  cancelled: { variant: 'danger', label: 'Cancelled' },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
};

interface OrderTableProps {
  orders: Order[];
  isLoading?: boolean;
  compact?: boolean;
  onStatusChange?: (id: string, status: OrderStatus) => void;
}

export function OrderTable({ orders, isLoading, compact, onStatusChange }: OrderTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: compact ? 4 : 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">No orders found</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="pb-3 pr-4">Order ID</th>
            <th className="pb-3 pr-4">Customer</th>
            {!compact && <th className="pb-3 pr-4">Items</th>}
            <th className="pb-3 pr-4">Total</th>
            <th className="pb-3 pr-4">Status</th>
            {!compact && <th className="pb-3 pr-4">Date</th>}
            {onStatusChange && <th className="pb-3">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const badge = STATUS_BADGE[order.status];
            const nextStatus = NEXT_STATUS[order.status];
            return (
              <tr key={order.id} className="text-slate-700">
                <td className="py-3 pr-4 font-mono text-xs text-slate-500">#{order.id}</td>
                <td className="py-3 pr-4">
                  <p className="font-medium">{order.customerName}</p>
                  {!compact && <p className="text-xs text-slate-400">{order.customerEmail}</p>}
                </td>
                {!compact && (
                  <td className="py-3 pr-4 text-slate-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                )}
                <td className="py-3 pr-4 font-semibold">${order.total.toFixed(2)}</td>
                <td className="py-3 pr-4">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </td>
                {!compact && (
                  <td className="py-3 pr-4 text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                )}
                {onStatusChange && (
                  <td className="py-3">
                    {nextStatus ? (
                      <button
                        onClick={() => onStatusChange(order.id, nextStatus)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600"
                      >
                        Mark {nextStatus}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
