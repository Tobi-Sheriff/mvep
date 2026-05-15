import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Store, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';
import { useAppSelector } from '@/app/hooks';

export function StorefrontLayout() {
  const { isAuthenticated, user } = useAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const cartCount = useAppSelector((state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
    setMobileMenuOpen(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/store" className="flex flex-shrink-0 items-center gap-2 font-bold text-slate-900">
            <Store size={22} className="text-blue-600" />
            <span className="text-lg">MVEP</span>
          </Link>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden flex-1 sm:block">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            {isAuthenticated && (
              <NavLink
                to="/store/wishlist"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-500"
                title="Wishlist"
              >
                <Heart size={20} />
              </NavLink>
            )}

            <Link
              to="/store/cart"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
              title="Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="ml-1 flex items-center gap-2">
                {user?.role === 'vendor' || user?.role === 'admin' ? (
                  <Link
                    to="/vendor/dashboard"
                    className="hidden rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:block"
                  >
                    Vendor portal
                  </Link>
                ) : (
                  <NavLink
                    to="/store/orders"
                    className="hidden rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 sm:block"
                  >
                    My orders
                  </NavLink>
                )}
                <button
                  onClick={handleSignOut}
                  className="hidden rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 sm:block"
                  title="Sign out"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 sm:hidden"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </form>
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link to="/store/orders" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">My orders</Link>
                {(user?.role === 'vendor' || user?.role === 'admin') && (
                  <Link to="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">Vendor portal</Link>
                )}
                <button onClick={handleSignOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50">Sign out</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-700">Sign in</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-sm font-semibold text-white">Register</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} MVEP — Multi-Vendor E-Commerce Platform
      </footer>
    </div>
  );
}
