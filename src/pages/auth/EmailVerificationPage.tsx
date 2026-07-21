import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

const verifySchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain digits only'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const { pendingVerification, isLoading, error } = useAuth();
  const { verifyEmail, resendCode } = useAuthActions();
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState(0);

  useEffect(() => {
    if (retryAfter <= 0) return;
    const timer = setInterval(() => setRetryAfter((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [retryAfter]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    // devCode is only ever populated by the backend outside production, but gate
    // it client-side too so a prod build never auto-fills/shows a real code.
    defaultValues: { code: import.meta.env.DEV ? (pendingVerification?.devCode ?? '') : '' },
  });

  // Guard: if no pending verification, send back to register
  if (!pendingVerification) {
    return <Navigate to="/register" replace />;
  }

  const { email } = pendingVerification;

  async function onSubmit(data: VerifyFormData) {
    try {
      const user = await verifyEmail(email, data.code);
      navigate(user.role === 'customer' ? '/store' : '/vendor/dashboard', { replace: true });
    } catch {
      // error surfaced via Redux state
    }
  }

  async function handleResend() {
    if (retryAfter > 0) return;
    setResendError(null);
    try {
      await resendCode(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (err) {
      const retryAfterSeconds = (err as { retryAfterSeconds?: number })?.retryAfterSeconds;
      if (retryAfterSeconds) {
        setRetryAfter(retryAfterSeconds);
        setResendError(`Too many attempts. Try again in ${retryAfterSeconds}s.`);
      } else {
        setResendError(err instanceof Error ? err.message : 'Failed to resend code');
      }
    }
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-3xl">
            📧
          </div>
          <h2 className="mb-1 text-xl font-semibold text-slate-900">Check your email</h2>
          <p className="text-sm text-slate-500">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-slate-700">{email}</span>
          </p>
        </div>

        {/* Dev mode banner — gated client-side too, never shows in a production build */}
        {import.meta.env.DEV && pendingVerification.devCode && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Dev Mode
            </p>
            <p className="text-sm text-amber-800">
              Your code:{' '}
              <span className="font-mono font-bold tracking-widest">{pendingVerification.devCode}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Verification code
            </label>
            <input
              {...register('code')}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center font-mono text-lg tracking-widest outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>
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
            {isLoading ? 'Verifying…' : 'Verify Email'}
          </button>
        </form>

        {resendError && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">{resendError}</div>
        )}

        <p className="mt-4 text-center text-sm text-slate-500">
          Didn't receive it?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={retryAfter > 0}
            className="font-medium text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
          >
            {resent ? '✓ Sent!' : retryAfter > 0 ? `Try again in ${retryAfter}s` : 'Resend code'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
