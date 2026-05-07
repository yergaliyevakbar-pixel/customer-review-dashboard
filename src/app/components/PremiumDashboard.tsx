import { TrendingUp, TrendingDown, MessageSquare, AlertCircle, Award, Star } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Review } from '../types';

interface PremiumDashboardProps {
  reviews: Review[];
  language: 'ru' | 'kk';
}

export function PremiumDashboard({ reviews, language }: PremiumDashboardProps) {
  const t = language === 'ru' ? translations.ru : translations.kk;

  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);
  const responseRate = ((reviews.filter(r => r.responseStatus === 'responded').length / totalReviews) * 100).toFixed(0);
  const urgentCount = reviews.filter(r => r.urgency === 'high' && r.responseStatus === 'pending').length;

  const sentimentStats = {
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length,
    uncertain: reviews.filter(r => r.sentiment === 'uncertain').length,
  };

  const sentimentTrend = [
    { month: 'Янв', positive: 8, neutral: 3, negative: 2, uncertain: 1 },
    { month: 'Фев', positive: 13, neutral: 4, negative: 6, uncertain: 1 }
  ];

  const platformData = [
    { name: 'Google Maps', value: reviews.filter(r => r.platform === 'Google Maps').length },
    { name: '2GIS', value: reviews.filter(r => r.platform === '2GIS').length },
    { name: 'Yandex Maps', value: reviews.filter(r => r.platform === 'Yandex Maps').length },
    { name: 'Instagram', value: reviews.filter(r => r.platform === 'Instagram').length },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

  // Russian keywords only
  const positiveKeywords = [
    { keyword: 'вкусная', count: 12 },
    { keyword: 'атмосфера', count: 10 },
    { keyword: 'сервис', count: 8 },
    { keyword: 'быстро', count: 7 },
    { keyword: 'уютно', count: 6 },
  ];

  const negativeKeywords = [
    { keyword: 'холодно', count: 5 },
    { keyword: 'дорого', count: 4 },
    { keyword: 'долго', count: 4 },
    { keyword: 'грубо', count: 3 },
    { keyword: 'шумно', count: 2 },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F6F8]">
      <div className="max-w-[1440px] mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboardTitle}</h1>
          <p className="text-gray-600">{t.dashboardSubtitle}</p>
        </div>

        {/* KPI Cards */}
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
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{t.responseRate}</p>
              <p className="text-3xl font-bold text-gray-900">{responseRate}%</p>
              <div className="flex items-center gap-1 text-sm text-red-600">
                <TrendingDown className="w-4 h-4" />
                <span>-3% за месяц</span>
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
                <span>Требуют внимания</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.sentimentAnalysis}</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-700" />
                </div>
                <span className="text-sm font-semibold text-green-900">{t.positive}</span>
              </div>
              <p className="text-3xl font-bold text-green-700 mb-1">{sentimentStats.positive}</p>
              <p className="text-xs text-green-600">
                {((sentimentStats.positive / totalReviews) * 100).toFixed(0)}% от всех
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-sm font-semibold text-gray-900">{t.neutral}</span>
              </div>
              <p className="text-3xl font-bold text-gray-700 mb-1">{sentimentStats.neutral}</p>
              <p className="text-xs text-gray-600">
                {((sentimentStats.neutral / totalReviews) * 100).toFixed(0)}% от всех
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-5 border border-red-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-700" />
                </div>
                <span className="text-sm font-semibold text-red-900">{t.negative}</span>
              </div>
              <p className="text-3xl font-bold text-red-700 mb-1">{sentimentStats.negative}</p>
              <p className="text-xs text-red-600">
                {((sentimentStats.negative / totalReviews) * 100).toFixed(0)}% от всех
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-700" />
                </div>
                <span className="text-sm font-semibold text-purple-900">{t.uncertain}</span>
              </div>
              <p className="text-3xl font-bold text-purple-700 mb-1">{sentimentStats.uncertain}</p>
              <p className="text-xs text-purple-600">
                {((sentimentStats.uncertain / totalReviews) * 100).toFixed(0)}% от всех
              </p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.sentimentTrend}</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} name="Позитивные" />
                <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} name="Нейтральные" />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} name="Негативные" />
                <Line type="monotone" dataKey="uncertain" stroke="#8B5CF6" strokeWidth={2} name="Неопределенные" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.platformDistribution}</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`platform-cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keywords */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Наиболее позитивные упоминания</h3>
            </div>
            <div className="space-y-4">
              {positiveKeywords.map((keyword, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{keyword.keyword}</span>
                    <span className="text-sm font-semibold text-green-600">{keyword.count}</span>
                  </div>
                  <div className="w-full bg-green-50 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(keyword.count / positiveKeywords[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Наиболее негативные упоминания</h3>
            </div>
            <div className="space-y-4">
              {negativeKeywords.map((keyword, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{keyword.keyword}</span>
                    <span className="text-sm font-semibold text-red-600">{keyword.count}</span>
                  </div>
                  <div className="w-full bg-red-50 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${(keyword.count / negativeKeywords[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const translations = {
  ru: {
    dashboardTitle: 'Дашборд отзывов',
    dashboardSubtitle: 'Обзор всех отзывов и ключевых показателей',
    totalReviews: 'Всего отзывов',
    averageRating: 'Средний рейтинг',
    responseRate: 'Процент ответов',
    urgentReviews: 'Срочные отзывы',
    sentimentAnalysis: 'Анализ настроений',
    positive: 'Позитивные',
    neutral: 'Нейтральные',
    negative: 'Негативные',
    uncertain: 'Неопределенные',
    sentimentTrend: 'Тренд настроений по месяцам',
    platformDistribution: 'Распределение по платформам',
  },
  kk: {
    dashboardTitle: 'Пікірлер бақылау тақтасы',
    dashboardSubtitle: 'Барлық пікірлер мен негізгі көрсеткіштерге шолу',
    totalReviews: 'Барлық пікірлер',
    averageRating: 'Орташа рейтинг',
    responseRate: 'Жауап беру пайызы',
    urgentReviews: 'Шұғыл пікірлер',
    sentimentAnalysis: 'Көңіл-күй талдауы',
    positive: 'Позитивті',
    neutral: 'Бейтарап',
    negative: 'Негативті',
    uncertain: 'Анықталмаған',
    sentimentTrend: 'Айлар бойынша көңіл-күй тренді',
    platformDistribution: 'Платформалар бойынша бөлу',
  }
};