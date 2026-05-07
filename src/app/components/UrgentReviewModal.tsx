import { X, AlertTriangle, MessageCircle, Signal, Info } from 'lucide-react';
import { Review } from '../types';

interface UrgentReviewModalProps {
  reviews: Review[];
  onClose: () => void;
  onRespond: (reviewId: string) => void;
}

export function UrgentReviewModal({ reviews, onClose, onRespond }: UrgentReviewModalProps) {
  const getPlatformColor = (platform: string) => {
    const colors = {
      'Google Maps': 'bg-blue-100 text-blue-800',
      'Yandex Maps': 'bg-yellow-100 text-yellow-800',
      '2GIS': 'bg-green-100 text-green-800',
      'Instagram': 'bg-pink-100 text-pink-800'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getConfidenceIcon = (confidence?: 'high' | 'medium' | 'low') => {
    if (!confidence) return null;
    
    const icons = {
      high: <Signal className="w-4 h-4 text-red-600" />,
      medium: <Signal className="w-4 h-4 text-orange-500" />,
      low: <Signal className="w-4 h-4 text-yellow-600" />
    };
    
    const labels = {
      high: 'Высокая точность',
      medium: 'Средняя точность',
      low: 'Низкая точность'
    };
    
    return (
      <div className="flex items-center gap-1.5 text-sm">
        {icons[confidence]}
        <span className={`${
          confidence === 'high' ? 'text-red-600' :
          confidence === 'medium' ? 'text-orange-500' :
          'text-yellow-600'
        }`}>
          {labels[confidence]}
        </span>
      </div>
    );
  };

  const getSentimentBadge = (sentiment: string) => {
    if (sentiment === 'uncertain') {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
          <Info className="w-4 h-4" />
          <span>Неопределенный</span>
        </div>
      );
    }
    
    const badges = {
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-gray-100 text-gray-800',
      positive: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      negative: 'Негативный',
      neutral: 'Нейтральный',
      positive: 'Позитивный'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[sentiment as keyof typeof badges]}`}>
        {labels[sentiment as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Срочные отзывы</h2>
              <p className="text-red-100 text-sm mt-1">
                {reviews.length} {reviews.length === 1 ? 'отзыв требует' : 'отзыва требуют'} немедленного внимания
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-2 border-red-200 rounded-lg p-5 bg-red-50 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{review.customerName}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(review.platform)}`}>
                      {review.platform}
                    </span>
                    {getSentimentBadge(review.sentiment)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>⭐ {review.rating}/5</span>
                    <span>{new Date(review.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                <p className="text-gray-800 leading-relaxed">{review.text}</p>
              </div>

              {review.sentiment === 'uncertain' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3 flex gap-3">
                  <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-900 mb-1">
                      Рекомендация при неопределенном тоне:
                    </p>
                    <p className="text-sm text-purple-800">
                      Проверьте оригинальный текст отзыва для точной оценки. Возможны смешанные чувства или неоднозначные формулировки.
                    </p>
                  </div>
                </div>
              )}

              {review.urgencyReason && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-amber-900 text-sm mb-1">Причина срочности:</p>
                      <p className="text-sm text-amber-800">{review.urgencyReason}</p>
                    </div>
                  </div>
                  {review.urgencyConfidence && (
                    <div className="pt-3 border-t border-amber-200">
                      {getConfidenceIcon(review.urgencyConfidence)}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => onRespond(review.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Ответить сейчас
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Совет:</strong> Отвечайте на негативные отзывы в течение 24 часов для улучшения репутации и показателя удовлетворенности клиентов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
