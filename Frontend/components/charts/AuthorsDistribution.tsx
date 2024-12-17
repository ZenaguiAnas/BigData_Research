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
import { fetchData } from '@/lib/api';
import type { AuthorData } from '@/lib/types';

export default function AuthorsDistribution() {
  const [data, setData] = useState<AuthorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData<AuthorData[]>('/api/articles/authors')
      .then(({ data, error }) => {
        if (data) {
          setData(data.slice(0, 10));
        }
        setLoading(false);
      });
  }, []);

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