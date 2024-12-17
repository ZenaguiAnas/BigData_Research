'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '../charts/LoadingSpinner';
import { ArticleCard } from './ArticleCard';
import type { FilterValues } from '../filters/FilterBar';
import type { Article } from '@/lib/types';

interface ArticlesListProps {
  filters: FilterValues;
  className?: string;
}

export function ArticlesList({ filters, className }: ArticlesListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (filters.year) queryParams.append('year', filters.year);
    if (filters.month) queryParams.append('month', filters.month);
    if (filters.country) queryParams.append('countries', filters.country);

    fetch(`http://localhost:8000/api/articles?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className={className}>
      <h2 className="mb-4 text-2xl font-semibold">Research Articles</h2>
      <div className="grid gap-4">
        {articles.map((article) => (
          <ArticleCard key={article._id[0]} article={article} />
        ))}
      </div>
    </div>
  );
}