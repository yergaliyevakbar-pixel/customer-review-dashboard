import { Reply, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { mockReviews } from '../data/mockReviews';
import { microcopy } from '../utils/microcopy';

interface ReviewWithResponse {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  text: string;
  hasResponse: boolean;
  response?: string;
  responseDate?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  source: 'Google Maps' | 'Yandex Maps' | '2GIS' | 'Instagram';
}

export function ResponseManagement() {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'responded'>('pending');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const reviewsWithResponses: ReviewWithResponse[] = mockReviews.map((review, index) => ({
    ...review,
    hasResponse: index % 3 === 0,
    response: index % 3 === 0 ? 'Thank you so much for your feedback! We\'re thrilled to hear you enjoyed your experience. We look forward to serving you again soon!' : undefined,
    responseDate: index % 3 === 0 ? new Date(new Date(review.date).getTime() + 86400000).toISOString().split('T')[0] : undefined,
  }));

  const filteredReviews = reviewsWithResponses.filter(review => {
    if (filter === 'pending') return !review.hasResponse;
    if (filter === 'responded') return review.hasResponse;
    return true;
  });

  const pendingCount = reviewsWithResponses.filter(r => !r.hasResponse).length;
  const respondedCount = reviewsWithResponses.filter(r => r.hasResponse).length;

  const handleSubmitResponse = (reviewId: string) => {
    if (!responseText.trim()) {
      setSubmitStatus('error');
      setStatusMessage(microcopy.errors.emptyResponse);
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    // In a real app, this would submit to a backend
    console.log('Submitting response for review:', reviewId, responseText);
    setSubmitStatus('success');
    setStatusMessage(microcopy.success.responseSubmitted);
    
    setTimeout(() => {
      setResponseText('');
      setSelectedReview(null);
      setSubmitStatus('idle');
    }, 2000);
  };

  const getSourceBadge = (source: ReviewWithResponse['source']) => {
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

  const getSuggestedResponse = (sentiment: string, rating: number) => {
    if (sentiment === 'positive' || rating >= 4) {
      return "Thank you so much for your wonderful feedback! We're delighted to hear you enjoyed your experience with us. Your support means the world to our team, and we can't wait to welcome you back soon!";
    } else if (sentiment === 'negative' || rating <= 2) {
      return "We sincerely apologize for your experience. This doesn't reflect the standard of service we strive to provide. We'd love the opportunity to make things right. Please contact us directly so we can address your concerns properly.";
    } else {
      return "Thank you for taking the time to share your feedback with us. We appreciate your input and are always looking for ways to improve. We hope to see you again soon!";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {submitStatus !== 'idle' && (
        <div className={`rounded-lg p-4 ${
          submitStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm font-medium ${
            submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {statusMessage}
          </p>
        </div>
      )}

      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Review Responses</h1>
        <p className="text-gray-600">{microcopy.features.responses}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Responses</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Responded</p>
              <p className="text-3xl font-bold text-gray-900">{respondedCount}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((respondedCount / reviewsWithResponses.length) * 100)}%
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Reply className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2">
          {(['all', 'pending', 'responded'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{microcopy.emptyStates.noPendingReviews}</h3>
            <p className="text-gray-600">All your reviews have been responded to. Keep up the great work!</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{review.customerName}</h3>
                    {getSourceBadge(review.source)}
                    <span className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {review.hasResponse ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Responded
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Needs Response
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.text}</p>

              {review.hasResponse && review.response && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Reply className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Your Response</span>
                    <span className="text-xs text-blue-600">
                      {review.responseDate && new Date(review.responseDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-900">{review.response}</p>
                </div>
              )}

              {!review.hasResponse && (
                <div className="space-y-3">
                  {selectedReview !== review.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedReview(review.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        {microcopy.buttons.respond}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReview(review.id);
                          setResponseText(getSuggestedResponse(review.sentiment, review.rating));
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        {microcopy.buttons.useSuggested}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder={microcopy.helpers.responsePlaceholder}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Tip: Personalize your response to show customers you genuinely care about their feedback
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitResponse(review.id)}
                          disabled={!responseText.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {microcopy.buttons.submit}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReview(null);
                            setResponseText('');
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          {microcopy.buttons.cancel}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}