import type { Order } from '@/features/orders/types';

export type UserStatus = 'active' | 'suspended' | 'banned';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  status: UserStatus;
  createdAt: string;
}

export interface AdminVendor {
  id: string;
  userId: string;
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  userStatus: UserStatus;
  productCount: number;
  totalRevenue: number;
  totalOrders: number;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalVendors: number;
  totalCustomers: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  newUsersThisMonth: number;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminVendorsResponse {
  vendors: AdminVendor[];
  total: number;
}

export interface AdminOrdersResponse {
  orders: Order[];
  total: number;
}

export interface AdminUsersParams {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminVendorsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminOrdersParams {
  status?: string;
  page?: number;
  limit?: number;
}
