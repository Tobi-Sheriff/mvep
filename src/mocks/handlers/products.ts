import { http, HttpResponse } from 'msw';
import type { Product } from '@/features/vendor/types';
import type { CustomerProduct, StorefrontResponse, Review } from '@/features/customer/types';

// Unified product shape — superset of both vendor and customer views
interface FullProduct extends Product {
  images: string[];
  rating: number;
  reviewCount: number;
  vendorName: string;
}

export let products: FullProduct[] = [
  { id: 'p1', name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with 30-hour battery and active noise cancellation. Deep bass, clear mids, and crisp highs make every listening session exceptional.', price: 249.99, stock: 45, category: 'Electronics', image: 'https://picsum.photos/seed/p1/800/600', images: ['https://picsum.photos/seed/p1/800/600', 'https://picsum.photos/seed/p1b/800/600'], rating: 4.7, reviewCount: 182, vendorId: 'v1', vendorName: 'TechStore', createdAt: '2024-01-10T10:00:00Z' },
  { id: 'p2', name: 'Mechanical Keyboard', description: 'TKL mechanical keyboard with Cherry MX switches and per-key RGB lighting. N-key rollover for flawless gaming and typing performance.', price: 129.99, stock: 30, category: 'Electronics', image: 'https://picsum.photos/seed/p2/800/600', images: ['https://picsum.photos/seed/p2/800/600', 'https://picsum.photos/seed/p2b/800/600'], rating: 4.5, reviewCount: 94, vendorId: 'v1', vendorName: 'TechStore', createdAt: '2024-01-12T10:00:00Z' },
  { id: 'p3', name: 'Running Shoes Pro', description: 'Lightweight trail running shoes with responsive cushioning and grippy outsole. Breathable mesh upper keeps your feet cool on long runs.', price: 89.99, stock: 60, category: 'Sports', image: 'https://picsum.photos/seed/p3/800/600', images: ['https://picsum.photos/seed/p3/800/600', 'https://picsum.photos/seed/p3b/800/600'], rating: 4.3, reviewCount: 211, vendorId: 'v1', vendorName: 'SportZone', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'p4', name: 'Yoga Mat Premium', description: 'Eco-friendly 6mm yoga mat with alignment lines and carrying strap. Non-slip surface and excellent grip in all conditions.', price: 49.99, stock: 80, category: 'Sports', image: 'https://picsum.photos/seed/p4/800/600', images: ['https://picsum.photos/seed/p4/800/600'], rating: 4.6, reviewCount: 73, vendorId: 'v1', vendorName: 'SportZone', createdAt: '2024-01-18T10:00:00Z' },
  { id: 'p5', name: 'Stainless Steel Water Bottle', description: '32oz vacuum-insulated bottle, keeps drinks cold 24h and hot 12h. Wide mouth for easy filling and cleaning.', price: 34.99, stock: 120, category: 'Sports', image: 'https://picsum.photos/seed/p5/800/600', images: ['https://picsum.photos/seed/p5/800/600'], rating: 4.4, reviewCount: 305, vendorId: 'v1', vendorName: 'SportZone', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'p6', name: 'Linen Button-Down Shirt', description: 'Breathable 100% linen shirt, perfect for summer. Relaxed fit with a casual collar. Machine washable.', price: 59.99, stock: 40, category: 'Clothing', image: 'https://picsum.photos/seed/p6/800/600', images: ['https://picsum.photos/seed/p6/800/600', 'https://picsum.photos/seed/p6b/800/600'], rating: 4.1, reviewCount: 48, vendorId: 'v1', vendorName: 'FashionHub', createdAt: '2024-01-22T10:00:00Z' },
  { id: 'p7', name: 'Slim Fit Chinos', description: 'Stretch cotton slim fit chinos. Wrinkle-resistant, machine washable. Classic 5-pocket design.', price: 69.99, stock: 55, category: 'Clothing', image: 'https://picsum.photos/seed/p7/800/600', images: ['https://picsum.photos/seed/p7/800/600'], rating: 4.2, reviewCount: 62, vendorId: 'v1', vendorName: 'FashionHub', createdAt: '2024-01-25T10:00:00Z' },
  { id: 'p8', name: 'Ceramic Coffee Mug Set', description: 'Set of 4 hand-painted ceramic mugs, 350ml capacity, dishwasher safe. Beautiful gift set with a natural wood tray.', price: 39.99, stock: 25, category: 'Home & Garden', image: 'https://picsum.photos/seed/p8/800/600', images: ['https://picsum.photos/seed/p8/800/600'], rating: 4.8, reviewCount: 137, vendorId: 'v1', vendorName: 'HomeDecor', createdAt: '2024-01-28T10:00:00Z' },
  { id: 'p9', name: 'Bamboo Cutting Board', description: 'Large 18x12 inch bamboo cutting board with juice grooves and handles. Harder than traditional wood and naturally anti-bacterial.', price: 44.99, stock: 35, category: 'Home & Garden', image: 'https://picsum.photos/seed/p9/800/600', images: ['https://picsum.photos/seed/p9/800/600'], rating: 4.5, reviewCount: 89, vendorId: 'v1', vendorName: 'HomeDecor', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'p10', name: 'JavaScript: The Good Parts', description: 'Classic reference by Douglas Crockford covering JS best practices. Essential reading for any JavaScript developer.', price: 29.99, stock: 15, category: 'Books', image: 'https://picsum.photos/seed/p10/800/600', images: ['https://picsum.photos/seed/p10/800/600'], rating: 4.6, reviewCount: 421, vendorId: 'v1', vendorName: 'BookWorld', createdAt: '2024-02-05T10:00:00Z' },
  { id: 'p11', name: 'Vitamin C Serum', description: '20% vitamin C serum with hyaluronic acid for brightening and anti-aging. Dermatologist tested, suitable for all skin types.', price: 24.99, stock: 70, category: 'Beauty', image: 'https://picsum.photos/seed/p11/800/600', images: ['https://picsum.photos/seed/p11/800/600', 'https://picsum.photos/seed/p11b/800/600'], rating: 4.4, reviewCount: 256, vendorId: 'v1', vendorName: 'BeautyBox', createdAt: '2024-02-08T10:00:00Z' },
  { id: 'p12', name: 'Wooden Building Blocks', description: '60-piece natural wood building block set for ages 1-6. Non-toxic paint, smooth edges, safe for toddlers.', price: 32.99, stock: 50, category: 'Toys', image: 'https://picsum.photos/seed/p12/800/600', images: ['https://picsum.photos/seed/p12/800/600'], rating: 4.9, reviewCount: 178, vendorId: 'v1', vendorName: 'KidZone', createdAt: '2024-02-10T10:00:00Z' },
  { id: 'p13', name: 'Artisan Coffee Blend', description: 'Single-origin Ethiopian coffee, medium roast, whole bean 500g. Notes of blueberry, jasmine, and dark chocolate.', price: 18.99, stock: 90, category: 'Food', image: 'https://picsum.photos/seed/p13/800/600', images: ['https://picsum.photos/seed/p13/800/600'], rating: 4.7, reviewCount: 312, vendorId: 'v1', vendorName: 'CafeElite', createdAt: '2024-02-12T10:00:00Z' },
  { id: 'p14', name: 'Portable Bluetooth Speaker', description: 'IPX7 waterproof speaker with 12-hour battery and 360° sound. Compact enough to take anywhere, powerful enough to fill a room.', price: 79.99, stock: 8, category: 'Electronics', image: 'https://picsum.photos/seed/p14/800/600', images: ['https://picsum.photos/seed/p14/800/600', 'https://picsum.photos/seed/p14b/800/600'], rating: 4.3, reviewCount: 145, vendorId: 'v1', vendorName: 'TechStore', createdAt: '2024-02-15T10:00:00Z' },
  { id: 'p15', name: 'Smart LED Desk Lamp', description: 'USB-C rechargeable desk lamp with 5 color temps, touch dimmer, and phone stand. Perfect for study and home office.', price: 54.99, stock: 0, category: 'Electronics', image: 'https://picsum.photos/seed/p15/800/600', images: ['https://picsum.photos/seed/p15/800/600'], rating: 4.5, reviewCount: 67, vendorId: 'v1', vendorName: 'TechStore', createdAt: '2024-02-18T10:00:00Z' },
];

const reviewsDb: Record<string, Review[]> = {
  p1: [
    { id: 'r1', userId: 'c1', userName: 'Alice J.', rating: 5, comment: 'Best headphones I\'ve ever owned. The noise cancellation is incredible on flights.', createdAt: '2024-02-10T10:00:00Z' },
    { id: 'r2', userId: 'c2', userName: 'Bob M.', rating: 4, comment: 'Great sound quality. Battery life is exactly as advertised. Slightly tight on first wear.', createdAt: '2024-02-08T10:00:00Z' },
    { id: 'r3', userId: 'c3', userName: 'Clara W.', rating: 5, comment: 'Worth every penny. Use them daily for work calls and music.', createdAt: '2024-02-05T10:00:00Z' },
  ],
  p3: [
    { id: 'r4', userId: 'c4', userName: 'David C.', rating: 4, comment: 'Comfortable and lightweight. Good grip on trails. Runs slightly small.', createdAt: '2024-02-12T10:00:00Z' },
    { id: 'r5', userId: 'c5', userName: 'Emma D.', rating: 5, comment: 'My go-to running shoe. Three pairs in and still love them.', createdAt: '2024-02-09T10:00:00Z' },
  ],
  p8: [
    { id: 'r6', userId: 'c6', userName: 'Frank B.', rating: 5, comment: 'Bought as a gift and they loved it. Beautiful packaging.', createdAt: '2024-02-14T10:00:00Z' },
    { id: 'r7', userId: 'c7', userName: 'Grace L.', rating: 5, comment: 'Gorgeous mugs, thick ceramic, holds heat well. Already ordered a second set.', createdAt: '2024-02-11T10:00:00Z' },
  ],
};

let nextId = 16;

function toCustomerProduct(p: FullProduct): CustomerProduct {
  return {
    id: p.id, name: p.name, description: p.description, price: p.price,
    stock: p.stock, category: p.category, images: p.images, rating: p.rating,
    reviewCount: p.reviewCount, vendorId: p.vendorId, vendorName: p.vendorName,
    createdAt: p.createdAt,
  };
}

export const productHandlers = [
  // Customer-facing catalogue — returns full CustomerProduct shape
  http.get('/api/v1/products', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 12);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const category = url.searchParams.get('category') ?? '';
    const minPrice = Number(url.searchParams.get('minPrice') ?? 0);
    const maxPrice = Number(url.searchParams.get('maxPrice') ?? Infinity);
    const minRating = Number(url.searchParams.get('rating') ?? 0);
    const sort = url.searchParams.get('sort') ?? 'newest';

    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
      );
    }
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (minPrice > 0) filtered = filtered.filter((p) => p.price >= minPrice);
    if (maxPrice < Infinity) filtered = filtered.filter((p) => p.price <= maxPrice);
    if (minRating > 0) filtered = filtered.filter((p) => p.rating >= minRating);

    switch (sort) {
      case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'popular': filtered.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;

    return HttpResponse.json<StorefrontResponse>({
      data: filtered.slice(start, start + limit).map(toCustomerProduct),
      total,
      page,
      totalPages,
    });
  }),

  http.get('/api/v1/products/:id', ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    return HttpResponse.json(toCustomerProduct(product));
  }),

  http.get('/api/v1/products/:id/reviews', ({ params }) => {
    const reviews = reviewsDb[params.id as string] ?? [];
    return HttpResponse.json(reviews);
  }),

  http.post('/api/v1/products', async ({ request }) => {
    const body = (await request.json()) as Partial<FullProduct>;
    const fallback = `https://picsum.photos/seed/p${nextId}/800/600`;
    const images = body.images?.length ? body.images : [fallback];
    const product: FullProduct = {
      id: `p${nextId++}`,
      name: body.name ?? '',
      description: body.description ?? '',
      price: body.price ?? 0,
      stock: body.stock ?? 0,
      category: body.category ?? '',
      image: images[0],
      images,
      rating: 0,
      reviewCount: 0,
      vendorId: 'v1',
      vendorName: 'TechStore',
      createdAt: new Date().toISOString(),
    };
    products.unshift(product);
    return HttpResponse.json(product, { status: 201 });
  }),

  http.put('/api/v1/products/:id', async ({ params, request }) => {
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    const body = (await request.json()) as Partial<FullProduct>;
    const images = body.images?.length ? body.images : products[idx].images;
    products[idx] = { ...products[idx], ...body, images, image: images[0] };
    return HttpResponse.json(products[idx]);
  }),

  http.delete('/api/v1/products/:id', ({ params }) => {
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Product not found' }, { status: 404 });
    products.splice(idx, 1);
    return HttpResponse.json({ message: 'Product deleted' });
  }),
];
