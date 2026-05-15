import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StorefrontLayout } from '@/shared/components/layout/StorefrontLayout';
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
import { WishlistPage } from '@/pages/customer/WishlistPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/store" replace /> },

  // Auth — public
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/verify-email', element: <EmailVerificationPage /> },

  // Vendor portal — sidebar layout, vendor + admin only
  {
    path: '/vendor',
    element: (
      <PrivateRoute allowedRoles={['vendor', 'admin']}>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <VendorDashboardPage /> },
      { path: 'products', element: <VendorProductsPage /> },
      { path: 'orders', element: <VendorOrdersPage /> },
      { path: 'analytics', element: <VendorAnalyticsPage /> },
    ],
  },

  // Customer storefront — StorefrontLayout wraps all /store/* routes
  {
    path: '/store',
    element: <StorefrontLayout />,
    children: [
      { index: true, element: <StorefrontPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      {
        path: 'orders',
        element: (
          <PrivateRoute allowedRoles={['customer']}>
            <OrderHistoryPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <PrivateRoute allowedRoles={['customer', 'vendor', 'admin']}>
            <WishlistPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
]);
