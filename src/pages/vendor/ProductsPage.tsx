import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ProductTable } from '@/features/vendor/components/ProductTable';
import { ProductFormModal } from '@/features/vendor/components/ProductFormModal';
import { DeleteConfirmModal } from '@/features/vendor/components/DeleteConfirmModal';
import { useProducts } from '@/features/vendor/hooks/useProducts';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { PRODUCT_CATEGORIES, type Product } from '@/features/vendor/types';
import type { ProductFormData } from '@/features/vendor/types/schemas';

export function VendorProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const { products, total, isLoading, error, createProduct, updateProduct, deleteProduct } =
    useProducts({ page, limit: 10, search: debouncedSearch, category });

  const totalPages = Math.ceil(total / 10);

  function openCreate() {
    setEditingProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setFormOpen(true);
  }

  async function handleFormSubmit(data: ProductFormData) {
    setIsMutating(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!deletingProduct) return;
    setIsMutating(true);
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">{total} product{total !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="w-56 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All categories</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="p-6">
          <ProductTable
            products={products}
            isLoading={isLoading}
            onEdit={openEdit}
            onDelete={setDeletingProduct}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        product={editingProduct}
        isLoading={isMutating}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <DeleteConfirmModal
        product={deletingProduct}
        isLoading={isMutating}
        onConfirm={handleDelete}
        onClose={() => setDeletingProduct(null)}
      />
    </div>
  );
}
