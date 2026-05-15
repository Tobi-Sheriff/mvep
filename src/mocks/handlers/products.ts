import { http, HttpResponse } from 'msw';
import type { Product, ProductsResponse } from '@/features/vendor/types';

let products: Product[] = [
  { id: 'p1', name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with 30-hour battery and active noise cancellation.', price: 249.99, stock: 45, category: 'Electronics', image: 'https://picsum.photos/seed/p1/400/300', vendorId: 'v1', createdAt: '2024-01-10T10:00:00Z' },
  { id: 'p2', name: 'Mechanical Keyboard', description: 'TKL mechanical keyboard with Cherry MX switches and per-key RGB lighting.', price: 129.99, stock: 30, category: 'Electronics', image: 'https://picsum.photos/seed/p2/400/300', vendorId: 'v1', createdAt: '2024-01-12T10:00:00Z' },
  { id: 'p3', name: 'Running Shoes Pro', description: 'Lightweight trail running shoes with responsive cushioning and grippy outsole.', price: 89.99, stock: 60, category: 'Sports', image: 'https://picsum.photos/seed/p3/400/300', vendorId: 'v1', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'p4', name: 'Yoga Mat Premium', description: 'Eco-friendly 6mm yoga mat with alignment lines and carrying strap.', price: 49.99, stock: 80, category: 'Sports', image: 'https://picsum.photos/seed/p4/400/300', vendorId: 'v1', createdAt: '2024-01-18T10:00:00Z' },
  { id: 'p5', name: 'Stainless Steel Water Bottle', description: '32oz vacuum-insulated bottle, keeps drinks cold 24h and hot 12h.', price: 34.99, stock: 120, category: 'Sports', image: 'https://picsum.photos/seed/p5/400/300', vendorId: 'v1', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'p6', name: 'Linen Button-Down Shirt', description: 'Breathable 100% linen shirt, perfect for summer. Available in multiple colors.', price: 59.99, stock: 40, category: 'Clothing', image: 'https://picsum.photos/seed/p6/400/300', vendorId: 'v1', createdAt: '2024-01-22T10:00:00Z' },
  { id: 'p7', name: 'Slim Fit Chinos', description: 'Stretch cotton slim fit chinos. Wrinkle-resistant, machine washable.', price: 69.99, stock: 55, category: 'Clothing', image: 'https://picsum.photos/seed/p7/400/300', vendorId: 'v1', createdAt: '2024-01-25T10:00:00Z' },
  { id: 'p8', name: 'Ceramic Coffee Mug Set', description: 'Set of 4 hand-painted ceramic mugs, 350ml capacity, dishwasher safe.', price: 39.99, stock: 25, category: 'Home & Garden', image: 'https://picsum.photos/seed/p8/400/300', vendorId: 'v1', createdAt: '2024-01-28T10:00:00Z' },
  { id: 'p9', name: 'Bamboo Cutting Board', description: 'Large 18x12 inch bamboo cutting board with juice grooves and handles.', price: 44.99, stock: 35, category: 'Home & Garden', image: 'https://picsum.photos/seed/p9/400/300', vendorId: 'v1', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'p10', name: 'JavaScript: The Good Parts', description: 'Classic reference by Douglas Crockford covering JS best practices.', price: 29.99, stock: 15, category: 'Books', image: 'https://picsum.photos/seed/p10/400/300', vendorId: 'v1', createdAt: '2024-02-05T10:00:00Z' },
  { id: 'p11', name: 'Vitamin C Serum', description: '20% vitamin C serum with hyaluronic acid for brightening and anti-aging.', price: 24.99, stock: 70, category: 'Beauty', image: 'https://picsum.photos/seed/p11/400/300', vendorId: 'v1', createdAt: '2024-02-08T10:00:00Z' },
  { id: 'p12', name: 'Wooden Building Blocks', description: '60-piece natural wood building block set for ages 1-6. Non-toxic paint.', price: 32.99, stock: 50, category: 'Toys', image: 'https://picsum.photos/seed/p12/400/300', vendorId: 'v1', createdAt: '2024-02-10T10:00:00Z' },
  { id: 'p13', name: 'Artisan Coffee Blend', description: 'Single-origin Ethiopian coffee, medium roast, whole bean 500g.', price: 18.99, stock: 90, category: 'Food', image: 'https://picsum.photos/seed/p13/400/300', vendorId: 'v1', createdAt: '2024-02-12T10:00:00Z' },
  { id: 'p14', name: 'Portable Bluetooth Speaker', description: 'IPX7 waterproof speaker with 12-hour battery and 360° sound.', price: 79.99, stock: 8, category: 'Electronics', image: 'https://picsum.photos/seed/p14/400/300', vendorId: 'v1', createdAt: '2024-02-15T10:00:00Z' },
  { id: 'p15', name: 'Smart LED Desk Lamp', description: 'USB-C rechargeable desk lamp with 5 color temps, touch dimmer, and phone stand.', price: 54.99, stock: 0, category: 'Electronics', image: 'https://picsum.photos/seed/p15/400/300', vendorId: 'v1', createdAt: '2024-02-18T10:00:00Z' },
];

let nextId = 16;

export const productHandlers = [
  http.get('/api/v1/products', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const category = url.searchParams.get('category') ?? '';

    let filtered = products;
    if (search) {
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
      );
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return HttpResponse.json<ProductsResponse>({ products: paginated, total, page, limit });
  }),

  http.get('/api/v1/products/:id', ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.post('/api/v1/products', async ({ request }) => {
    const body = (await request.json()) as Partial<Product>;
    const product: Product = {
      id: `p${nextId++}`,
      name: body.name ?? '',
      description: body.description ?? '',
      price: body.price ?? 0,
      stock: body.stock ?? 0,
      category: body.category ?? '',
      image: body.image || `https://picsum.photos/seed/p${nextId}/400/300`,
      vendorId: 'v1',
      createdAt: new Date().toISOString(),
    };
    products.unshift(product);
    return HttpResponse.json(product, { status: 201 });
  }),

  http.put('/api/v1/products/:id', async ({ params, request }) => {
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    const body = (await request.json()) as Partial<Product>;
    products[idx] = { ...products[idx], ...body };
    return HttpResponse.json(products[idx]);
  }),

  http.delete('/api/v1/products/:id', ({ params }) => {
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    products.splice(idx, 1);
    return HttpResponse.json({ message: 'Product deleted' });
  }),
];
