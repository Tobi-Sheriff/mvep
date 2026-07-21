import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError, type FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { logout, sessionEnded } from '@/features/auth/slice/authSlice';
import { apiReachableRestored, apiUnreachableDetected } from '@/app/connectivitySlice';

// authenticate.ts (backend) throws 403 with exactly this message for a
// banned/suspended account re-checked mid-session — distinguish it from an
// ordinary 403 (e.g. a vendor blocked from editing another vendor's product),
// which must NOT log the user out.
function accountRestrictedMessage(error: FetchBaseQueryError): string | null {
  if (error.status !== 403) return null;
  const data = error.data;
  const message = typeof data === 'object' && data !== null && 'message' in data ? (data as { message?: unknown }).message : null;
  return typeof message === 'string' && /^account (suspended|banned)$/i.test(message) ? message : null;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: (import.meta.env.VITE_API_BASE_URL ?? '') + '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: { token: string | null } }).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWith401: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  } else if (result.error) {
    const restrictedMessage = accountRestrictedMessage(result.error);
    if (restrictedMessage) api.dispatch(sessionEnded(restrictedMessage));
  }
  // FETCH_ERROR fires when the request never reaches a server at all
  // (backend down, wrong port, no network) — surface it globally so any
  // page can show a "can't reach the server" banner instead of failing silently.
  if (result.error?.status === 'FETCH_ERROR') {
    api.dispatch(apiUnreachableDetected());
  } else if (!result.error) {
    api.dispatch(apiReachableRestored());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWith401,
  tagTypes: ['Product', 'Order', 'Wishlist', 'CustomerOrder', 'AdminUser', 'AdminVendor'],
  endpoints: () => ({}),
});
