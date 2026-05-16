import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '@/features/vendor/api/ordersApi';
import type { OrderStatus } from '@/features/orders/types';

export function useOrders(statusFilter?: OrderStatus) {
  const { data, isLoading, error } = useGetOrdersQuery(
    statusFilter ? { status: statusFilter } : undefined,
  );
  const [updateStatusMutation] = useUpdateOrderStatusMutation();

  async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    await updateStatusMutation({ id, status }).unwrap();
  }

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error ? 'Failed to load orders' : null,
    refetch: () => {},
    updateOrderStatus,
  };
}
