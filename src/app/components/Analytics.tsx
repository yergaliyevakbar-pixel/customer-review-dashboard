import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Star } from 'lucide-react';
import { Review } from '../types';

interface AnalyticsProps {
  reviews: Review[];
}

export function Analytics({ reviews }: AnalyticsProps) {
  // Sentiment trend over time
  const getSentimentTrend = () => {
    const months = ['Янв', 'Фев'];
    const data = months.map((month, index) => {
      const monthReviews = reviews.filter(r => {
        const reviewDate = new Date(r.date);
        return reviewDate.getMonth() === index;
      });

      return {
        month,
        positive: monthReviews.filter(r => r.sentiment === 'positive').length,
        neutral: monthReviews.filter(r => r.sentiment === 'neutral').length,
        negative: monthReviews.filter(r => r.sentiment === 'negative').length,
        uncertain: monthReviews.filter(r => r.sentiment === 'uncertain').length,
      };
    });

    return data;
  };

  // Platform distribution
  const getPlatformDistribution = () => {
    const platforms = ['Google Maps', 'Yandex Maps', '2GIS', 'Instagram'];
    return platforms.map(platform => ({
      name: platform,
      value: reviews.filter(r => r.platform === platform).length
    }));
  };

  // Rating distribution
  const getRatingDistribution = () => {
    return [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} ⭐`,
      count: reviews.filter(r => r.rating === rating).length
    }));
  };

  // Response time stats
  const getResponseStats = () => {
    const responded = reviews.filter(r => r.responseStatus === 'responded').length;
    const pending = reviews.filter(r => r.responseStatus === 'pending').length;
    const archived = reviews.filter(r => r.responseStatus === 'archived').length;

    return [
      { name: 'Отвечено', value: responded },
      { name: 'Ожидает', value: pending },
      { name: 'Архивировано', value: archived }
    ];
  };

  const sentimentTrend = getSentimentTrend();
  const platformDistribution = getPlatformDistribution();
  const ratingDistribution = getRatingDistribution();
  const responseStats = getResponseStats();

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const RESPONSE_COLORS = ['#10b981', '#f59e0b', '#6b7280'];

  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
  const positiveRate = ((reviews.filter(r => r.sentiment === 'positive').length / totalReviews) * 100).toFixed(0);
  const responseRate = ((reviews.filter(r => r.responseStatus === 'responded').length / totalReviews) * 100).toFixed(0);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Детальная аналитика и тренды производительности</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Общее кол-во отзывов</p>
              <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12% с прошлого месяца</span>
              </div>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Средний рейтинг</p>
              <p className="text-3xl font-bold text-gray-900">{averageRating} ⭐</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+0.3 с прошлого месяца</span>
              </div>
            </div>
            <Star className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Процент позитивных</p>
              <p className="text-3xl font-bold text-gray-900">{positiveRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+5% с прошлого месяца</span>
              </div>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Процент ответов</p>
              <p className="text-3xl font-bold text-gray-900">{responseRate}%</p>
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-3% с прошлого месяца</span>
              </div>
            </div>
            <TrendingDown className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Тренд настроений по месяцам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} name="Позитивные" />
              <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} name="Нейтральные" />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} name="Негативные" />
              <Line type="monotone" dataKey="uncertain" stroke="#8b5cf6" strokeWidth={2} name="Неопределенные" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Распределение по платформам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {platformDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Распределение рейтингов</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Количество отзывов" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Статус ответов</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={responseStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {responseStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={RESPONSE_COLORS[index % RESPONSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform Performance Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Производительность по платформам</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Платформа</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Всего отзывов</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Средний рейтинг</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Позитивные</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Негативные</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Процент ответов</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {platformDistribution.map((platform) => {
                const platformReviews = reviews.filter(r => r.platform === platform.name);
                const avgRating = platformReviews.length > 0
                  ? (platformReviews.reduce((sum, r) => sum + r.rating, 0) / platformReviews.length).toFixed(1)
                  : '0.0';
                const positiveCount = platformReviews.filter(r => r.sentiment === 'positive').length;
                const negativeCount = platformReviews.filter(r => r.sentiment === 'negative').length;
                const responseRate = platformReviews.length > 0
                  ? ((platformReviews.filter(r => r.responseStatus === 'responded').length / platformReviews.length) * 100).toFixed(0)
                  : '0';

                return (
                  <tr key={platform.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{platform.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{platform.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{avgRating} ⭐</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-medium">{positiveCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-red-600 font-medium">{negativeCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{responseRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
