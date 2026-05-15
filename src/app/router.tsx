import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { EmailVerificationPage } from '@/pages/auth/EmailVerificationPage';
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

  // Auth — public
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/verify-email', element: <EmailVerificationPage /> },

  // Vendor portal — vendor + admin only
  { path: '/vendor', element: <Navigate to="/vendor/dashboard" replace /> },
  {
    path: '/vendor/dashboard',
    element: <PrivateRoute allowedRoles={['vendor', 'admin']}><VendorDashboardPage /></PrivateRoute>,
  },
  {
    path: '/vendor/products',
    element: <PrivateRoute allowedRoles={['vendor', 'admin']}><VendorProductsPage /></PrivateRoute>,
  },
  {
    path: '/vendor/orders',
    element: <PrivateRoute allowedRoles={['vendor', 'admin']}><VendorOrdersPage /></PrivateRoute>,
  },
  {
    path: '/vendor/analytics',
    element: <PrivateRoute allowedRoles={['vendor', 'admin']}><VendorAnalyticsPage /></PrivateRoute>,
  },

  // Customer storefront — public browsing, auth required for orders
  { path: '/store', element: <StorefrontPage /> },
  { path: '/store/product/:id', element: <ProductDetailPage /> },
  { path: '/store/cart', element: <CartPage /> },
  { path: '/store/checkout', element: <CheckoutPage /> },
  {
    path: '/store/orders',
    element: <PrivateRoute allowedRoles={['customer']}><OrderHistoryPage /></PrivateRoute>,
  },

  { path: '*', element: <NotFoundPage /> },
]);
