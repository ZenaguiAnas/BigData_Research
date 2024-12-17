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
import { fetchData, transformers, endpoints } from '@/lib/api';

export default function ArticlesByYear() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(endpoints.yearlyCount, transformers.yearlyCount)
      .then(({ data, error }) => {
        if (data) {
          setData(data);
        }
        setLoading(false);
      });
  }, []);

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