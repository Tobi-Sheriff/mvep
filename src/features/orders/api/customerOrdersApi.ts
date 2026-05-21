import { baseApi } from '@/app/api';
import type { Order, OrdersResponse, OrderItem } from '@/features/orders/types';

// Legacy input shape from useCheckout — items still carry full detail from the cart.
// The query function strips productName/unitPrice and adds the required new fields
// before sending to the API.
interface PlaceOrderRequest {
  items: OrderItem[];
  total: number;
}

const customerOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerOrders: builder.query<OrdersResponse, void>({
      query: () => '/orders/my',
      providesTags: ['CustomerOrder'],
    }),

    placeOrder: builder.mutation<Order, PlaceOrderRequest>({
      query: ({ items }) => ({
        url: '/orders',
        method: 'POST',
        body: {
          items: items.map(({ productId, quantity }) => ({ productId, quantity })),
          shippingAddress: { line1: '', city: '', state: '', postcode: '', country: '' },
          paymentMethod: 'card',
        },
      }),
      invalidatesTags: ['CustomerOrder'],
    }),
  }),
});

export const { useGetCustomerOrdersQuery, usePlaceOrderMutation } = customerOrdersApi;
