import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { StatCard } from '@/features/vendor/components/StatCard';
import { OrderTable } from '@/features/vendor/components/OrderTable';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { useOrders } from '@/features/vendor/hooks/useOrders';

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function VendorDashboardPage() {
  const { overview, isLoading: analyticsLoading } = useAnalytics('30d');
  const { orders, isLoading: ordersLoading } = useOrders();

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={overview ? formatCurrency(overview.totalRevenue) : '—'}
          icon={DollarSign}
          change={overview?.revenueChange}
          isLoading={analyticsLoading}
          iconClassName="bg-blue-600"
        />
        <StatCard
          label="Total Orders"
          value={overview?.totalOrders ?? '—'}
          icon={ShoppingCart}
          change={overview?.ordersChange}
          isLoading={analyticsLoading}
          iconClassName="bg-indigo-600"
        />
        <StatCard
          label="Products"
          value={overview?.totalProducts ?? '—'}
          icon={Package}
          isLoading={analyticsLoading}
          iconClassName="bg-violet-600"
        />
        <StatCard
          label="Customers"
          value={overview?.totalCustomers ?? '—'}
          icon={Users}
          isLoading={analyticsLoading}
          iconClassName="bg-pink-600"
        />
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-800">Recent Orders</h2>
        </div>
        <div className="p-6">
          <OrderTable orders={recentOrders} isLoading={ordersLoading} compact />
        </div>
      </div>
    </div>
  );
}
