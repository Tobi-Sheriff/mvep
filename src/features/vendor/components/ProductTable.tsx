import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import type { Product } from '@/features/vendor/types';

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function stockBadge(stock: number) {
  if (stock === 0) return <Badge variant="danger">Out of stock</Badge>;
  if (stock <= 10) return <Badge variant="warning">Low: {stock}</Badge>;
  return <Badge variant="success">{stock} in stock</Badge>;
}

export function ProductTable({ products, isLoading, onEdit, onDelete }: ProductTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        No products found. Add your first product.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="pb-3 pr-4">Product</th>
            <th className="pb-3 pr-4">Category</th>
            <th className="pb-3 pr-4">Price</th>
            <th className="pb-3 pr-4">Stock</th>
            <th className="pb-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="text-slate-700">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="line-clamp-1 max-w-[200px] text-xs text-slate-400">
                      {product.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4 text-slate-500">{product.category}</td>
              <td className="py-3 pr-4 font-semibold">${product.price.toFixed(2)}</td>
              <td className="py-3 pr-4">{stockBadge(product.stock)}</td>
              <td className="py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    title="Edit product"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete product"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
