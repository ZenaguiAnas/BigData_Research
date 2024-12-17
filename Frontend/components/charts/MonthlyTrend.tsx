'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { LoadingSpinner } from './LoadingSpinner';
import { fetchData, transformers, endpoints } from '@/lib/api';

export default function MonthlyTrend() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(endpoints.monthlyCount, transformers.monthlyCount)
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
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={(d) => `${d.year}-${d.month}`}
          interval={2}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(label) => `Date: ${label}`}
          formatter={(value) => [`${value} articles`, 'Publications']}
        />
        <Line 
          type="monotone" 
          dataKey="article_count" 
          stroke="hsl(var(--chart-1))" 
          strokeWidth={2}
          name="Publications"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}