import { type PropsWithChildren, type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slice/authSlice';
import cartReducer from '@/features/cart/slice/cartSlice';
import connectivityReducer from '@/app/connectivitySlice';
import { baseApi } from '@/app/api';
import type { RootState } from '@/app/store';

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      connectivity: connectivityReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState,
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, initialEntries = ['/'], ...renderOptions }: ExtendedRenderOptions = {},
) {
  const store = makeStore(preloadedState);

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
