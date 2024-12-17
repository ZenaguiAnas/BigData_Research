'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LoadingSpinner } from './LoadingSpinner';
import type { QuartileData } from '@/lib/types/charts';

interface QuartileDistributionChartProps {
  country: string;
}

export function QuartileDistributionChart({ country }: QuartileDistributionChartProps) {
  const [data, setData] = useState<QuartileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (country === 'all') {
      setData([]);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/api/articles/${country}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching quartile data:', error);
        setLoading(false);
      });
  }, [country]);

  if (loading) return <LoadingSpinner />;
  if (!data.length || country === 'all') {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Please select a country to view quartile distribution
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Q1" name="Q1 Articles" fill="hsl(var(--chart-1))" />
        <Bar dataKey="Q2" name="Q2 Articles" fill="hsl(var(--chart-2))" />
        <Bar dataKey="Q3" name="Q3 Articles" fill="hsl(var(--chart-3))" />
        <Bar dataKey="Q4" name="Q4 Articles" fill="hsl(var(--chart-4))" />
      </BarChart>
    </ResponsiveContainer>
  );
}