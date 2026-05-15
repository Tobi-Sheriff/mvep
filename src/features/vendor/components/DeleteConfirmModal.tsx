import { Modal } from '@/shared/components/ui/Modal';
import type { Product } from '@/features/vendor/types';

interface DeleteConfirmModalProps {
  product: Product | null;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({ product, isLoading, onConfirm, onClose }: DeleteConfirmModalProps) {
  return (
    <Modal open={!!product} onClose={onClose} title="Delete Product">
      <p className="mb-6 text-sm text-slate-600">
        Are you sure you want to delete{' '}
        <span className="font-semibold text-slate-800">{product?.name}</span>? This action cannot
        be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
