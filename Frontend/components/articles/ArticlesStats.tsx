'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '../charts/LoadingSpinner';
import { FileText, Users, Building2, Globe2 } from 'lucide-react';
import type { FilterValues } from '../filters/FilterBar';

interface ArticlesStatsProps {
  filters: FilterValues;
  className?: string;
}

interface Stats {
  articles: number;
  authors: number;
  universities: number;
  countries: number;
}

export function ArticlesStats({ filters, className }: ArticlesStatsProps) {
  const [stats, setStats] = useState<Stats>({
    articles: 0,
    authors: 0,
    universities: 0,
    countries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (filters.year) queryParams.append('year', filters.year);
    if (filters.month) queryParams.append('month', filters.month);
    if (filters.country) queryParams.append('countries', filters.country);

    fetch(`http://localhost:8000/api/articles?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        const uniqueAuthors = new Set(data.flatMap(article => article.authors));
        const uniqueUniversities = new Set(data.flatMap(article => article.universeties));
        const uniqueCountries = new Set(data.flatMap(article => article.countries));

        setStats({
          articles: data.length,
          authors: uniqueAuthors.size,
          universities: uniqueUniversities.size,
          countries: uniqueCountries.size,
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <LoadingSpinner />;

  const statItems = [
    { icon: FileText, label: 'Articles', value: stats.articles },
    { icon: Users, label: 'Authors', value: stats.authors },
    { icon: Building2, label: 'Universities', value: stats.universities },
    { icon: Globe2, label: 'Countries', value: stats.countries },
  ];

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="p-6">
            <div className="flex items-center gap-4">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}