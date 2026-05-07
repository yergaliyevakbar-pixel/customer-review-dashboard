import { useState } from 'react';
import { Search, Filter, Download, Info } from 'lucide-react';
import { Review, Sentiment, UrgencyLevel, ResponseStatus } from '../types';

interface CustomerInsightsProps {
  reviews: Review[];
  onExport: (format: 'csv' | 'json') => void;
}

export function CustomerInsights({ reviews, onExport }: CustomerInsightsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === 'all' || review.sentiment === sentimentFilter;
    const matchesUrgency = urgencyFilter === 'all' || review.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'all' || review.responseStatus === statusFilter;
    const matchesPlatform = platformFilter === 'all' || review.platform === platformFilter;

    return matchesSearch && matchesSentiment && matchesUrgency && matchesStatus && matchesPlatform;
  });

  const getSentimentBadge = (sentiment: Sentiment) => {
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[sentiment]}`}>
        {labels[sentiment]}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    const badges = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-orange-100 text-orange-800',
      low: 'bg-yellow-100 text-yellow-800',
      none: 'bg-gray-100 text-gray-600'
    };
    const labels = {
      high: 'Высокая',
      medium: 'Средняя',
      low: 'Низкая',
      none: 'Нет'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[urgency]}`}>
        {labels[urgency]}
      </span>
    );
  };

  const getStatusBadge = (status: ResponseStatus) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-600'
    };
    const labels = {
      pending: 'Ожидает',
      responded: 'Отвечено',
      archived: 'Архивировано'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Insights</h2>
          <p className="text-gray-600">Все отзывы клиентов с детальной информацией</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onExport('csv')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт CSV
          </button>
          <button
            onClick={() => onExport('json')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Экспорт JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Фильтры</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Имя или текст..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Настроение</label>
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value as Sentiment | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все</option>
              <option value="positive">Позитивные</option>
              <option value="neutral">Нейтральные</option>
              <option value="negative">Негативные</option>
              <option value="uncertain">Неопределенные</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Срочность</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все</option>
              <option value="high">Высокая</option>
              <option value="medium">Средняя</option>
              <option value="low">Низкая</option>
              <option value="none">Нет</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ResponseStatus | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все</option>
              <option value="pending">Ожидает</option>
              <option value="responded">Отвечено</option>
              <option value="archived">Архивировано</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Платформа</label>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все</option>
              <option value="Google Maps">Google Maps</option>
              <option value="Yandex Maps">Yandex Maps</option>
              <option value="2GIS">2GIS</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Платформа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Рейтинг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Настроение
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Срочность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Отзыв
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{review.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPlatformColor(review.platform)}`}>
                      {review.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm">⭐ {review.rating}/5</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(review.date).toLocaleDateString('ru-RU')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSentimentBadge(review.sentiment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getUrgencyBadge(review.urgency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(review.responseStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-sm text-gray-700 line-clamp-2">{review.text}</p>
                      {review.sentiment === 'uncertain' && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-purple-600">
                          <Info className="w-3 h-3" />
                          <span>Требуется проверка</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Показано <strong>{filteredReviews.length}</strong> из <strong>{reviews.length}</strong> отзывов
          </p>
        </div>
      </div>
    </div>
  );
}
