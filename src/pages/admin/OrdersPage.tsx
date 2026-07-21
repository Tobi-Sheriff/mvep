import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAdminOrdersQuery } from '@/features/admin/api/adminApi';
import { ORDER_STATUSES } from '@/features/orders/types';
import { cn } from '@/shared/utils/cn';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  shipped: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const LIMIT = 15;

export function AdminOrdersPage() {
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAdminOrdersQuery({
    status: status || undefined,
    page,
    limit: LIMIT,
  });

  function handleStatusChange(s: string) {
    setStatus(s);
    setPage(1);
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {data ? `${data.total} order${data.total !== 1 ? 's' : ''} platform-wide` : 'Loading…'}
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="mb-4 flex flex-wrap gap-1">
        {(['', ...ORDER_STATUSES] as string[]).map((s) => (
          <button
            key={s || 'all'}
            onClick={() => handleStatusChange(s)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
              status === s
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            )}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Items</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Total</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 rounded bg-slate-200 dark:bg-slate-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{order.customerName}</p>
                        <p className="text-xs text-slate-400">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                        {fmt(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_COLORS[order.status])}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {fmtDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !data?.orders.length && (
          <p className="py-12 text-center text-sm text-slate-400">No orders found.</p>
        )}

        {/* Pagination */}
        {!isLoading && data && data.total > LIMIT && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">{data.total} total orders</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-600 dark:text-slate-300">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
