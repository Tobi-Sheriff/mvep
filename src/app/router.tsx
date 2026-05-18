import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PrivateRoute } from '@/features/auth/components/PrivateRoute';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StorefrontLayout } from '@/shared/components/layout/StorefrontLayout';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const EmailVerificationPage = lazy(() =>
  import('@/pages/auth/EmailVerificationPage').then((m) => ({ default: m.EmailVerificationPage })),
);

// Vendor pages
const VendorDashboardPage = lazy(() =>
  import('@/pages/vendor/DashboardPage').then((m) => ({ default: m.VendorDashboardPage })),
);
const VendorProductsPage = lazy(() =>
  import('@/pages/vendor/ProductsPage').then((m) => ({ default: m.VendorProductsPage })),
);
const VendorOrdersPage = lazy(() =>
  import('@/pages/vendor/OrdersPage').then((m) => ({ default: m.VendorOrdersPage })),
);
const VendorAnalyticsPage = lazy(() =>
  import('@/pages/vendor/AnalyticsPage').then((m) => ({ default: m.VendorAnalyticsPage })),
);

// Admin pages
const AdminOverviewPage = lazy(() =>
  import('@/pages/admin/OverviewPage').then((m) => ({ default: m.AdminOverviewPage })),
);
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/UsersPage').then((m) => ({ default: m.AdminUsersPage })),
);
const AdminVendorsPage = lazy(() =>
  import('@/pages/admin/VendorsPage').then((m) => ({ default: m.AdminVendorsPage })),
);
const AdminOrdersPage = lazy(() =>
  import('@/pages/admin/OrdersPage').then((m) => ({ default: m.AdminOrdersPage })),
);

// Customer pages
const StorefrontPage = lazy(() =>
  import('@/pages/customer/StorefrontPage').then((m) => ({ default: m.StorefrontPage })),
);
const ProductDetailPage = lazy(() =>
  import('@/pages/customer/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })),
);
const CartPage = lazy(() => import('@/pages/customer/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/customer/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderHistoryPage = lazy(() =>
  import('@/pages/customer/OrderHistoryPage').then((m) => ({ default: m.OrderHistoryPage })),
);
const WishlistPage = lazy(() => import('@/pages/customer/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/store" replace /> },

  // Auth — public
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/verify-email', element: <EmailVerificationPage /> },

  // Vendor portal — vendor only (admin has their own portal)
  {
    path: '/vendor',
    element: (
      <PrivateRoute allowedRoles={['vendor']}>
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

  // Admin console — admin only
  {
    path: '/admin',
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: 'overview', element: <AdminOverviewPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'vendors', element: <AdminVendorsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
    ],
  },

  // Customer storefront
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
