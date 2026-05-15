import { type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { Skeleton } from '@/shared/components/ui/Skeleton';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  isLoading?: boolean;
  iconClassName?: string;
}

export function StatCard({ label, value, icon: Icon, change, isLoading, iconClassName }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="mb-2 h-8 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconClassName ?? 'bg-blue-50')}>
          <Icon size={18} className={iconClassName ? 'text-white' : 'text-blue-600'} />
        </div>
      </div>
      <p className="mb-1 text-2xl font-bold text-slate-900">{value}</p>
      {change !== undefined && (
        <p className={cn('text-xs font-medium', isPositive ? 'text-green-600' : 'text-red-500')}>
          {isPositive ? '+' : ''}{change.toFixed(1)}% vs last period
        </p>
      )}
    </div>
  );
}
