import { Search, AlertCircle, CheckCircle, Clock, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockReviews } from '../data/mockReviews';
import { microcopy } from '../utils/microcopy';

type UrgencyLevel = 'high' | 'medium' | 'low';

interface ReviewInsight {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  source: string;
  hasResponse: boolean;
  urgency: UrgencyLevel;
}

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterResponse, setFilterResponse] = useState<'all' | 'responded' | 'pending'>('all');

  const reviewInsights: ReviewInsight[] = useMemo(() => {
    return mockReviews.map((review, index) => {
      let urgency: UrgencyLevel = 'low';
      
      // Determine urgency based on sentiment and rating
      if (review.sentiment === 'negative' || review.rating <= 2) {
        urgency = 'high';
      } else if (review.sentiment === 'neutral' || review.rating === 3) {
        urgency = 'medium';
      }

      return {
        ...review,
        hasResponse: index % 3 === 0,
        urgency,
      };
    });
  }, []);

  const filteredReviews = useMemo(() => {
    return reviewInsights.filter(review => {
      const matchesSearch = 
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.text.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSentiment = filterSentiment === 'all' || review.sentiment === filterSentiment;
      const matchesUrgency = filterUrgency === 'all' || review.urgency === filterUrgency;
      const matchesResponse = 
        filterResponse === 'all' ||
        (filterResponse === 'responded' && review.hasResponse) ||
        (filterResponse === 'pending' && !review.hasResponse);

      return matchesSearch && matchesSentiment && matchesUrgency && matchesResponse;
    });
  }, [reviewInsights, searchQuery, filterSentiment, filterUrgency, filterResponse]);

  const stats = {
    total: reviewInsights.length,
    positive: reviewInsights.filter(r => r.sentiment === 'positive').length,
    negative: reviewInsights.filter(r => r.sentiment === 'negative').length,
    highUrgency: reviewInsights.filter(r => r.urgency === 'high').length,
    pending: reviewInsights.filter(r => !r.hasResponse).length,
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-green-100 text-green-800',
    };

    const labels = {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[urgency]}`}>
        {labels[urgency]}
      </span>
    );
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default:
        return <span className="w-4 h-4 text-gray-600">−</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Review Insights</h1>
        <p className="text-gray-600">Track all reviews with sentiment analysis and response status</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Positive</p>
              <p className="text-3xl font-bold text-gray-900">{stats.positive}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Negative</p>
              <p className="text-3xl font-bold text-gray-900">{stats.negative}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <ThumbsDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">High Priority</p>
              <p className="text-3xl font-bold text-gray-900">{stats.highUrgency}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews by customer name or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">💡 {microcopy.helpers.filterHelp}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sentiment
                <span className="ml-1 text-gray-400" title={microcopy.helpers.sentimentHelp}>ℹ️</span>
              </label>
              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Priority Level
                <span className="ml-1 text-gray-400" title={microcopy.helpers.urgencyHelp}>ℹ️</span>
              </label>
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Response Status</label>
              <select
                value={filterResponse}
                onChange={(e) => setFilterResponse(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="responded">Responded</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sentiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{review.customerName}</div>
                      <div className="text-sm text-gray-500 max-w-md truncate">{review.text}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(review.sentiment)}
                      <span className="text-sm capitalize text-gray-900">{review.sentiment}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUrgencyBadge(review.urgency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {review.hasResponse ? (
                      <span className="flex items-center gap-1 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        Responded
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-orange-700">
                        <Clock className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {review.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}