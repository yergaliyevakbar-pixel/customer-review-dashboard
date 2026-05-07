export type Sentiment = 'positive' | 'neutral' | 'negative' | 'uncertain';
export type UrgencyLevel = 'high' | 'medium' | 'low' | 'none';
export type ResponseStatus = 'pending' | 'responded' | 'archived';
export type Platform = 'Google Maps' | 'Yandex Maps' | '2GIS' | 'Instagram';

export interface Review {
  id: string;
  customerName: string;
  platform: Platform;
  rating: number;
  date: string;
  text: string;
  sentiment: Sentiment;
  urgency: UrgencyLevel;
  urgencyReason?: string;
  urgencyConfidence?: 'high' | 'medium' | 'low';
  responseStatus: ResponseStatus;
  response?: string;
  respondedAt?: string;
  keywords: string[];
  language: 'ru' | 'kk' | 'mixed';
}

export interface SentimentStats {
  positive: number;
  neutral: number;
  negative: number;
  uncertain: number;
}

export interface KeywordInsight {
  keyword: string;
  count: number;
  sentiment: 'positive' | 'negative';
}

export interface User {
  email: string;
  businessName: string;
}
