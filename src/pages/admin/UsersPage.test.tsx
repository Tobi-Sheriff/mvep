import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminUsersPage } from '@/pages/admin/UsersPage';
import { renderWithProviders } from '@/test/utils';

const adminPreloadedState = {
  auth: {
    user: { id: '3', name: 'Carol Admin', email: 'admin@mvep.dev', role: 'admin' as const },
    token: 'mock-jwt-admin-3',
    isAuthenticated: true,
    isLoading: false,
    error: null,
    pendingVerification: null,
  },
};

describe('AdminUsersPage', () => {
  it('renders the User Management heading', () => {
    renderWithProviders(<AdminUsersPage />, { preloadedState: adminPreloadedState });
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('renders role filter tabs for all, customer, vendor, and admin', () => {
    renderWithProviders(<AdminUsersPage />, { preloadedState: adminPreloadedState });
    expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^customer$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^vendor$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^admin$/i })).toBeInTheDocument();
  });

  it('displays user rows after the MSW response resolves', async () => {
    renderWithProviders(<AdminUsersPage />, { preloadedState: adminPreloadedState });
    await waitFor(
      () => {
        expect(screen.getByText('Alice Customer')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    expect(screen.getByText('Bob Vendor')).toBeInTheDocument();
  });

  it('filters to vendor users when the Vendor tab is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminUsersPage />, { preloadedState: adminPreloadedState });
    // Wait for initial load
    await waitFor(() => screen.getByText('Alice Customer'));
    await user.click(screen.getByRole('button', { name: /^vendor$/i }));
    await waitFor(() => {
      expect(screen.getByText('Bob Vendor')).toBeInTheDocument();
      expect(screen.queryByText('Alice Customer')).not.toBeInTheDocument();
    });
  });
});
