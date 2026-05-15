import { cn } from '@/shared/utils/cn';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
  reviewCount?: number;
}

export function StarRating({ rating, max = 5, size = 'sm', showValue, reviewCount }: StarRatingProps) {
  const sizeClass = size === 'md' ? 'text-base' : 'text-sm';

  return (
    <div className={cn('flex items-center gap-1', sizeClass)}>
      <span className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <span key={i} className={cn(filled || half ? 'text-amber-400' : 'text-slate-200')}>
              {filled ? '★' : half ? '⯨' : '★'}
            </span>
          );
        })}
      </span>
      {showValue && (
        <span className="text-xs text-slate-500">
          {rating.toFixed(1)}
          {reviewCount !== undefined && <span className="ml-1">({reviewCount})</span>}
        </span>
      )}
    </div>
  );
}
