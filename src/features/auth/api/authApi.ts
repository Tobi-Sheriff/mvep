import { baseApi } from '@/app/api';
import type { User } from '@/features/auth/types';

interface LoginRequest { email: string; password: string; }
interface LoginResponse { user: User; token: string; }
interface RegisterRequest { name: string; email: string; password: string; role: string; }
interface RegisterResponse { requiresVerification: boolean; email: string; devCode: string; }
interface VerifyEmailRequest { email: string; code: string; }

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    verifyEmail: builder.mutation<LoginResponse, VerifyEmailRequest>({
      query: (body) => ({ url: '/auth/verify-email', method: 'POST', body }),
    }),
    resendVerification: builder.mutation<{ message?: string }, { email: string }>({
      query: (body) => ({ url: '/auth/resend-verification', method: 'POST', body }),
      // Surface Retry-After (seconds) from the 429 rate-limit response so the UI can
      // show a countdown instead of a generic error.
      transformErrorResponse: (response, meta) => {
        const original = response.data;
        const retryAfterHeader = meta?.response?.headers.get('Retry-After');
        return {
          ...(typeof original === 'object' && original !== null ? original : { message: String(original) }),
          retryAfterSeconds: retryAfterHeader ? Number(retryAfterHeader) : undefined,
        };
      },
    }),
    logoutApi: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useLogoutApiMutation,
} = authApi;
