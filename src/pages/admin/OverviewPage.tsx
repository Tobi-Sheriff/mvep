import { DollarSign, ShoppingBag, Package, Store, Users, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { useGetAdminStatsQuery } from '@/features/admin/api/adminApi';
import { useGetAdminOrdersQuery } from '@/features/admin/api/adminApi';
import { useGetAdminVendorsQuery } from '@/features/admin/api/adminApi';
import type { AdminStats } from '@/features/admin/types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  change?: number;
  icon: React.ElementType;
  iconColor: string;
}

function StatCard({ label, value, sub, change, icon: Icon, iconColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <Icon size={18} className={iconColor} aria-hidden="true" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {change !== undefined && (
        <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}% vs last period
        </p>
      )}
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-7 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

function buildCards(stats: AdminStats) {
  return [
    { label: 'Total Revenue', value: fmt(stats.totalRevenue), change: stats.revenueChange, icon: DollarSign, iconColor: 'text-emerald-500' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: stats.ordersChange, icon: ShoppingBag, iconColor: 'text-blue-500' },
    { label: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: Package, iconColor: 'text-orange-500' },
    { label: 'Active Vendors', value: stats.totalVendors.toLocaleString(), icon: Store, iconColor: 'text-violet-500' },
    { label: 'Customers', value: stats.totalCustomers.toLocaleString(), icon: Users, iconColor: 'text-sky-500' },
    { label: 'New Users (month)', value: stats.newUsersThisMonth.toLocaleString(), sub: `${stats.totalUsers} total users`, icon: UserPlus, iconColor: 'text-pink-500' },
  ];
}

export function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetAdminOrdersQuery({ limit: 5 });
  const { data: vendorsData, isLoading: vendorsLoading } = useGetAdminVendorsQuery({});

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Real-time metrics across all vendors and customers</p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statsLoading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats
            ? buildCards(stats).map((card) => <StatCard key={card.label} {...card} />)
            : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {ordersLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between px-5 py-3">
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))
              : ordersData?.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {fmt(order.total)}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Top vendors */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">Vendors by Revenue</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {vendorsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between px-5 py-4">
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
                      <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                  </div>
                ))
              : vendorsData?.vendors.map((v) => (
                  <div key={v.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{v.storeName}</p>
                      <p className="text-xs text-slate-400">{v.totalOrders} orders · {v.productCount} products</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">{fmt(v.totalRevenue)}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
