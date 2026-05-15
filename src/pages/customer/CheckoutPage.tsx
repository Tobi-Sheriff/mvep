import { TempNav } from '@/shared/components/layout/TempNav';

export function CheckoutPage() {
  return (
    <div>
      <TempNav />
      <main className="flex min-h-[calc(100vh-52px)] flex-col items-center justify-center bg-green-50 p-8">
        <div className="w-full max-w-lg rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
              Phase 5
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>
          <p className="text-sm text-gray-500">
            Multi-step checkout (Address → Payment → Review → Confirm) with Zod validation coming in Phase 5.
          </p>
        </div>
      </main>
    </div>
  );
}
