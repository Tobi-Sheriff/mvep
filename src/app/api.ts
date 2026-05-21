import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '@/features/auth/slice/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: (import.meta.env.VITE_API_BASE_URL ?? '') + '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { token: string | null } }).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWith401: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWith401,
  tagTypes: ['Product', 'Order', 'Wishlist', 'CustomerOrder', 'AdminUser', 'AdminVendor'],
  endpoints: () => ({}),
});
