"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import WordCloud from "react-wordcloud";
import { LoadingSpinner } from "./LoadingSpinner";
import { fetchData, transformers, endpoints } from "@/lib/api";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ArticlesByKeywords() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(endpoints.keywords, transformers.keywords).then(
      ({ data, error }) => {
        if (data) {
          setData(data.slice(0, 10)); // Top 10 keywords
        }
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <LoadingSpinner />;

  // Prepare word cloud data
  const wordCloudData = data.map(({ keyword, count }) => ({
    text: keyword,
    value: count,
  }));

  const wordCloudOptions = {
    rotations: 2,
    rotationAngles: [-90, 0],
    scale: "sqrt",
    fontSizes: [15, 50] as [number, number], // Explicitly define as a tuple
    colors: COLORS,
  };

  return (
    <div>
      {/* Pie Chart Container */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 className="text-lg font-bold text-center mb-4">
          Keyword Distribution
        </h3>
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
              formatter={(value, name, props) => [
                `${value} articles`,
                props.payload.keyword,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Word Cloud Container */}
      <div style={{ height: "400px", marginTop: "2rem" }}>
        <h3 className="text-lg font-bold text-center mb-4">
          Keywords Word Cloud
        </h3>
        <WordCloud words={wordCloudData} options={wordCloudOptions} />
      </div>
    </div>
  );
}
