import { StarRating } from './StarRating';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import type { Review } from '@/features/customer/types';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

export function ReviewList({ reviews, isLoading }: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">No reviews yet. Be the first to review!</p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                {review.userName[0]}
              </div>
              <span className="text-sm font-medium text-slate-700">{review.userName}</span>
            </div>
            <span className="text-xs text-slate-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <StarRating rating={review.rating} size="sm" />
          <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
