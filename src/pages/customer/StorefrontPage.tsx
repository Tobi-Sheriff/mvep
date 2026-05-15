import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useStorefront } from '@/features/customer/hooks/useStorefront';
import { useWishlist } from '@/features/customer/hooks/useWishlist';
import { FilterSidebar } from '@/features/customer/components/FilterSidebar';
import { ProductGrid } from '@/features/customer/components/ProductGrid';

export function StorefrontPage() {
  const { products, total, totalPages, page, setPage, filters, updateFilter, resetFilters, isLoading } = useStorefront();
  const { wishlistIds, toggleWishlist } = useWishlist();

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-6">
      <FilterSidebar
        filters={filters}
        onChange={updateFilter}
        onReset={resetFilters}
        total={total}
      />

      <div className="min-w-0 flex-1">
        <ProductGrid
          products={products}
          wishlistIds={wishlistIds}
          onWishlistToggle={toggleWishlist}
          isLoading={isLoading}
        />

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-300 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'h-8 w-8 rounded-lg text-sm font-medium',
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 text-slate-600 hover:bg-slate-50',
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-300 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
