import { useState } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearCart } from '@/features/cart/slice/cartSlice';
import type { CheckoutAddress, CheckoutPayment, CheckoutStep } from '@/features/checkout/types';

export function useCheckout() {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [payment, setPayment] = useState<CheckoutPayment | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + shipping;

  async function placeOrder() {
    if (!address) return;
    setIsPlacing(true);
    setPlaceError(null);
    try {
      const { data } = await api.post<{ id: string }>('/orders', {
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
        total,
      });
      setOrderId(data.id);
      dispatch(clearCart());
      setStep(4);
    } catch {
      setPlaceError('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
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
