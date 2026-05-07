import { Star, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { Review } from '../data/mockReviews';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getSentimentIcon = () => {
    switch (review.sentiment) {
      case 'positive':
        return <ThumbsUp className="w-5 h-5 text-green-600" />;
      case 'negative':
        return <ThumbsDown className="w-5 h-5 text-red-600" />;
      case 'neutral':
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSentimentBadge = () => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[review.sentiment]} flex items-center gap-1`}>
        {getSentimentIcon()}
        {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
      </span>
    );
  };

  const getSourceBadge = (source: Review['source']) => {
    const colors = {
      'Google Maps': 'bg-blue-100 text-blue-800',
      'Yandex Maps': 'bg-red-100 text-red-800',
      '2GIS': 'bg-green-100 text-green-800',
      'Instagram': 'bg-pink-100 text-pink-800',
    };

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[source]}`}>
        {source}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
            {getSentimentBadge()}
            {getSourceBadge(review.source)}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-3">{review.text}</p>

      {review.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {review.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}