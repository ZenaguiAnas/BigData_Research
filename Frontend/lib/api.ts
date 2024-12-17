const API_BASE_URL = 'http://localhost:8000';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Data transformation utilities
export const transformers = {
  yearlyCount: (data: any[]): { year: string; article_count: number }[] => {
    return data.map(([year, count]) => ({
      year,
      article_count: count,
    }));
  },

  monthlyCount: (data: any[]): { year: string; month: string; article_count: number }[] => {
    return data.map(([year, month, count]) => ({
      year,
      month,
      article_count: count,
    }));
  },

  keywords: (data: any[]): { keyword: string; count: number }[] => {
    return data.map(([keyword, count]) => ({
      keyword: keyword.trim(),
      count,
    }));
  },

  authors: (data: any[]): { author: string; count: number }[] => {
    return data.map(([author, count]) => ({
      author,
      count,
    }));
  },

  universities: (data: any[]): { university: string; count: number }[] => {
    return data.map(([university, count]) => ({
      university,
      count,
    }));
  },

  countries: (data: any[]): { country: string; count: number }[] => {
    return data.map(([country, count]) => ({
      country,
      count,
    }));
  },

  journals: (data: any[]): { journal: string; article_count: number }[] => {
    return data.map(([journal, count]) => ({
      journal,
      article_count: count,
    }));
  },
};

export async function fetchData<T>(
  endpoint: string,
  transform: (data: any) => T
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    const transformedData = transform(rawData);
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export const endpoints = {
  yearlyCount: '/api/articles/count-by-year',
  monthlyCount: '/api/articles/count-by-month',
  keywords: '/api/articles/keywords',
  authors: '/api/articles/authors',
  universities: '/api/articles/universities',
  countries: '/api/articles/countries',
  journals: '/api/articles/group-by-journal',
} as const;