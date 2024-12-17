"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FilterOptions {
  year: string;
  month: string;
  country: string;
}

interface ChartDataType {
  year: string;
  month: string;
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
}

export default function FilteredArticlesView() {
  const [filters, setFilters] = useState<FilterOptions>({
    year: "all",
    month: "all",
    country: "all",
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);

  // Fetch list of countries on component mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await axios.get("http://localhost:8000/countries");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchCountries();
  }, []);

  // Fetch chart data based on filters
  useEffect(() => {
    async function fetchChartData() {
      try {
        let url = "http://localhost:8000/api/articles";
        const queryParams = new URLSearchParams();

        if (filters.year !== "all") queryParams.append("year", filters.year);
        if (filters.month !== "all") queryParams.append("month", filters.month);
        if (filters.country !== "all") queryParams.append("country", filters.country);

        // Final URL with dynamic query parameters
        const finalUrl = `${url}?${queryParams.toString()}`;
        const response = await axios.get(finalUrl);
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchChartData();
  }, [filters]);

  // Transform data for the chart
  const getChartConfig = () => {
    const labels = chartData.map((item) => `${item.year} - Month ${item.month}`);
    const Q1Data = chartData.map((item) => item.Q1);
    const Q2Data = chartData.map((item) => item.Q2);
    const Q3Data = chartData.map((item) => item.Q3);
    const Q4Data = chartData.map((item) => item.Q4);

    return {
      labels,
      datasets: [
        {
          label: "Q1",
          data: Q1Data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Q2",
          data: Q2Data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Q3",
          data: Q3Data,
          backgroundColor: "rgba(255, 206, 86, 0.6)",
        },
        {
          label: "Q4",
          data: Q4Data,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

  // Update filter state
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-lg">
      {/* Filters */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Select Year</label>
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Select Month</label>
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={(index + 1).toString()}>
                {`Month ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Select Country</label>
          <select
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Articles Distribution</h2>
          <Bar
            data={getChartConfig()}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
