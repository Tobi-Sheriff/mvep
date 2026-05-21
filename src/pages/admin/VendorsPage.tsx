import { useState } from 'react';
import { Search } from 'lucide-react';
import { useGetAdminVendorsQuery } from '@/features/admin/api/adminApi';
import { cn } from '@/shared/utils/cn';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  suspended: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  banned: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function AdminVendorsPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetAdminVendorsQuery({ search: search || undefined });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendors</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data ? `${data.total} vendor store${data.total !== 1 ? 's' : ''}` : 'Loading…'}
          </p>
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors…"
            aria-label="Search vendors"
            className="w-52 rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Store</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Products</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Orders</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Revenue</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 rounded bg-slate-200 dark:bg-slate-700" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.vendors.map((vendor) => (
                    <tr
                      key={vendor.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {vendor.storeName}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                        {vendor.productCount}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                        {vendor.totalOrders}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                        {fmt(vendor.totalRevenue)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_COLORS[vendor.userStatus])}>
                          {vendor.userStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {fmtDate(vendor.createdAt)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && (!data?.vendors.length) && (
          <p className="py-12 text-center text-sm text-slate-400">No vendors found.</p>
        )}
      </div>
    </div>
  );
}
