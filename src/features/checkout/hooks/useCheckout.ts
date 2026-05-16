import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearCart } from '@/features/cart/slice/cartSlice';
import { usePlaceOrderMutation } from '@/features/orders/api/customerOrdersApi';
import type { CheckoutAddress, CheckoutPayment, CheckoutStep } from '@/features/checkout/types';

export function useCheckout() {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [payment, setPayment] = useState<CheckoutPayment | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + shipping;

  const [placeOrderMutation, { isLoading: isPlacing }] = usePlaceOrderMutation();

  async function placeOrder() {
    if (!address) return;
    setPlaceError(null);
    try {
      const result = await placeOrderMutation({
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
        total,
      }).unwrap();
      setOrderId(result.id);
      dispatch(clearCart());
      setStep(4);
    } catch {
      setPlaceError('Failed to place order. Please try again.');
    }
  }

  return {
    step, setStep,
    address, setAddress,
    payment, setPayment,
    orderId, isPlacing, placeError, placeOrder,
    subtotal, shipping, total,
  };
}
