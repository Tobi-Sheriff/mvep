import { http, HttpResponse, delay } from 'msw';
import type { AdminUser, AdminVendor, AdminStats } from '@/features/admin/types';
import { orders } from './orders';

let adminUsers: AdminUser[] = [
  { id: '1', name: 'Alice Customer', email: 'customer@mvep.dev', role: 'customer', status: 'active', createdAt: '2024-01-10T10:00:00Z' },
  { id: '2', name: 'Bob Vendor', email: 'vendor@mvep.dev', role: 'vendor', status: 'active', createdAt: '2024-01-08T10:00:00Z' },
  { id: '3', name: 'Carol Admin', email: 'admin@mvep.dev', role: 'admin', status: 'active', createdAt: '2024-01-01T10:00:00Z' },
  { id: 'u4', name: 'David Chen', email: 'david@example.com', role: 'customer', status: 'active', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'u5', name: 'Emma Davis', email: 'emma@example.com', role: 'customer', status: 'active', createdAt: '2024-01-18T10:00:00Z' },
  { id: 'u6', name: 'Frank Brown', email: 'frank@example.com', role: 'customer', status: 'suspended', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'u7', name: 'Grace Lee', email: 'grace@example.com', role: 'customer', status: 'active', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'u8', name: 'Henry Wilson', email: 'henry@example.com', role: 'vendor', status: 'active', createdAt: '2024-01-12T10:00:00Z' },
  { id: 'u9', name: 'Iris Taylor', email: 'iris@example.com', role: 'customer', status: 'banned', createdAt: '2024-01-25T10:00:00Z' },
  { id: 'u10', name: 'James Anderson', email: 'james@example.com', role: 'vendor', status: 'active', createdAt: '2024-01-16T10:00:00Z' },
  { id: 'u11', name: 'Kate Robinson', email: 'kate@example.com', role: 'customer', status: 'active', createdAt: '2024-02-05T10:00:00Z' },
  { id: 'u12', name: 'Liam Thompson', email: 'liam@example.com', role: 'customer', status: 'active', createdAt: '2024-02-10T10:00:00Z' },
];

const adminVendors: AdminVendor[] = [
  { id: 'v1', userId: '2', storeName: 'TechStore', ownerName: 'Bob Vendor', ownerEmail: 'vendor@mvep.dev', userStatus: 'active', productCount: 6, totalRevenue: 34518.39, totalOrders: 189, createdAt: '2024-01-08T10:00:00Z' },
  { id: 'v2', userId: 'u8', storeName: 'SportZone', ownerName: 'Henry Wilson', ownerEmail: 'henry@example.com', userStatus: 'active', productCount: 3, totalRevenue: 18240.50, totalOrders: 145, createdAt: '2024-01-12T10:00:00Z' },
  { id: 'v3', userId: 'u10', storeName: 'FashionHub', ownerName: 'James Anderson', ownerEmail: 'james@example.com', userStatus: 'active', productCount: 4, totalRevenue: 12890.25, totalOrders: 97, createdAt: '2024-01-16T10:00:00Z' },
];

export const adminHandlers = [
  // Platform-wide stats
  http.get('/api/v1/admin/stats', () => {
    const stats: AdminStats = {
      totalRevenue: adminVendors.reduce((sum, v) => sum + v.totalRevenue, 0),
      totalOrders: orders.length,
      totalProducts: 15,
      totalVendors: adminVendors.length,
      totalCustomers: adminUsers.filter((u) => u.role === 'customer').length,
      totalUsers: adminUsers.length,
      revenueChange: 14.2,
      ordersChange: 9.7,
      newUsersThisMonth: 4,
    };
    return HttpResponse.json(stats);
  }),

  // All users with search + role + status filters
  http.get('/api/v1/admin/users', ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role') ?? '';
    const status = url.searchParams.get('status') ?? '';
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 10);

    let filtered = [...adminUsers];
    if (role) filtered = filtered.filter((u) => u.role === role);
    if (status) filtered = filtered.filter((u) => u.status === status);
    if (search) {
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search),
      );
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    return HttpResponse.json({ users: filtered.slice(start, start + limit), total, page, totalPages });
  }),

  // Update user status (ban / suspend / activate)
  http.patch('/api/v1/admin/users/:id/status', async ({ params, request }) => {
    await delay(300);
    const user = adminUsers.find((u) => u.id === params.id);
    if (!user) return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    if (user.role === 'admin') {
      return HttpResponse.json({ message: 'Cannot modify admin accounts' }, { status: 400 });
    }
    const { status } = (await request.json()) as { status: AdminUser['status'] };
    user.status = status;

    // Keep vendor list in sync
    const vendor = adminVendors.find((v) => v.userId === user.id);
    if (vendor) vendor.userStatus = status;

    return HttpResponse.json({ id: user.id, status, updatedAt: new Date().toISOString() });
  }),

  // All vendors
  http.get('/api/v1/admin/vendors', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 10);

    let filtered = [...adminVendors];
    if (search) {
      filtered = filtered.filter(
        (v) => v.storeName.toLowerCase().includes(search) || v.ownerName.toLowerCase().includes(search),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    return HttpResponse.json({ vendors: filtered.slice(start, start + limit), total });
  }),

  // All orders (platform-wide, no scoping)
  http.get('/api/v1/admin/orders', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? '';
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 15);

    let filtered = [...orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (status) filtered = filtered.filter((o) => o.status === status);

    const total = filtered.length;
    const start = (page - 1) * limit;
    return HttpResponse.json({ orders: filtered.slice(start, start + limit), total });
  }),
];
