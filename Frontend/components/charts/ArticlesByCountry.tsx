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

export default function ArticlesByCountry() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/articles/countries')
      .then(res => res.json())
      .then(rawData => {
        const transformedData = rawData
          .slice(0, 10) // Show top 10 countries
          .map(([country, count]: [string, number]) => ({
            country,
            count
          }))
          .sort((a: any, b: any) => b.count - a.count);
        setData(transformedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 120 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="country"
          width={100}
        />
        <Tooltip formatter={(value) => [`${value} articles`, 'Publications']} />
        <Bar 
          dataKey="count" 
          fill="hsl(var(--chart-3))" 
          name="Publications"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}