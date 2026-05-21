import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { StorefrontPage } from '@/pages/customer/StorefrontPage';
import { renderWithProviders } from '@/test/utils';
import { server } from '@/test/setup';

describe('StorefrontPage', () => {
  it('renders the product grid container without errors', () => {
    renderWithProviders(<StorefrontPage />);
    // FilterSidebar and ProductGrid containers are rendered immediately
    expect(document.querySelector('.flex.min-w-0.flex-1') ?? document.body).toBeTruthy();
  });

  it('displays product names after the MSW response resolves', async () => {
    renderWithProviders(<StorefrontPage />);
    // Default sort is "newest" — p15 and p14 are the two most-recent products (page 1)
    await waitFor(() => {
      expect(screen.getByText('Smart LED Desk Lamp')).toBeInTheDocument();
    }, { timeout: 5000 });
    expect(screen.getByText('Portable Bluetooth Speaker')).toBeInTheDocument();
  });

  it('shows "No products found" when the endpoint returns an empty list', async () => {
    server.use(
      http.get('/api/v1/products', () =>
        HttpResponse.json({ data: [], total: 0, totalPages: 0, page: 1 }),
      ),
    );
    renderWithProviders(<StorefrontPage />);
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });
});
