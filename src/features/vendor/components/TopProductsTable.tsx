import { Skeleton } from '@/shared/components/ui/Skeleton';
import type { TopProduct } from '@/features/analytics/types';

interface TopProductsTableProps {
  products: TopProduct[];
  isLoading?: boolean;
}

export function TopProductsTable({ products, isLoading }: TopProductsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
          <th className="pb-3 pr-4">#</th>
          <th className="pb-3 pr-4">Product</th>
          <th className="pb-3 pr-4 text-right">Units Sold</th>
          <th className="pb-3 text-right">Revenue</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {products.map((product, idx) => (
          <tr key={product.id} className="text-slate-700">
            <td className="py-3 pr-4 text-slate-400">{idx + 1}</td>
            <td className="py-3 pr-4 font-medium">{product.name}</td>
            <td className="py-3 pr-4 text-right text-slate-500">{product.unitsSold}</td>
            <td className="py-3 text-right font-semibold">${product.revenue.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
