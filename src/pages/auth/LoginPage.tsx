import { TempNav } from '@/shared/components/layout/TempNav';

export function LoginPage() {
  return (
    <div>
      <TempNav />
      <main className="flex min-h-[calc(100vh-52px)] flex-col items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
              Phase 2
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          </div>
          <p className="text-sm text-gray-500">
            React Hook Form + Zod validation, JWT auth, and role-based redirect coming in Phase 2.
          </p>
        </div>
      </main>
    </div>
  );
}
