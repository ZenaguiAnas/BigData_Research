// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Chart Data Types
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
  name: string;
  value: number;
}

export interface JournalCount {
  journal: string;
  article_count: number;
}

export interface CountryCount {
  country: string;
  count: number;
}

// Filter Types
export interface FilterValues {
  year: string;
  month: string;
  country: string;
}

export type FilterKey = keyof FilterValues;