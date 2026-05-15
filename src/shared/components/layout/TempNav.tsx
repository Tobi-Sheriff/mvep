import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

const links = [
  { to: '/login', label: 'Login', group: 'auth' },
  { to: '/register', label: 'Register', group: 'auth' },
  { to: '/store', label: 'Store', group: 'customer' },
  { to: '/store/cart', label: 'Cart', group: 'customer' },
  { to: '/store/checkout', label: 'Checkout', group: 'customer' },
  { to: '/store/orders', label: 'My Orders', group: 'customer' },
  { to: '/vendor/dashboard', label: 'Dashboard', group: 'vendor' },
  { to: '/vendor/products', label: 'Products', group: 'vendor' },
  { to: '/vendor/orders', label: 'Orders', group: 'vendor' },
  { to: '/vendor/analytics', label: 'Analytics', group: 'vendor' },
];

const groupColors: Record<string, string> = {
  auth: 'bg-purple-100 text-purple-700',
  customer: 'bg-green-100 text-green-700',
  vendor: 'bg-orange-100 text-orange-700',
};

const groupActiveColors: Record<string, string> = {
  auth: 'bg-purple-600 text-white',
  customer: 'bg-green-600 text-white',
  vendor: 'bg-orange-600 text-white',
};

export function TempNav() {
  const { isAuthenticated, user } = useAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="flex flex-wrap items-center gap-2 border-b bg-white px-4 py-3 shadow-sm">
      <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Dev Nav
      </span>
      {links.map(({ to, label, group }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `rounded px-3 py-1 text-xs font-medium transition-colors ${
              isActive ? groupActiveColors[group] : groupColors[group]
            }`
          }
        >
          {label}
        </NavLink>
      ))}
      <div className="ml-auto flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <span className="text-xs text-slate-500">
              {user?.name} <span className="font-medium text-slate-700">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
          >
            Sign in
          </NavLink>
        )}
      </div>
    </nav>
  );
}
