import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { renderWithProviders } from '@/test/utils';

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, opts: {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
} = {}) {
  const {
    name = 'New User',
    email = 'newuser@example.com',
    password = 'password123',
    confirmPassword = password,
  } = opts;

  if (name) await user.type(screen.getByPlaceholderText('John Smith'), name);
  if (email) await user.type(screen.getByPlaceholderText('you@example.com'), email);
  const passwordFields = screen.getAllByPlaceholderText('••••••••');
  await user.type(passwordFields[0], password);
  await user.type(passwordFields[1], confirmPassword);
  await user.click(screen.getByRole('button', { name: /create account/i }));
}

describe('RegisterPage', () => {
  it('renders all required form fields and the submit button', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByPlaceholderText('John Smith')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    expect(screen.getByRole('radio', { name: 'customer' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'vendor' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows a validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await fillAndSubmit(user, { password: 'password123', confirmPassword: 'different456' });
    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it('sets pendingVerification state after a successful registration', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<RegisterPage />);
    await fillAndSubmit(user, { email: 'brand-new@example.com' });
    await waitFor(() => {
      expect(store.getState().auth.pendingVerification?.email).toBe('brand-new@example.com');
    });
  });

  it('shows "Email already in use" error on duplicate email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);
    await fillAndSubmit(user, { email: 'customer@mvep.dev' });
    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });
});
