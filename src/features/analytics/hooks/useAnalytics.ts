import {
  useGetAnalyticsOverviewQuery,
  useGetRevenueQuery,
  useGetTopProductsQuery,
} from '@/features/analytics/api/analyticsApi';
import type { AnalyticsPeriod } from '@/features/analytics/types';

export function useAnalytics(period: AnalyticsPeriod = '30d') {
  const { data: overview = null, isLoading: l1 } = useGetAnalyticsOverviewQuery();
  const { data: revenueSeries = [], isLoading: l2 } = useGetRevenueQuery(period);
  const { data: topProducts = [], isLoading: l3 } = useGetTopProductsQuery();

  return {
    overview,
    revenueSeries,
    topProducts,
    isLoading: l1 || l2 || l3,
    error: null,
  };
}
