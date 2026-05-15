import { PRODUCT_CATEGORIES } from '@/features/vendor/types';
import type { StorefrontFilters, SortOption } from '@/features/customer/types';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const RATING_OPTIONS = [4, 3, 2];

interface FilterSidebarProps {
  filters: StorefrontFilters;
  onChange: <K extends keyof StorefrontFilters>(key: K, value: StorefrontFilters[K]) => void;
  onReset: () => void;
  total: number;
}

export function FilterSidebar({ filters, onChange, onReset, total }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.category || filters.minPrice || filters.maxPrice || filters.rating;

  return (
    <aside className="w-56 flex-shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{total} results</p>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Sort by</p>
        <select
          value={filters.sort}
          onChange={(e) => onChange('sort', e.target.value as SortOption)}
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Category</p>
        <div className="space-y-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={() => onChange('category', '')}
              className="accent-blue-600"
            />
            All categories
          </label>
          {PRODUCT_CATEGORIES.map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={() => onChange('category', cat)}
                className="accent-blue-600"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Min rating</p>
        <div className="space-y-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="radio"
              name="rating"
              value=""
              checked={filters.rating === ''}
              onChange={() => onChange('rating', '')}
              className="accent-blue-600"
            />
            Any rating
          </label>
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="radio"
                name="rating"
                value={String(r)}
                checked={filters.rating === String(r)}
                onChange={() => onChange('rating', String(r))}
                className="accent-blue-600"
              />
              <span className="text-amber-400">{'★'.repeat(r)}</span>
              <span className="text-slate-400">& up</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
