import { type ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-lg text-white">
            M
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">MVEP</h1>
          <p className="text-sm text-slate-500">Multi-Vendor E-Commerce Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}
