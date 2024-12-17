'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LoadingSpinner } from './LoadingSpinner';
import type { FilterValues } from '@/lib/types/filters';
import type { FilteredArticlesData } from '@/lib/types/charts';

interface FilteredArticlesChartProps {
  filters: FilterValues;
}

export function FilteredArticlesChart({ filters }: FilteredArticlesChartProps) {
  const [data, setData] = useState<FilteredArticlesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const country = new URLSearchParams();

    fetch(`http://localhost:8000/api/articles/${country}`)
      .then((res) => res.json())
      .then((data) => {
        const transformedData = data.map(([year, count]: [string, number]) => ({
          year,
          article_count: count,
        }));
        setData(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`${value} articles`, 'Publications']}
        />
        <Bar
          dataKey="article_count"
          fill="hsl(var(--chart-1))"
          name="Publications"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}