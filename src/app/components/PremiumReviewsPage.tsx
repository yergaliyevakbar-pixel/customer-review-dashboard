import { useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';
import { Review, Sentiment, UrgencyLevel, ResponseStatus } from '../types';
import { ReviewDetailModal } from './ReviewDetailModal';

interface PremiumReviewsPageProps {
  reviews: Review[];
  onExport: (format: 'csv' | 'json') => void;
  language: 'ru' | 'kk';
}

export function PremiumReviewsPage({ reviews, onExport, language }: PremiumReviewsPageProps) {
  const t = language === 'ru' ? translations.ru : translations.kk;

  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === 'all' || review.sentiment === sentimentFilter;
    const matchesUrgency = urgencyFilter === 'all' || review.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'all' || review.responseStatus === statusFilter;
    const matchesPlatform = platformFilter === 'all' || review.platform === platformFilter;

    return matchesSearch && matchesSentiment && matchesUrgency && matchesStatus && matchesPlatform;
  });

  const getSentimentBadge = (sentiment: Sentiment) => {
    const config = {
      positive: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: t.positive },
      neutral: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: t.neutral },
      negative: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: t.negative },
      uncertain: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: t.uncertain }
    };
    const { bg, text, border, label } = config[sentiment];
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${bg} ${text} ${border}`}>
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
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${bg} ${text} ${border}`}>
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
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${bg} ${text} ${border}`}>
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
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${bg} ${text} ${border}`}>
        {platform}
      </span>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F6F8]">
      <div className="max-w-[1440px] mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.pageTitle}</h1>
            <p className="text-gray-600">{t.pageSubtitle}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onExport('csv')}
              className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl border border-gray-200 flex items-center gap-2 transition-all font-medium text-sm shadow-sm"
            >
              <Download className="w-4 h-4" />
              {t.exportCSV}
            </button>
            <button
              onClick={() => onExport('json')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-all font-medium text-sm shadow-sm"
            >
              <Download className="w-4 h-4" />
              {t.exportJSON}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.search}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.sentiment}</label>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value as Sentiment | 'all')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">{t.all}</option>
                <option value="positive">{t.positive}</option>
                <option value="neutral">{t.neutral}</option>
                <option value="negative">{t.negative}</option>
                <option value="uncertain">{t.uncertain}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.urgency}</label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | 'all')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">{t.all}</option>
                <option value="high">{t.highUrgency}</option>
                <option value="medium">{t.mediumUrgency}</option>
                <option value="low">{t.lowUrgency}</option>
                <option value="none">{t.noUrgency}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.status}</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ResponseStatus | 'all')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">{t.all}</option>
                <option value="pending">{t.pending}</option>
                <option value="responded">{t.responded}</option>
                <option value="archived">{t.archived}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.platform}</label>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">{t.all}</option>
                <option value="Google Maps">Google Maps</option>
                <option value="Yandex Maps">Yandex Maps</option>
                <option value="2GIS">2GIS</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.date}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.rating}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.platform}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.sentiment}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.urgency}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.status}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t.review}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredReviews.map((review) => (
                  <tr 
                    key={review.id} 
                    onClick={() => setSelectedReview(review)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(review.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-gray-900">{review.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getPlatformBadge(review.platform)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getSentimentBadge(review.sentiment)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getUrgencyBadge(review.urgency)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(review.responseStatus)}
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                        {review.text}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {t.showing} <span className="font-semibold text-gray-900">{filteredReviews.length}</span> {t.of} <span className="font-semibold text-gray-900">{reviews.length}</span> {t.reviews}
            </p>
          </div>
        </div>
      </div>
      {selectedReview && <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReview(null)} language={language} />}
    </div>
  );
}

const translations = {
  ru: {
    pageTitle: 'Отзывы клиентов',
    pageSubtitle: 'Все отзывы с фильтрацией и статусами',
    exportCSV: 'Экспорт CSV',
    exportJSON: 'Экспорт JSON',
    search: 'Поиск',
    searchPlaceholder: 'Поиск по отзыву...',
    sentiment: 'Настроение',
    urgency: 'Срочность',
    status: 'Статус',
    platform: 'Платформа',
    rating: 'Рейтинг',
    date: 'Дата',
    review: 'Отзыв',
    all: 'Все',
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
    archived: 'Архивировано',
    showing: 'Показано',
    of: 'из',
    reviews: 'отзывов'
  },
  kk: {
    pageTitle: 'Клиенттер пікірлері',
    pageSubtitle: 'Сүзгілермен және мәртебелермен барлық пікірлер',
    exportCSV: 'CSV экспорты',
    exportJSON: 'JSON экспорты',
    search: 'Іздеу',
    searchPlaceholder: 'Пікірден іздеу...',
    sentiment: 'Көңіл-күй',
    urgency: 'Шұғылдық',
    status: 'Мәртебе',
    platform: 'Плат��орма',
    rating: 'Рейтинг',
    date: 'Күні',
    review: 'Пікір',
    all: 'Барлығы',
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
    archived: 'Мұрағатталған',
    showing: 'Көрсетілген',
    of: 'ден',
    reviews: 'пікірлер'
  }
};