import { useAppDispatch } from '@/app/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  verificationPending,
  clearVerification,
  logout,
} from '../slice/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from '../api/authApi';
import type { User } from '../types';
import type { LoginFormData, RegisterFormData } from '../types/schemas';

type RtkError = { data?: { message?: string; retryAfterSeconds?: number } };

export function useAuthActions() {
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [verifyEmailMutation] = useVerifyEmailMutation();
  const [resendVerificationMutation] = useResendVerificationMutation();

  async function login(credentials: LoginFormData): Promise<User> {
    dispatch(loginStart());
    try {
      const data = await loginMutation(credentials).unwrap();
      dispatch(loginSuccess(data));
      return data.user;
    } catch (err) {
      const message = (err as RtkError)?.data?.message ?? 'Login failed';
      dispatch(loginFailure(message));
      throw err;
    }
  }

  async function register(formData: RegisterFormData): Promise<void> {
    const { name, email, password, role } = formData;
    dispatch(loginStart());
    try {
      const data = await registerMutation({ name, email, password, role }).unwrap();
      dispatch(verificationPending({ email: data.email, devCode: data.devCode }));
    } catch (err) {
      const message = (err as RtkError)?.data?.message ?? 'Registration failed';
      dispatch(loginFailure(message));
      throw err;
    }
  }

  async function verifyEmail(email: string, code: string): Promise<User> {
    dispatch(loginStart());
    try {
      const data = await verifyEmailMutation({ email, code }).unwrap();
      dispatch(loginSuccess(data));
      dispatch(clearVerification());
      return data.user;
    } catch (err) {
      const message = (err as RtkError)?.data?.message ?? 'Invalid verification code';
      dispatch(loginFailure(message));
      throw err;
    }
  }

  async function resendCode(email: string): Promise<void> {
    try {
      await resendVerificationMutation({ email }).unwrap();
    } catch (err) {
      const { message, retryAfterSeconds } = (err as RtkError)?.data ?? {};
      throw Object.assign(new Error(message ?? 'Failed to resend code'), { retryAfterSeconds });
    }
  }

  function signOut() {
    dispatch(logout());
  }

  return { login, register, verifyEmail, resendCode, signOut };
}
