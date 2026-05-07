import { X, Calendar, Star } from 'lucide-react';
import { Review, Sentiment, UrgencyLevel, ResponseStatus } from '../types';

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  language: 'ru' | 'kk';
}

export function ReviewDetailModal({ review, onClose, language }: ReviewDetailModalProps) {
  const t = language === 'ru' ? translations.ru : translations.kk;

  const getSentimentBadge = (sentiment: Sentiment) => {
    const config = {
      positive: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: t.positive },
      neutral: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: t.neutral },
      negative: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: t.negative },
      uncertain: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: t.uncertain }
    };
    const { bg, text, border, label } = config[sentiment];
    return (
      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${bg} ${text} ${border}`}>
        {label}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    const config = {
      high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: t.highUrgency },
      medium: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: t.mediumUrgency },
      low: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: t.lowUrgency },
      none: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: t.noUrgency }
    };
    const { bg, text, border, label } = config[urgency];
    return (
      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${bg} ${text} ${border}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: ResponseStatus) => {
    const config = {
      pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: t.pending },
      responded: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: t.responded },
      archived: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', label: t.archived }
    };
    const { bg, text, border, label } = config[status];
    return (
      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${bg} ${text} ${border}`}>
        {label}
      </span>
    );
  };

  const getPlatformBadge = (platform: string) => {
    const config = {
      'Google Maps': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'Yandex Maps': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      '2GIS': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      'Instagram': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
    };
    const { bg, text, border } = config[platform as keyof typeof config] || config['Google Maps'];
    return (
      <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${bg} ${text} ${border}`}>
        {platform}
      </span>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">{t.reviewDetails}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-6">
            {/* Date and Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {new Date(review.date).toLocaleDateString('ru-RU', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-bold text-gray-900">{review.rating}/5</span>
              </div>
            </div>

            {/* Platform */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">{t.platform}</p>
              {getPlatformBadge(review.platform)}
            </div>

            {/* Review Text */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">{t.reviewText}</p>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-base leading-relaxed text-gray-800">{review.text}</p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{t.sentiment}</p>
                {getSentimentBadge(review.sentiment)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{t.urgency}</p>
                {getUrgencyBadge(review.urgency)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{t.status}</p>
                {getStatusBadge(review.responseStatus)}
              </div>
            </div>

            {/* Urgency Reason */}
            {review.urgencyReason && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">{t.urgencyReason}</p>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-sm text-amber-900">{review.urgencyReason}</p>
                  {review.urgencyConfidence && (
                    <p className="text-xs text-amber-700 mt-2">
                      {t.confidence}: {review.urgencyConfidence === 'high' ? t.high : review.urgencyConfidence === 'medium' ? t.medium : t.low}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Response (if exists) */}
            {review.response && review.responseStatus === 'responded' && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">{t.ourResponse}</p>
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <p className="text-base text-green-900">{review.response}</p>
                  {review.respondedAt && (
                    <p className="text-xs text-green-700 mt-3">
                      {t.respondedOn} {new Date(review.respondedAt).toLocaleDateString('ru-RU', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Keywords */}
            {review.keywords && review.keywords.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">{t.keywords}</p>
                <div className="flex flex-wrap gap-2">
                  {review.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Language */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">{t.language}</p>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                {review.language === 'ru' ? 'Русский' : review.language === 'kk' ? 'Қазақша' : 'Смешанный'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const translations = {
  ru: {
    reviewDetails: 'Детали отзыва',
    platform: 'Платформа',
    reviewText: 'Текст отзыва',
    sentiment: 'Настроение',
    urgency: 'Срочность',
    status: 'Статус',
    urgencyReason: 'Причина срочности',
    confidence: 'Уверенность',
    high: 'Высокая',
    medium: 'Средняя',
    low: 'Низкая',
    ourResponse: 'Наш ответ',
    respondedOn: 'Отвечено',
    keywords: 'Ключевые слова',
    language: 'Язык',
    positive: 'Позитивный',
    neutral: 'Нейтральный',
    negative: 'Негативный',
    uncertain: 'Неопределенный',
    highUrgency: 'Высокая',
    mediumUrgency: 'Средняя',
    lowUrgency: 'Низкая',
    noUrgency: 'Нет',
    pending: 'Ожидает',
    responded: 'Отвечено',
    archived: 'Архивировано'
  },
  kk: {
    reviewDetails: 'Пікір толық ақпараты',
    platform: 'Платформа',
    reviewText: 'Пікір мәтіні',
    sentiment: 'Көңіл-күй',
    urgency: 'Шұғылдық',
    status: 'Мәртебе',
    urgencyReason: 'Шұғылдық себебі',
    confidence: 'Сенімділік',
    high: 'Жоғары',
    medium: 'Орташа',
    low: 'Төмен',
    ourResponse: 'Біздің жауап',
    respondedOn: 'Жауап берілді',
    keywords: 'Кілт сөздер',
    language: 'Тіл',
    positive: 'Позитивті',
    neutral: 'Бейтарап',
    negative: 'Негативті',
    uncertain: 'Анықталмаған',
    highUrgency: 'Жоғары',
    mediumUrgency: 'Орташа',
    lowUrgency: 'Төмен',
    noUrgency: 'Жоқ',
    pending: 'Күтуде',
    responded: 'Жауап берілді',
    archived: 'Мұрағатталған'
  }
};
