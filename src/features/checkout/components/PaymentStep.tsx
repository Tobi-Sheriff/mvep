import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { paymentSchema, type PaymentFormData } from '@/features/checkout/schemas';
import type { CheckoutPayment } from '@/features/checkout/types';

interface Props {
  defaultValues: CheckoutPayment | null;
  onNext: (data: CheckoutPayment) => void;
  onBack: () => void;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  cn(
    'w-full rounded-lg border px-3 py-2 text-sm outline-none transition',
    'focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
    hasError ? 'border-red-400 bg-red-50' : 'border-slate-300',
  );

const selectCls = (hasError?: boolean) =>
  cn(inputCls(hasError), 'bg-white');

const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const CURRENT_YEAR = new Date().getFullYear() % 100;
const YEARS = Array.from({ length: 10 }, (_, i) => String(CURRENT_YEAR + i).padStart(2, '0'));

export function PaymentStep({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Payment details</h2>

      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
        <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
        <span>This is a demo — enter any test values. No real charges will be made.</span>
      </div>

      <Field label="Name on card" error={errors.nameOnCard?.message}>
        <input
          {...register('nameOnCard')}
          className={inputCls(!!errors.nameOnCard)}
          placeholder="Alice Johnson"
        />
      </Field>

      <Field label="Card number (16 digits, no spaces)" error={errors.cardNumber?.message}>
        <input
          {...register('cardNumber')}
          className={inputCls(!!errors.cardNumber)}
          placeholder="4111111111111111"
          maxLength={16}
        />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Month" error={errors.expiryMonth?.message}>
          <select {...register('expiryMonth')} className={selectCls(!!errors.expiryMonth)}>
            <option value="">MM</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Year" error={errors.expiryYear?.message}>
          <select {...register('expiryYear')} className={selectCls(!!errors.expiryYear)}>
            <option value="">YY</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
        <Field label="CVV" error={errors.cvv?.message}>
          <input
            {...register('cvv')}
            className={inputCls(!!errors.cvv)}
            placeholder="123"
            maxLength={4}
          />
        </Field>
      </div>

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Review order
        </button>
      </div>
    </form>
  );
}
