import { useGetCustomerOrdersQuery } from '@/features/orders/api/customerOrdersApi';

export function useCustomerOrders() {
  const { data, isLoading } = useGetCustomerOrdersQuery();
  return {
    orders: data?.orders ?? [],
    isLoading,
  };
}
