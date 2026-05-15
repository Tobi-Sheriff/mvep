import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import type { Order, OrderStatus, OrdersResponse } from '@/features/orders/types';

export function useOrders(statusFilter?: OrderStatus) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get<OrdersResponse>(`/orders?${params}`);
      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const previous = orders.find((o) => o.id === id);
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o)),
    );
    try {
      await api.patch(`/orders/${id}/status`, { status });
    } catch {
      // Roll back on failure
      if (previous) {
        setOrders((prev) => prev.map((o) => (o.id === id ? previous : o)));
      }
      throw new Error('Failed to update order status');
    }
  }

  return { orders, total, isLoading, error, refetch: fetchOrders, updateOrderStatus };
}
