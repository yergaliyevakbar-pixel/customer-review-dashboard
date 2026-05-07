import { Search } from 'lucide-react';
import { SentimentFilter, SortOption } from './ReviewDashboard';
import { microcopy } from '../utils/microcopy';

interface FilterControlsProps {
  sentimentFilter: SentimentFilter;
  setSentimentFilter: (filter: SentimentFilter) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function FilterControls({
  sentimentFilter,
  setSentimentFilter,
  sortOption,
  setSortOption,
  searchQuery,
  setSearchQuery,
}: FilterControlsProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={microcopy.helpers.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sentiment Filter
          </label>
          <div className="flex gap-2">
            {(['all', 'positive', 'neutral', 'negative'] as SentimentFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setSentimentFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sentimentFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
}