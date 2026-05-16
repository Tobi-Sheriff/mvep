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
    resendVerification: builder.mutation<{ devCode: string }, { email: string }>({
      query: (body) => ({ url: '/auth/resend-verification', method: 'POST', body }),
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
