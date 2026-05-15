import { http, HttpResponse } from 'msw';
import type { AnalyticsPeriod, RevenueDataPoint, TopProduct, AnalyticsOverview } from '@/features/analytics/types';

function generateDates(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().split('T')[0];
  });
}

function generateRevenueSeries(days: number): RevenueDataPoint[] {
  return generateDates(days).map((date) => ({
    date,
    revenue: Math.round((Math.random() * 800 + 200) * 100) / 100,
    orders: Math.floor(Math.random() * 15 + 2),
  }));
}

const topProducts: TopProduct[] = [
  { id: 'p1', name: 'Wireless Noise-Cancelling Headphones', revenue: 12249.51, unitsSold: 49 },
  { id: 'p3', name: 'Running Shoes Pro', revenue: 8099.10, unitsSold: 90 },
  { id: 'p2', name: 'Mechanical Keyboard', revenue: 6369.51, unitsSold: 49 },
  { id: 'p14', name: 'Portable Bluetooth Speaker', revenue: 4799.40, unitsSold: 60 },
  { id: 'p6', name: 'Linen Button-Down Shirt', revenue: 3599.40, unitsSold: 60 },
];

const periodDays: Record<AnalyticsPeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365,
};

export const analyticsHandlers = [
  http.get('/api/v1/analytics/overview', () => {
    const overview: AnalyticsOverview = {
      totalRevenue: 34518.39,
      totalOrders: 312,
      totalProducts: 15,
      totalCustomers: 248,
      revenueChange: 12.4,
      ordersChange: 8.1,
    };
    return HttpResponse.json(overview);
  }),

  http.get('/api/v1/analytics/revenue', ({ request }) => {
    const url = new URL(request.url);
    const period = (url.searchParams.get('period') ?? '30d') as AnalyticsPeriod;
    const days = periodDays[period] ?? 30;
    return HttpResponse.json(generateRevenueSeries(days));
  }),

  http.get('/api/v1/analytics/products/top', () => {
    return HttpResponse.json(topProducts);
  }),
];
