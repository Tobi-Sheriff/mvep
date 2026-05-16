import { http, HttpResponse } from 'msw';
import type { Order, OrderStatus, OrdersResponse, OrderItem } from '@/features/orders/types';

let orders: Order[] = [
  { id: 'o1', customerId: 'c1', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', items: [{ productId: 'p1', productName: 'Wireless Headphones', quantity: 1, unitPrice: 249.99 }], status: 'pending', total: 249.99, createdAt: '2024-02-18T09:00:00Z', updatedAt: '2024-02-18T09:00:00Z' },
  { id: 'o2', customerId: 'c2', customerName: 'Bob Martinez', customerEmail: 'bob@example.com', items: [{ productId: 'p3', productName: 'Running Shoes Pro', quantity: 2, unitPrice: 89.99 }, { productId: 'p4', productName: 'Yoga Mat Premium', quantity: 1, unitPrice: 49.99 }], status: 'processing', total: 229.97, createdAt: '2024-02-17T14:30:00Z', updatedAt: '2024-02-17T16:00:00Z' },
  { id: 'o3', customerId: 'c3', customerName: 'Clara Williams', customerEmail: 'clara@example.com', items: [{ productId: 'p2', productName: 'Mechanical Keyboard', quantity: 1, unitPrice: 129.99 }], status: 'shipped', total: 129.99, createdAt: '2024-02-16T11:00:00Z', updatedAt: '2024-02-17T08:00:00Z' },
  { id: 'o4', customerId: 'c4', customerName: 'David Chen', customerEmail: 'david@example.com', items: [{ productId: 'p6', productName: 'Linen Button-Down Shirt', quantity: 3, unitPrice: 59.99 }], status: 'delivered', total: 179.97, createdAt: '2024-02-10T09:00:00Z', updatedAt: '2024-02-14T12:00:00Z' },
  { id: 'o5', customerId: 'c5', customerName: 'Emma Davis', customerEmail: 'emma@example.com', items: [{ productId: 'p11', productName: 'Vitamin C Serum', quantity: 2, unitPrice: 24.99 }], status: 'delivered', total: 49.98, createdAt: '2024-02-08T10:00:00Z', updatedAt: '2024-02-12T15:00:00Z' },
  { id: 'o6', customerId: 'c6', customerName: 'Frank Brown', customerEmail: 'frank@example.com', items: [{ productId: 'p14', productName: 'Portable Bluetooth Speaker', quantity: 1, unitPrice: 79.99 }, { productId: 'p5', productName: 'Stainless Steel Water Bottle', quantity: 2, unitPrice: 34.99 }], status: 'pending', total: 149.97, createdAt: '2024-02-18T13:00:00Z', updatedAt: '2024-02-18T13:00:00Z' },
  { id: 'o7', customerId: 'c7', customerName: 'Grace Lee', customerEmail: 'grace@example.com', items: [{ productId: 'p8', productName: 'Ceramic Coffee Mug Set', quantity: 2, unitPrice: 39.99 }], status: 'processing', total: 79.98, createdAt: '2024-02-17T10:00:00Z', updatedAt: '2024-02-17T14:00:00Z' },
  { id: 'o8', customerId: 'c8', customerName: 'Henry Wilson', customerEmail: 'henry@example.com', items: [{ productId: 'p10', productName: 'JavaScript: The Good Parts', quantity: 1, unitPrice: 29.99 }, { productId: 'p12', productName: 'Wooden Building Blocks', quantity: 1, unitPrice: 32.99 }], status: 'cancelled', total: 62.98, createdAt: '2024-02-15T09:00:00Z', updatedAt: '2024-02-15T11:00:00Z' },
  { id: 'o9', customerId: 'c9', customerName: 'Iris Taylor', customerEmail: 'iris@example.com', items: [{ productId: 'p13', productName: 'Artisan Coffee Blend', quantity: 3, unitPrice: 18.99 }], status: 'shipped', total: 56.97, createdAt: '2024-02-16T08:00:00Z', updatedAt: '2024-02-17T07:00:00Z' },
  { id: 'o10', customerId: 'c10', customerName: 'James Anderson', customerEmail: 'james@example.com', items: [{ productId: 'p15', productName: 'Smart LED Desk Lamp', quantity: 1, unitPrice: 54.99 }], status: 'delivered', total: 54.99, createdAt: '2024-02-05T10:00:00Z', updatedAt: '2024-02-10T12:00:00Z' },
  { id: 'o11', customerId: 'c11', customerName: 'Kate Robinson', customerEmail: 'kate@example.com', items: [{ productId: 'p7', productName: 'Slim Fit Chinos', quantity: 2, unitPrice: 69.99 }, { productId: 'p6', productName: 'Linen Button-Down Shirt', quantity: 1, unitPrice: 59.99 }], status: 'processing', total: 199.97, createdAt: '2024-02-18T07:00:00Z', updatedAt: '2024-02-18T09:00:00Z' },
  { id: 'o12', customerId: 'c12', customerName: 'Liam Thompson', customerEmail: 'liam@example.com', items: [{ productId: 'p9', productName: 'Bamboo Cutting Board', quantity: 1, unitPrice: 44.99 }, { productId: 'p8', productName: 'Ceramic Coffee Mug Set', quantity: 1, unitPrice: 39.99 }], status: 'pending', total: 84.98, createdAt: '2024-02-18T15:00:00Z', updatedAt: '2024-02-18T15:00:00Z' },

  // Seeded orders for the demo customer account (Alice Customer, id: '1')
  { id: 'o13', customerId: '1', customerName: 'Alice Customer', customerEmail: 'customer@mvep.dev', items: [{ productId: 'p1', productName: 'Wireless Headphones', quantity: 1, unitPrice: 249.99 }], status: 'delivered', total: 249.99, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-20T12:00:00Z' },
  { id: 'o14', customerId: '1', customerName: 'Alice Customer', customerEmail: 'customer@mvep.dev', items: [{ productId: 'p3', productName: 'Running Shoes Pro', quantity: 1, unitPrice: 89.99 }, { productId: 'p5', productName: 'Stainless Steel Water Bottle', quantity: 2, unitPrice: 34.99 }], status: 'shipped', total: 159.97, createdAt: '2024-02-10T09:00:00Z', updatedAt: '2024-02-12T08:00:00Z' },
  { id: 'o15', customerId: '1', customerName: 'Alice Customer', customerEmail: 'customer@mvep.dev', items: [{ productId: 'p11', productName: 'Vitamin C Serum', quantity: 2, unitPrice: 24.99 }, { productId: 'p13', productName: 'Artisan Coffee Blend', quantity: 1, unitPrice: 18.99 }], status: 'pending', total: 68.97, createdAt: '2024-02-18T11:00:00Z', updatedAt: '2024-02-18T11:00:00Z' },
];

function getUserIdFromToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer mock-jwt-')) return null;
  const parts = authHeader.replace('Bearer ', '').split('-');
  return parts[2] ?? null; // mock-jwt-{userId}-{timestamp}
}

export const orderHandlers = [
  http.get('/api/v1/orders', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as OrderStatus | null;
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const customerScope = url.searchParams.get('customerId') === 'me';

    let filtered = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (customerScope) {
      const userId = getUserIdFromToken(request.headers.get('Authorization'));
      if (userId) filtered = filtered.filter((o) => o.customerId === userId);
    }

    if (status) filtered = filtered.filter((o) => o.status === status);

    const total = filtered.length;
    const start = (page - 1) * limit;
    return HttpResponse.json<OrdersResponse>({ orders: filtered.slice(start, start + limit), total });
  }),

  http.get('/api/v1/orders/:id', ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
    return HttpResponse.json(order);
  }),

  http.patch('/api/v1/orders/:id/status', async ({ params, request }) => {
    const idx = orders.findIndex((o) => o.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
    const { status } = (await request.json()) as { status: OrderStatus };
    orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
    return HttpResponse.json(orders[idx]);
  }),

  http.post('/api/v1/orders', async ({ request }) => {
    const body = await request.json() as {
      items: OrderItem[];
      total: number;
    };
    const userId = getUserIdFromToken(request.headers.get('Authorization')) ?? 'guest';
    const newOrder: Order = {
      id: `o${orders.length + 1}`,
      customerId: userId,
      customerName: 'Alice Customer',
      customerEmail: 'customer@mvep.dev',
      items: body.items,
      status: 'pending',
      total: body.total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),
];
