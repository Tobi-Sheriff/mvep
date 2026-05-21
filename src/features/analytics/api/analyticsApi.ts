import { baseApi } from '@/app/api';
import type { AnalyticsPeriod, AnalyticsOverview, RevenueDataPoint, TopProduct } from '@/features/analytics/types';

interface RevenueResponse {
  data: RevenueDataPoint[];
  total: number;
  change: number;
}

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsOverview: builder.query<AnalyticsOverview, void>({
      query: () => '/analytics/overview',
    }),

    getRevenue: builder.query<RevenueDataPoint[], AnalyticsPeriod>({
      query: (period) => `/analytics/revenue?period=${period}`,
      transformResponse: (response: RevenueResponse) => response.data,
    }),

    getTopProducts: builder.query<TopProduct[], void>({
      query: () => '/analytics/products/top',
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetRevenueQuery,
  useGetTopProductsQuery,
} = analyticsApi;
