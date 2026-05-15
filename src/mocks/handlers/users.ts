import { http, HttpResponse } from 'msw';

// In-memory wishlist per user (keyed by token for simplicity)
const wishlists = new Map<string, string[]>([
  ['customer-token', ['p1', 'p3', 'p11']],
]);

function getToken(request: Request): string {
  return request.headers.get('Authorization')?.replace('Bearer ', '') ?? 'anonymous';
}

export const userHandlers = [
  http.get('/api/v1/users/profile', ({ request }) => {
    const token = getToken(request);
    if (!token || token === 'anonymous') {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json({
      id: 'c1',
      name: 'Alex Customer',
      email: 'customer@mvep.dev',
      role: 'customer',
      avatar: null,
    });
  }),

  http.put('/api/v1/users/profile', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...body, id: 'c1', role: 'customer' });
  }),

  http.get('/api/v1/users/wishlist', ({ request }) => {
    const token = getToken(request);
    const ids = wishlists.get(token) ?? [];
    return HttpResponse.json(ids);
  }),

  http.post('/api/v1/users/wishlist/:productId', ({ request, params }) => {
    const token = getToken(request);
    const ids = wishlists.get(token) ?? [];
    const productId = params.productId as string;
    if (!ids.includes(productId)) {
      ids.push(productId);
      wishlists.set(token, ids);
    }
    return HttpResponse.json({ productId, added: true });
  }),

  http.delete('/api/v1/users/wishlist/:productId', ({ request, params }) => {
    const token = getToken(request);
    const ids = wishlists.get(token) ?? [];
    const productId = params.productId as string;
    wishlists.set(token, ids.filter((id) => id !== productId));
    return HttpResponse.json({ productId, removed: true });
  }),
];
