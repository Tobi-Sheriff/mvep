import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, PendingVerification, User } from '../types';

const TOKEN_KEY = 'mvep_token';
const USER_KEY = 'mvep_user';

function loadStoredAuth(): Pick<AuthState, 'user' | 'token'> {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

const { token, user } = loadStoredAuth();

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: Boolean(token && user),
  isLoading: false,
  error: null,
  pendingVerification: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      state.pendingVerification = null;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    verificationPending(state, action: PayloadAction<PendingVerification>) {
      state.pendingVerification = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearVerification(state) {
      state.pendingVerification = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.pendingVerification = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  verificationPending,
  clearVerification,
  logout,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
