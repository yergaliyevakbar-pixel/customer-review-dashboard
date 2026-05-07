import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, Star, MessageSquare, Clock, AlertCircle, Target, Award, Calendar } from 'lucide-react';
import { Review } from '../types';

interface EnhancedAnalyticsProps {
  reviews: Review[];
  language: 'ru' | 'kk';
}

export function EnhancedAnalytics({ reviews, language }: EnhancedAnalyticsProps) {
  const t = language === 'ru' ? translations.ru : translations.kk;

  // Advanced metrics calculations
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
  const positiveCount = reviews.filter(r => r.sentiment === 'positive').length;
  const negativeCount = reviews.filter(r => r.sentiment === 'negative').length;
  const neutralCount = reviews.filter(r => r.sentiment === 'neutral').length;
  const positiveRate = ((positiveCount / totalReviews) * 100).toFixed(0);
  const responseRate = ((reviews.filter(r => r.responseStatus === 'responded').length / totalReviews) * 100).toFixed(0);
  const urgentCount = reviews.filter(r => r.urgency === 'high' && r.responseStatus === 'pending').length;

  // Net Sentiment Score (similar to NPS)
  const netSentimentScore = (((positiveCount - negativeCount) / totalReviews) * 100).toFixed(0);

  // Monthly trend data
  const getMonthlyTrend = () => {
    const months = ['Дек', 'Янв', 'Фев'];
    return months.map((month, index) => {
      const monthReviews = reviews.filter(r => {
        const reviewDate = new Date(r.date);
        return reviewDate.getMonth() === index;
      });

      const avgRating = monthReviews.length > 0
        ? (monthReviews.reduce((sum, r) => sum + r.rating, 0) / monthReviews.length).toFixed(1)
        : 0;

      return {
        month,
        total: monthReviews.length,
        positive: monthReviews.filter(r => r.sentiment === 'positive').length,
        neutral: monthReviews.filter(r => r.sentiment === 'neutral').length,
        negative: monthReviews.filter(r => r.sentiment === 'negative').length,
        avgRating: parseFloat(avgRating),
        responseRate: monthReviews.length > 0
          ? ((monthReviews.filter(r => r.responseStatus === 'responded').length / monthReviews.length) * 100).toFixed(0)
          : 0
      };
    });
  };

  // Platform performance
  const getPlatformStats = () => {
    const platforms = ['Google Maps', 'Yandex Maps', '2GIS', 'Instagram'];
    return platforms.map(platform => {
      const platformReviews = reviews.filter(r => r.platform === platform);
      const total = platformReviews.length;
      const avgRating = total > 0
        ? (platformReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : '0.0';
      const positive = platformReviews.filter(r => r.sentiment === 'positive').length;
      const negative = platformReviews.filter(r => r.sentiment === 'negative').length;
      const responded = platformReviews.filter(r => r.responseStatus === 'responded').length;
      const responseRate = total > 0 ? ((responded / total) * 100).toFixed(0) : '0';

      return {
        name: platform,
        total,
        avgRating: parseFloat(avgRating),
        positive,
        negative,
        responseRate: parseFloat(responseRate)
      };
    });
  };

  // Rating distribution over time
  const getRatingTrend = () => {
    const months = ['Дек', 'Янв', 'Фев'];
    return months.map((month, index) => {
      const monthReviews = reviews.filter(r => {
        const reviewDate = new Date(r.date);
        return reviewDate.getMonth() === index;
      });

      return {
        month,
        '5★': monthReviews.filter(r => r.rating === 5).length,
        '4★': monthReviews.filter(r => r.rating === 4).length,
        '3★': monthReviews.filter(r => r.rating === 3).length,
        '2★': monthReviews.filter(r => r.rating === 2).length,
        '1★': monthReviews.filter(r => r.rating === 1).length,
      };
    });
  };

  // Response time analysis
  const getResponseAnalysis = () => {
    return [
      { category: 'Отвечено', count: reviews.filter(r => r.responseStatus === 'responded').length, color: '#10B981' },
      { category: 'Ожидает ответа', count: reviews.filter(r => r.responseStatus === 'pending').length, color: '#F59E0B' },
      { category: 'Архивировано', count: reviews.filter(r => r.responseStatus === 'archived').length, color: '#6B7280' }
    ];
  };

  // Sentiment by platform
  const getSentimentByPlatform = () => {
    const platforms = ['Google Maps', 'Yandex Maps', '2GIS', 'Instagram'];
    return platforms.map(platform => {
      const platformReviews = reviews.filter(r => r.platform === platform);
      return {
        platform,
        positive: platformReviews.filter(r => r.sentiment === 'positive').length,
        neutral: platformReviews.filter(r => r.sentiment === 'neutral').length,
        negative: platformReviews.filter(r => r.sentiment === 'negative').length
      };
    });
  };

  const monthlyTrend = getMonthlyTrend();
  const platformStats = getPlatformStats();
  const ratingTrend = getRatingTrend();
  const responseAnalysis = getResponseAnalysis();
  const sentimentByPlatform = getSentimentByPlatform();

  const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EC4899'];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F6F8]">
      <div className="max-w-[1440px] mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.pageTitle}</h1>
          <p className="text-gray-600">{t.pageSubtitle}</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{t.totalReviews}</p>
              <p className="text-3xl font-bold text-gray-900">{totalReviews}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12% за месяц</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{t.averageRating}</p>
              <p className="text-3xl font-bold text-gray-900">{averageRating} ⭐</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+0.3 за месяц</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{t.netSentiment}</p>
              <p className="text-3xl font-bold text-gray-900">{netSentimentScore}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>Отлично</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{t.urgentReviews}</p>
              <p className="text-3xl font-bold text-gray-900">{urgentCount}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>Требуют ответа</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-[16px] shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium opacity-90">{t.positiveReviews}</p>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">{positiveCount}</p>
            <p className="text-sm opacity-80">{positiveRate}% от всех отзывов</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-[16px] shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium opacity-90">{t.negativeReviews}</p>
              <TrendingDown className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">{negativeCount}</p>
            <p className="text-sm opacity-80">{((negativeCount / totalReviews) * 100).toFixed(0)}% от всех отзывов</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[16px] shadow-sm p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium opacity-90">{t.responseRate}</p>
              <Award className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">{responseRate}%</p>
            <p className="text-sm opacity-80">Средняя скорость: 2.3 дня</p>
          </div>
        </div>

        {/* Monthly Overview Chart */}
        <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.monthlyOverview}</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area yAxisId="left" type="monotone" dataKey="total" fill="#3B82F6" fillOpacity={0.2} stroke="#3B82F6" strokeWidth={2} name="Всего отзывов" />
              <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#F59E0B" strokeWidth={3} name="Средний рейтинг" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Trends */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.sentimentTrend}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} name="Позитивные" />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.6} name="Нейтральные" />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.8} name="Негативные" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.ratingDistribution}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={ratingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="5★" stackId="a" fill="#10B981" />
                <Bar dataKey="4★" stackId="a" fill="#84CC16" />
                <Bar dataKey="3★" stackId="a" fill="#F59E0B" />
                <Bar dataKey="2★" stackId="a" fill="#F97316" />
                <Bar dataKey="1★" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.platformPerformance}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Платформа</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Всего</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ср. рейтинг</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Позитивные</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Негативные</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">% Ответов</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Тренд</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {platformStats.map((platform, index) => (
                  <tr key={platform.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="font-semibold text-gray-900">{platform.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium">{platform.total}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-900 font-semibold">{platform.avgRating}</span>
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">
                        {platform.positive}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-semibold">
                        {platform.negative}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${platform.responseRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{platform.responseRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>+8%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Response Analysis & Sentiment by Platform */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.responseAnalysis}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={responseAnalysis}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count }) => `${category}: ${count}`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {responseAnalysis.map((entry, index) => (
                    <Cell key={`response-cell-${entry.category}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.sentimentByPlatform}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentByPlatform}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="platform" stroke="#6B7280" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="positive" fill="#10B981" name="Позитивные" />
                <Bar dataKey="neutral" fill="#6B7280" name="Нейтральные" />
                <Bar dataKey="negative" fill="#EF4444" name="Негативные" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.keyInsights}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Позитивная динамика</h4>
                  <p className="text-sm text-green-700">Количество положительных отзывов выросло на 12% за последний месяц</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Лучшая платформа</h4>
                  <p className="text-sm text-blue-700">2GIS показывает самый высокий средний рейтинг - {platformStats.find(p => p.name === '2GIS')?.avgRating} ⭐</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Требуется внимание</h4>
                  <p className="text-sm text-amber-700">{urgentCount} срочных отзывов требуют немедленного ответа</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900 mb-1">Цель качества</h4>
                  <p className="text-sm text-purple-700">Для улучшения Net Sentiment Score сфокусируйтесь на решении негативных отзывов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const translations = {
  ru: {
    pageTitle: 'Аналитика трендов',
    pageSubtitle: 'Детальная аналитика производительности и тренды отзывов',
    totalReviews: 'Всего отзывов',
    averageRating: 'Средний рейтинг',
    netSentiment: 'Net Sentiment',
    urgentReviews: 'Срочные отзывы',
    positiveReviews: 'Позитивные отзывы',
    negativeReviews: 'Негативные отзывы',
    responseRate: 'Процент ответов',
    monthlyOverview: 'Общий обзор по месяцам',
    sentimentTrend: 'Тренд настроений',
    ratingDistribution: 'Распределение рейтингов',
    platformPerformance: 'Производительность платформ',
    responseAnalysis: 'Анализ ответов',
    sentimentByPlatform: 'Настроения по платформам',
    keyInsights: 'Ключевые инсайты'
  },
  kk: {
    pageTitle: 'Трендтер аналитикасы',
    pageSubtitle: 'Өнімділік пен пікірлер трендінің толық аналитикасы',
    totalReviews: 'Барлық пікірлер',
    averageRating: 'Орташа рейтинг',
    netSentiment: 'Net Sentiment',
    urgentReviews: 'Шұғыл пікірлер',
    positiveReviews: 'Позитивті пікірлер',
    negativeReviews: 'Негативті пікірлер',
    responseRate: 'Жауап беру пайызы',
    monthlyOverview: 'Айлық жалпы шолу',
    sentimentTrend: 'Көңіл-күй тренді',
    ratingDistribution: 'Рейтинг бөлінісі',
    platformPerformance: 'Платформалар өнімділігі',
    responseAnalysis: 'Жауаптар талдауы',
    sentimentByPlatform: 'Платформалар бойынша көңіл-күй',
    keyInsights: 'Негізгі түсініктер'
  }
};