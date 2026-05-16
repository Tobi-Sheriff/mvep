import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slice/authSlice';
import cartReducer from '@/features/cart/slice/cartSlice';
import { baseApi } from '@/app/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
