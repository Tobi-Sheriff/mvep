import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  verificationPending,
  clearVerification,
  logout,
  clearError,
} from '@/features/auth/slice/authSlice';

const mockUser = { id: '1', name: 'Alice', email: 'alice@example.com', role: 'customer' as const };
const mockToken = 'mock-jwt-token-123';

const emptyAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingVerification: null,
};

function makeStore(preloadedState?: { auth: typeof emptyAuthState }) {
  return configureStore({ reducer: { auth: authReducer }, preloadedState });
}

describe('authSlice', () => {
  it('has unauthenticated initial state when localStorage is empty', () => {
    const store = makeStore();
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('loginStart sets isLoading to true', () => {
    const store = makeStore();
    store.dispatch(loginStart());
    expect(store.getState().auth.isLoading).toBe(true);
  });

  it('loginStart clears existing error', () => {
    const store = makeStore({ auth: { ...emptyAuthState, error: 'previous error' } });
    store.dispatch(loginStart());
    expect(store.getState().auth.error).toBeNull();
  });

  it('loginSuccess sets user and token in state', () => {
    const store = makeStore();
    store.dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('loginSuccess persists token and user to localStorage', () => {
    const store = makeStore();
    store.dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    expect(localStorage.getItem('mvep_token')).toBe(mockToken);
    expect(JSON.parse(localStorage.getItem('mvep_user')!)).toEqual(mockUser);
  });

  it('loginSuccess clears pendingVerification', () => {
    const store = makeStore({
      auth: {
        ...emptyAuthState,
        pendingVerification: { email: 'alice@example.com', devCode: '123456' },
      },
    });
    store.dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    expect(store.getState().auth.pendingVerification).toBeNull();
  });

  it('loginFailure sets error message', () => {
    const store = makeStore();
    store.dispatch(loginFailure('Invalid credentials'));
    expect(store.getState().auth.error).toBe('Invalid credentials');
  });

  it('loginFailure clears isLoading', () => {
    const store = makeStore({ auth: { ...emptyAuthState, isLoading: true } });
    store.dispatch(loginFailure('Some error'));
    expect(store.getState().auth.isLoading).toBe(false);
  });

  it('verificationPending sets pendingVerification and clears isLoading', () => {
    const store = makeStore({ auth: { ...emptyAuthState, isLoading: true } });
    const pending = { email: 'alice@example.com', devCode: '654321' };
    store.dispatch(verificationPending(pending));
    const state = store.getState().auth;
    expect(state.pendingVerification).toEqual(pending);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clearVerification removes pendingVerification', () => {
    const store = makeStore({
      auth: {
        ...emptyAuthState,
        pendingVerification: { email: 'alice@example.com', devCode: '123456' },
      },
    });
    store.dispatch(clearVerification());
    expect(store.getState().auth.pendingVerification).toBeNull();
  });

  it('logout clears all auth state', () => {
    const store = makeStore({
      auth: {
        ...emptyAuthState,
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
      },
    });
    store.dispatch(logout());
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('logout removes token and user from localStorage', () => {
    localStorage.setItem('mvep_token', mockToken);
    localStorage.setItem('mvep_user', JSON.stringify(mockUser));
    const store = makeStore();
    store.dispatch(logout());
    expect(localStorage.getItem('mvep_token')).toBeNull();
    expect(localStorage.getItem('mvep_user')).toBeNull();
  });

  it('clearError sets error to null', () => {
    const store = makeStore({ auth: { ...emptyAuthState, error: 'stale error' } });
    store.dispatch(clearError());
    expect(store.getState().auth.error).toBeNull();
  });
});
