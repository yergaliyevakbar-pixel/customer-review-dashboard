import { TrendingUp, TrendingDown, MessageSquare, Clock, Award } from 'lucide-react';
import { Review, SentimentStats, KeywordInsight } from '../types';

interface ReviewDashboardProps {
  reviews: Review[];
}

export function ReviewDashboard({ reviews }: ReviewDashboardProps) {
  const calculateStats = (): SentimentStats => {
    return reviews.reduce(
      (acc, review) => {
        acc[review.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0, uncertain: 0 } as SentimentStats
    );
  };

  const extractKeywordInsights = (): { positive: KeywordInsight[]; negative: KeywordInsight[] } => {
    const positiveKeywords: Record<string, number> = {};
    const negativeKeywords: Record<string, number> = {};

    reviews.forEach((review) => {
      const target = review.sentiment === 'positive' ? positiveKeywords : 
                     review.sentiment === 'negative' ? negativeKeywords : null;
      
      if (target) {
        review.keywords.forEach((keyword) => {
          target[keyword] = (target[keyword] || 0) + 1;
        });
      }
    });

    const sortKeywords = (keywords: Record<string, number>): KeywordInsight[] => {
      return Object.entries(keywords)
        .map(([keyword, count]) => ({ keyword, count, sentiment: 'positive' as const }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };

    return {
      positive: sortKeywords(positiveKeywords).map(k => ({ ...k, sentiment: 'positive' })),
      negative: sortKeywords(negativeKeywords).map(k => ({ ...k, sentiment: 'negative' }))
    };
  };

  const stats = calculateStats();
  const keywords = extractKeywordInsights();
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const responseRate = ((reviews.filter(r => r.responseStatus === 'responded').length / reviews.length) * 100).toFixed(0);
  const urgentCount = reviews.filter(r => r.urgency === 'high').length;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Dashboard</h2>
        <p className="text-gray-600">Обзор всех отзывов и ключевые метрики</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Всего отзывов</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{reviews.length}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Средний рейтинг</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{averageRating} ⭐</p>
            </div>
            <Award className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Процент ответов</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{responseRate}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Срочные отзывы</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{urgentCount}</p>
            </div>
            <Clock className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Анализ настроений</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Позитивные</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.positive}</p>
            <p className="text-xs text-green-600 mt-1">
              {((stats.positive / reviews.length) * 100).toFixed(0)}% от всех отзывов
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Нейтральные</span>
            </div>
            <p className="text-2xl font-bold text-gray-700">{stats.neutral}</p>
            <p className="text-xs text-gray-600 mt-1">
              {((stats.neutral / reviews.length) * 100).toFixed(0)}% от всех отзывов
            </p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-900">Негативные</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.negative}</p>
            <p className="text-xs text-red-600 mt-1">
              {((stats.negative / reviews.length) * 100).toFixed(0)}% от всех отзывов
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Неопределенные</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{stats.uncertain}</p>
            <p className="text-xs text-purple-600 mt-1">
              {((stats.uncertain / reviews.length) * 100).toFixed(0)}% от всех отзывов
            </p>
          </div>
        </div>
      </div>

      {/* Keyword Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Наиболее позитивные упоминания</h3>
          </div>
          <div className="space-y-3">
            {keywords.positive.length > 0 ? (
              keywords.positive.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg font-medium text-gray-700">{keyword.keyword}</span>
                    <div className="flex-1 bg-green-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(keyword.count / keywords.positive[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600 ml-3">{keyword.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Нет данных</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">Наиболее негативные упоминания</h3>
          </div>
          <div className="space-y-3">
            {keywords.negative.length > 0 ? (
              keywords.negative.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-lg font-medium text-gray-700">{keyword.keyword}</span>
                    <div className="flex-1 bg-red-100 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(keyword.count / keywords.negative[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-red-600 ml-3">{keyword.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Нет данных</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
