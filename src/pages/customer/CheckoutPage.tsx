import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { useCheckout } from '@/features/checkout/hooks/useCheckout';
import { CheckoutStepper } from '@/features/checkout/components/CheckoutStepper';
import { DeliveryStep } from '@/features/checkout/components/DeliveryStep';
import { PaymentStep } from '@/features/checkout/components/PaymentStep';
import { ReviewStep } from '@/features/checkout/components/ReviewStep';
import { ConfirmationStep } from '@/features/checkout/components/ConfirmationStep';

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.cart.items);
  const {
    step, setStep,
    address, setAddress,
    payment, setPayment,
    orderId, isPlacing, placeError, placeOrder,
    subtotal, shipping, total,
  } = useCheckout();

  // Redirect to cart if cart is emptied (except on confirmation step)
  useEffect(() => {
    if (step !== 4 && items.length === 0) {
      navigate('/store/cart', { replace: true });
    }
  }, [items.length, step, navigate]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      {step < 4 && <CheckoutStepper step={step} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 1 && (
          <DeliveryStep
            defaultValues={address}
            onNext={(data) => { setAddress(data); setStep(2); }}
          />
        )}

        {step === 2 && (
          <PaymentStep
            defaultValues={payment}
            onNext={(data) => { setPayment(data); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && address && payment && (
          <ReviewStep
            address={address}
            payment={payment}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            onBack={() => setStep(2)}
            onPlaceOrder={placeOrder}
            isPlacing={isPlacing}
            error={placeError}
          />
        )}

        {step === 4 && orderId && (
          <ConfirmationStep orderId={orderId} />
        )}
      </div>
    </div>
  );
}
