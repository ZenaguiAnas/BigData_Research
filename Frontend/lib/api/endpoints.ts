export const endpoints = {
  articles: '/api/articles',
  yearlyCount: '/api/articles/count-by-year',
  monthlyCount: '/api/articles/count-by-month',
  keywords: '/api/articles/keywords',
  authors: '/api/articles/authors',
  universities: '/api/articles/universities',
  countries: '/api/articles/countries',
  journals: '/api/articles/group-by-journal',
} as const;