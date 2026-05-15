import { TempNav } from '@/shared/components/layout/TempNav';

export function VendorDashboardPage() {
  return (
    <div>
      <TempNav />
      <main className="flex min-h-[calc(100vh-52px)] flex-col items-center justify-center bg-orange-50 p-8">
        <div className="w-full max-w-lg rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
              Phase 3
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500">
            Sidebar layout, revenue stat cards, and recent order summary coming in Phase 3.
          </p>
        </div>
      </main>
    </div>
  );
}
