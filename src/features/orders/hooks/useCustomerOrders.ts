import { useState, useEffect } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import type { Order, OrdersResponse } from '@/features/orders/types';

export function useCustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<OrdersResponse>('/orders?customerId=me')
      .then((res) => setOrders(res.data.orders))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return { orders, isLoading };
}
