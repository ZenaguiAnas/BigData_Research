'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { LoadingSpinner } from './LoadingSpinner';
import { fetchData, transformers, endpoints } from '@/lib/api';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function ArticlesByKeywords() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(endpoints.keywords, transformers.keywords)
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
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ keyword, percent }) =>
            `${keyword} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={150}
          dataKey="count"
          nameKey="keyword"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name, props) => [`${value} articles`, props.payload.keyword]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}