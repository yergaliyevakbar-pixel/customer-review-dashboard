import { useState } from 'react';
import { Send, Check, Archive, AlertTriangle, Info, Sparkles, RefreshCw } from 'lucide-react';
import { Review } from '../types';
import { generateAISuggestedResponse } from '../utils/aiSuggestions';

interface ReviewResponsesProps {
  reviews: Review[];
  onRespond: (reviewId: string, response: string) => void;
  onArchive: (reviewId: string) => void;
}

export function ReviewResponses({ reviews, onRespond, onArchive }: ReviewResponsesProps) {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [filter, setFilter] = useState<'pending' | 'responded' | 'all'>('pending');

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    return review.responseStatus === filter;
  });

  const pendingReviews = filteredReviews.filter(r => r.responseStatus === 'pending');
  const respondedReviews = filteredReviews.filter(r => r.responseStatus === 'responded');

  const handleSubmitResponse = () => {
    if (selectedReview && responseText.trim()) {
      onRespond(selectedReview, responseText.trim());
      setResponseText('');
      setSelectedReview(null);
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const badges = {
      positive: 'bg-green-100 text-green-800',
      neutral: 'bg-gray-100 text-gray-800',
      negative: 'bg-red-100 text-red-800',
      uncertain: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      positive: 'Позитивный',
      neutral: 'Нейтральный',
      negative: 'Негативный',
      uncertain: 'Неопределенный'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[sentiment as keyof typeof badges]}`}>
        {labels[sentiment as keyof typeof labels]}
      </span>
    );
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      'Google Maps': 'bg-blue-100 text-blue-800',
      'Yandex Maps': 'bg-yellow-100 text-yellow-800',
      '2GIS': 'bg-green-100 text-green-800',
      'Instagram': 'bg-pink-100 text-pink-800'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const selectedReviewData = reviews.find(r => r.id === selectedReview);

  const handleSelectReview = (reviewId: string) => {
    setSelectedReview(reviewId);
    const review = reviews.find(r => r.id === reviewId);
    if (review && review.responseStatus === 'pending') {
      const suggestion = generateAISuggestedResponse(review);
      setAiSuggestion(suggestion);
      setShowSuggestion(true);
      setResponseText('');
    } else {
      setShowSuggestion(false);
      setResponseText('');
    }
  };

  const handleUseSuggestion = () => {
    setResponseText(aiSuggestion);
    setShowSuggestion(false);
  };

  const handleRegenerateSuggestion = () => {
    if (selectedReviewData) {
      const suggestion = generateAISuggestedResponse(selectedReviewData);
      setAiSuggestion(suggestion);
      setShowSuggestion(true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F6F8]">
      <div className="max-w-[1440px] mx-auto p-8 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Responses</h2>
          <p className="text-gray-600">Взаимодействие с отзывами клиентов</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ожидают ({pendingReviews.length})
          </button>
          <button
            onClick={() => setFilter('responded')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'responded'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Отвечено ({respondedReviews.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Все ({filteredReviews.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Список отзывов</h3>
            <div className="space-y-3 max-h-[700px] overflow-y-auto">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  onClick={() => handleSelectReview(review.id)}
                  className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                    selectedReview === review.id
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${review.urgency === 'high' ? 'bg-red-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        {review.urgency === 'high' && (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPlatformColor(review.platform)}`}>
                          {review.platform}
                        </span>
                        {getSentimentBadge(review.sentiment)}
                        <span className="text-xs text-gray-500">
                          ⭐ {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.date).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{review.text}</p>
                  {review.sentiment === 'uncertain' && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-purple-600 bg-purple-50 rounded px-2 py-1">
                      <Info className="w-3 h-3" />
                      <span>Неопределенный тон - проверьте оригинал</span>
                    </div>
                  )}
                  {review.responseStatus === 'responded' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Ответ отправлен {review.respondedAt ? new Date(review.respondedAt).toLocaleDateString('ru-RU') : ''}</span>
                    </div>
                  )}
                </div>
              ))}
              {filteredReviews.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Нет отзывов в этой категории</p>
                </div>
              )}
            </div>
          </div>

          {/* Response Panel */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Панель ответа</h3>
            {selectedReviewData ? (
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedReviewData.customerName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(selectedReviewData.platform)}`}>
                          {selectedReviewData.platform}
                        </span>
                        {getSentimentBadge(selectedReviewData.sentiment)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(selectedReviewData.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="text-sm mt-1">⭐ {selectedReviewData.rating}/5</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-800">{selectedReviewData.text}</p>
                  </div>
                </div>

                {selectedReviewData.sentiment === 'uncertain' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex gap-3">
                    <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900 mb-1">
                        Отзыв с неопределенным тоном
                      </p>
                      <p className="text-sm text-purple-800">
                        Перед ответом рекомендуем проверить оригинальный текст для точной оценки настроения клиента.
                      </p>
                    </div>
                  </div>
                )}

                {selectedReviewData.urgencyReason && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900 text-sm mb-1">Причина срочности:</p>
                        <p className="text-sm text-amber-800">{selectedReviewData.urgencyReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedReviewData.responseStatus === 'responded' ? (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <p className="font-medium text-green-900">Ваш ответ:</p>
                    </div>
                    <p className="text-sm text-green-800">{selectedReviewData.response}</p>
                    <p className="text-xs text-green-600 mt-2">
                      Отправлено {selectedReviewData.respondedAt ? new Date(selectedReviewData.respondedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ваш ответ
                      </label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Напишите вежливый и профессиональный ответ..."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {responseText.length} символов
                      </p>
                    </div>

                    {showSuggestion && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-gray-600" />
                            <p className="text-sm font-medium text-gray-600">Предложение AI:</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleUseSuggestion}
                              className="px-2 py-1 bg-blue-500 text-white font-medium rounded-lg transition-colors"
                            >
                              Использовать
                            </button>
                            <button
                              onClick={handleRegenerateSuggestion}
                              className="px-2 py-1 bg-gray-300 text-gray-600 font-medium rounded-lg transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-800 mt-2">{aiSuggestion}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitResponse}
                        disabled={!responseText.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Отправить ответ
                      </button>
                      <button
                        onClick={() => onArchive(selectedReviewData.id)}
                        className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Archive className="w-5 h-5" />
                        Архивировать
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Выберите отзыв для ответа</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}