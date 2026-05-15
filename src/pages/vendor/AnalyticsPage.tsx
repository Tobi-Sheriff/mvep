import { useState } from 'react';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { StatCard } from '@/features/vendor/components/StatCard';
import { RevenueChart } from '@/features/vendor/components/RevenueChart';
import { OrdersBarChart } from '@/features/vendor/components/OrdersBarChart';
import { TopProductsTable } from '@/features/vendor/components/TopProductsTable';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { cn } from '@/shared/utils/cn';
import type { AnalyticsPeriod } from '@/features/analytics/types';

const PERIODS: { key: AnalyticsPeriod; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: '1y', label: '1 year' },
];

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function VendorAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');
  const { overview, revenueSeries, topProducts, isLoading, error } = useAnalytics(period);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">Track your store's performance over time.</p>
        </div>

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                period === key
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={overview ? formatCurrency(overview.totalRevenue) : '—'}
          icon={DollarSign}
          change={overview?.revenueChange}
          isLoading={isLoading}
          iconClassName="bg-blue-600"
        />
        <StatCard
          label="Total Orders"
          value={overview?.totalOrders ?? '—'}
          icon={ShoppingCart}
          change={overview?.ordersChange}
          isLoading={isLoading}
          iconClassName="bg-indigo-600"
        />
        <StatCard
          label="Products Listed"
          value={overview?.totalProducts ?? '—'}
          icon={Package}
          isLoading={isLoading}
          iconClassName="bg-violet-600"
        />
        <StatCard
          label="Customers"
          value={overview?.totalCustomers ?? '—'}
          icon={Users}
          isLoading={isLoading}
          iconClassName="bg-pink-600"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-slate-800">Revenue</h2>
          <RevenueChart data={revenueSeries} isLoading={isLoading} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-slate-800">Orders</h2>
          <OrdersBarChart data={revenueSeries} isLoading={isLoading} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-800">Top Products by Revenue</h2>
        </div>
        <div className="p-6">
          <TopProductsTable products={topProducts} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
