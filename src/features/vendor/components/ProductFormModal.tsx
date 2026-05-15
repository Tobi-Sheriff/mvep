import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/shared/components/ui/Modal';
import { productSchema, type ProductFormData } from '@/features/vendor/types/schemas';
import { PRODUCT_CATEGORIES } from '@/features/vendor/types';
import type { Product } from '@/features/vendor/types';

interface ProductFormModalProps {
  open: boolean;
  product?: Product | null;
  isLoading?: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

export function ProductFormModal({ open, product, isLoading, onSubmit, onClose }: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({ resolver: zodResolver(productSchema) });

  useEffect(() => {
    if (open) {
      reset(
        product
          ? { name: product.name, description: product.description, price: product.price, stock: product.stock, category: product.category, image: product.image }
          : { name: '', description: '', price: 0, stock: 0, category: '', image: '' },
      );
    }
  }, [open, product, reset]);

  async function handleFormSubmit(data: ProductFormData) {
    await onSubmit(data);
    onClose();
  }

  const fieldClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
  const errorClass = 'mt-1 text-xs text-red-500';
  const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add Product'}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className={labelClass}>Name</label>
          <input {...register('name')} type="text" placeholder="Product name" className={fieldClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Describe your product…"
            className={fieldClass}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price ($)</label>
            <input {...register('price')} type="number" step="0.01" min="0" placeholder="0.00" className={fieldClass} />
            {errors.price && <p className={errorClass}>{errors.price.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input {...register('stock')} type="number" min="0" placeholder="0" className={fieldClass} />
            {errors.stock && <p className={errorClass}>{errors.stock.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select {...register('category')} className={fieldClass}>
            <option value="">Select category…</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Image URL (optional)</label>
          <input {...register('image')} type="url" placeholder="https://…" className={fieldClass} />
          {errors.image && <p className={errorClass}>{errors.image.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Saving…' : product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
