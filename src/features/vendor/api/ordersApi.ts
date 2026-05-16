import { baseApi } from '@/app/api';
import type { Order, OrderStatus, OrdersResponse } from '@/features/orders/types';

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, { status?: OrderStatus; limit?: number } | void>({
      query: (args) => {
        const params = new URLSearchParams({ limit: String(args?.limit ?? 20) });
        if (args?.status) params.set('status', args.status);
        return `/orders?${params}`;
      },
      providesTags: ['Order'],
    }),

    updateOrderStatus: builder.mutation<Order, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      // Optimistic update across all cached getOrders results
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const now = new Date().toISOString();
        const patches = [undefined, 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
          (s) =>
            dispatch(
              ordersApi.util.updateQueryData('getOrders', s ? { status: s as OrderStatus } : undefined, (draft) => {
                const order = draft.orders.find((o) => o.id === id);
                if (order) { order.status = status; order.updatedAt = now; }
              }),
            ),
        );
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useGetOrdersQuery, useUpdateOrderStatusMutation } = ordersApi;
