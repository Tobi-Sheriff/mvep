import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/utils/cn';
import { addressSchema, type AddressFormData } from '@/features/checkout/schemas';
import type { CheckoutAddress } from '@/features/checkout/types';

interface Props {
  defaultValues: CheckoutAddress | null;
  onNext: (data: CheckoutAddress) => void;
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

export function DeliveryStep({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues ?? { country: 'United States' },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Delivery address</h2>

      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" error={errors.firstName?.message}>
          <input {...register('firstName')} className={inputCls(!!errors.firstName)} placeholder="Alice" />
        </Field>
        <Field label="Last name" error={errors.lastName?.message}>
          <input {...register('lastName')} className={inputCls(!!errors.lastName)} placeholder="Johnson" />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <input {...register('email')} type="email" className={inputCls(!!errors.email)} placeholder="alice@example.com" />
      </Field>

      <Field label="Street address" error={errors.address?.message}>
        <input {...register('address')} className={inputCls(!!errors.address)} placeholder="123 Main St" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="City" error={errors.city?.message}>
          <input {...register('city')} className={inputCls(!!errors.city)} placeholder="Los Angeles" />
        </Field>
        <Field label="State / Region" error={errors.state?.message}>
          <input {...register('state')} className={inputCls(!!errors.state)} placeholder="CA" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="ZIP code" error={errors.zipCode?.message}>
          <input {...register('zipCode')} className={inputCls(!!errors.zipCode)} placeholder="90210" />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <input {...register('country')} className={inputCls(!!errors.country)} placeholder="United States" />
        </Field>
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Continue to payment
      </button>
    </form>
  );
}
