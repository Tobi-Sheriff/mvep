import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '@/pages/auth/LoginPage';
import { renderWithProviders } from '@/test/utils';

describe('LoginPage', () => {
  it('renders email input, password input, and submit button', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders the demo accounts section with all three role buttons', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText('Quick login — demo accounts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Customer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vendor' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Admin' })).toBeInTheDocument();
  });

  it('Customer demo button fills the email field with the customer email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.click(screen.getByRole('button', { name: 'Customer' }));
    expect(screen.getByPlaceholderText('you@example.com')).toHaveValue('customer@mvep.dev');
  });

  it('shows validation error when email field is left empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    // Submit without filling email — Zod rejects empty string as invalid email
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    });
  });

  it('shows validation error when password is too short', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'user@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'abc');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('shows API error message on wrong credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'wrong@example.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  it('sets isAuthenticated in Redux state after successful login', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<LoginPage />);
    await user.type(screen.getByPlaceholderText('you@example.com'), 'customer@mvep.dev');
    await user.type(screen.getByPlaceholderText('••••••••'), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
    expect(store.getState().auth.user?.role).toBe('customer');
  });
});
