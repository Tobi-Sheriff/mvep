import { isAxiosError } from 'axios';
import { useAppDispatch } from '@/app/hooks';
import { loginStart, loginSuccess, loginFailure, logout } from '../slice/authSlice';
import { api } from '@/shared/utils/axiosInstance';
import type { User } from '../types';
import type { LoginFormData, RegisterFormData } from '../types/schemas';

export function useAuthActions() {
  const dispatch = useAppDispatch();

  async function login(credentials: LoginFormData): Promise<User> {
    dispatch(loginStart());
    try {
      const { data } = await api.post<{ user: User; token: string }>('/auth/login', credentials);
      dispatch(loginSuccess(data));
      return data.user;
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Login failed'
        : 'Login failed';
      dispatch(loginFailure(message));
      throw err;
    }
  }

  async function register(formData: RegisterFormData): Promise<User> {
    const { name, email, password, role } = formData;
    dispatch(loginStart());
    try {
      const { data } = await api.post<{ user: User; token: string }>('/auth/register', {
        name,
        email,
        password,
        role,
      });
      dispatch(loginSuccess(data));
      return data.user;
    } catch (err) {
      const message = isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message ?? 'Registration failed'
        : 'Registration failed';
      dispatch(loginFailure(message));
      throw err;
    }
  }

  function signOut() {
    dispatch(logout());
  }

  return { login, register, signOut };
}
