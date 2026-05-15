import { useState, useEffect } from 'react';
import { api } from '@/shared/utils/axiosInstance';
import type { AnalyticsPeriod, AnalyticsOverview, RevenueDataPoint, TopProduct } from '@/features/analytics/types';

export function useAnalytics(period: AnalyticsPeriod = '30d') {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [revenueSeries, setRevenueSeries] = useState<RevenueDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      api.get<AnalyticsOverview>('/analytics/overview'),
      api.get<RevenueDataPoint[]>(`/analytics/revenue?period=${period}`),
      api.get<TopProduct[]>('/analytics/products/top'),
    ])
      .then(([overviewRes, revenueRes, topRes]) => {
        if (cancelled) return;
        setOverview(overviewRes.data);
        setRevenueSeries(revenueRes.data);
        setTopProducts(topRes.data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load analytics data');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  return { overview, revenueSeries, topProducts, isLoading, error };
}
