export const transformers = {
  yearlyCount: (data: any[]) =>
    data.map(([year, count]) => ({
      year,
      article_count: count,
    })),

  monthlyCount: (data: any[]) =>
    data.map(([year, month, count]) => ({
      year,
      month,
      article_count: count,
    })),

  keywords: (data: any[]) =>
    data
      .slice(0, 10)
      .map(([keyword, count]) => ({
        name: keyword.trim(),
        value: count,
      })),

  journals: (data: any[]) =>
    data
      .slice(0, 10)
      .map(([journal, count]) => ({
        journal,
        article_count: count,
      })),

  countries: (data: any[]) =>
    data
      .slice(0, 15)
      .map(([country, count]) => ({
        country,
        count,
      })),
} as const;