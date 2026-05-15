import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/features/auth/types/schemas';

const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'customer@mvep.dev' },
  { label: 'Vendor', email: 'vendor@mvep.dev' },
  { label: 'Admin', email: 'admin@mvep.dev' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const { isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    try {
      const user = await login(data);
      navigate(user.role === 'customer' ? '/store' : '/vendor/dashboard', { replace: true });
    } catch {
      // error is surfaced via Redux state
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-1 text-xl font-semibold text-slate-900">Welcome back</h2>
        <p className="mb-6 text-sm text-slate-500">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register
          </Link>
        </p>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="mb-2 text-center text-xs text-slate-400">Quick login — demo accounts</p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map(({ label, email }) => (
              <button
                key={email}
                type="button"
                onClick={() => {
                  setValue('email', email);
                  setValue('password', 'password');
                }}
                className="flex-1 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
