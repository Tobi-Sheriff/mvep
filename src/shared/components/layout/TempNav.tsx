import { NavLink } from 'react-router-dom';

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
  return (
    <nav className="flex flex-wrap items-center gap-2 border-b bg-white px-4 py-3 shadow-sm">
      <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Phase 1 Nav
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
    </nav>
  );
}
