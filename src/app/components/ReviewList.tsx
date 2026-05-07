import { Review } from '../data/mockReviews';
import { ReviewCard } from './ReviewCard';
import { microcopy } from '../utils/microcopy';

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{microcopy.emptyStates.noReviews}</h3>
        <p className="text-gray-500">{microcopy.emptyStates.noReviewsDescription}</p>
        <p className="text-sm text-gray-400 mt-4">Try removing some filters or adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Reviews ({reviews.length})
      </h2>
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}