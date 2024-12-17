export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface YearlyCount {
  year: string;
  article_count: number;
}

export interface MonthlyCount {
  year: string;
  month: string;
  article_count: number;
}

export interface KeywordCount {
  keyword: string;
  count: number;
}

export interface JournalCount {
  journal: string;
  article_count: number;
}

export interface CountryCount {
  country: string;
  count: number;
}