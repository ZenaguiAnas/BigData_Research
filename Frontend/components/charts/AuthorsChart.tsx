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
import type { FilterValues } from '../filters/FilterBar';

interface AuthorsChartProps {
  filters: FilterValues;
}

export function AuthorsChart({ filters }: AuthorsChartProps) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (filters.year) queryParams.append('year', filters.year);
    if (filters.month) queryParams.append('month', filters.month);
    if (filters.country) queryParams.append('countries', filters.country);

    fetch(`http://localhost:8000/api/articles/authors?${queryParams}`)
      .then(res => res.json())
      .then(data => {
        const transformedData = data
          .slice(0, 10)
          .map(([author, count]: [string, number]) => ({
            author,
            count
          }));
        setData(transformedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [filters]);

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 200 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="author"
          width={180}
        />
        <Tooltip />
        <Bar dataKey="count" fill="hsl(var(--chart-4))" />
      </BarChart>
    </ResponsiveContainer>
  );
}