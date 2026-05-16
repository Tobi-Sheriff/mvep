import { baseApi } from '@/app/api';
import type { Order, OrdersResponse, OrderItem } from '@/features/orders/types';

interface PlaceOrderRequest {
  items: OrderItem[];
  total: number;
}

const customerOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerOrders: builder.query<OrdersResponse, void>({
      query: () => '/orders?customerId=me',
      providesTags: ['CustomerOrder'],
    }),

    placeOrder: builder.mutation<Order, PlaceOrderRequest>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['CustomerOrder'],
    }),
  }),
});

export const { useGetCustomerOrdersQuery, usePlaceOrderMutation } = customerOrdersApi;
