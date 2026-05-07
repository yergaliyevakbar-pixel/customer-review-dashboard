import { Star, TrendingUp, MessageSquare, ThumbsUp } from 'lucide-react';
import { Review } from '../data/mockReviews';

interface ReviewStatsProps {
  reviews: Review[];
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const positiveCount = reviews.filter(r => r.sentiment === 'positive').length;
  const positivePercentage = Math.round((positiveCount / reviews.length) * 100);

  const stats = [
    {
      label: 'Total Reviews',
      value: reviews.length.toString(),
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      label: 'Average Rating',
      value: avgRating,
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      label: 'Positive Reviews',
      value: `${positivePercentage}%`,
      icon: ThumbsUp,
      color: 'bg-green-500',
    },
    {
      label: 'Sentiment Trend',
      value: positivePercentage >= 70 ? 'Excellent' : positivePercentage >= 50 ? 'Good' : 'Needs Attention',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
