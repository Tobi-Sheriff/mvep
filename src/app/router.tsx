import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { VendorDashboardPage } from '@/pages/vendor/DashboardPage';
import { VendorProductsPage } from '@/pages/vendor/ProductsPage';
import { VendorOrdersPage } from '@/pages/vendor/OrdersPage';
import { VendorAnalyticsPage } from '@/pages/vendor/AnalyticsPage';
import { StorefrontPage } from '@/pages/customer/StorefrontPage';
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage';
import { CartPage } from '@/pages/customer/CartPage';
import { CheckoutPage } from '@/pages/customer/CheckoutPage';
import { OrderHistoryPage } from '@/pages/customer/OrderHistoryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/store" replace /> },

  // Auth
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // Vendor portal — PrivateRoute + RoleGuard added in Phase 2
  { path: '/vendor', element: <Navigate to="/vendor/dashboard" replace /> },
  { path: '/vendor/dashboard', element: <VendorDashboardPage /> },
  { path: '/vendor/products', element: <VendorProductsPage /> },
  { path: '/vendor/orders', element: <VendorOrdersPage /> },
  { path: '/vendor/analytics', element: <VendorAnalyticsPage /> },

  // Customer storefront
  { path: '/store', element: <StorefrontPage /> },
  { path: '/store/product/:id', element: <ProductDetailPage /> },
  { path: '/store/cart', element: <CartPage /> },
  { path: '/store/checkout', element: <CheckoutPage /> },
  { path: '/store/orders', element: <OrderHistoryPage /> },

  { path: '*', element: <NotFoundPage /> },
]);
