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

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FilterOptions {
  year: string;
  country: string;
}

interface ChartDataType {
  year: string;
  Q1: number;
  Q2: number;
  Q3: number;
  Q4: number;
}

interface MonthlyChartData {
  month: string;
  article_count: number;
}

export default function FilteredArticlesView() {
  const [filters, setFilters] = useState<FilterOptions>({
    year: "all",
    country: "all",
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const [monthlyChartData, setMonthlyChartData] = useState<MonthlyChartData[]>([]);

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

  // Fetch chart data dynamically based on filters
  useEffect(() => {
    async function fetchChartData() {
      try {
        let url = "http://localhost:8000/api/articles";
        const queryParams = [];

        if (filters.year !== "all") queryParams.push(`year=${filters.year}`);
        if (filters.country !== "all")
          url = `http://localhost:8000/api/articles/${filters.country}`;

        const queryString = queryParams.length
          ? `?${queryParams.join("&")}`
          : "";
        const response = await axios.get(`${url}${queryString}`);
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }
    fetchChartData();
  }, [filters]);

  // Fetch monthly data based on filters
  useEffect(() => {
    async function fetchMonthlyChartData() {
      if (filters.year !== "all" && filters.country !== "all") {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/articles/count-by-month-and-country/`,
            { params: { year: filters.year, country: filters.country } }
          );
          setMonthlyChartData(response.data);
        } catch (error) {
          console.error("Error fetching monthly data:", error);
        }
      }
    }
    fetchMonthlyChartData();
  }, [filters]);

  // Fetch monthly data when year changes
  useEffect(() => {
    async function fetchMonthlyChartDataByYear() {
      if (filters.year !== "all") {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/articles/count-by-month-and-year/${filters.year}`
          );
          setMonthlyChartData(response.data);
        } catch (error) {
          console.error("Error fetching monthly data by year:", error);
        }
      }
    }
    fetchMonthlyChartDataByYear();
  }, [filters.year]);

  // Transform data for the first chart
  const getChartConfig = () => {
    const labels = chartData.map((item) => item.year);
    const Q1Data = chartData.map((item) => item.Q1);
    const Q2Data = chartData.map((item) => item.Q2);
    const Q3Data = chartData.map((item) => item.Q3);
    const Q4Data = chartData.map((item) => item.Q4);

    return {
      labels,
      datasets: [
        { label: "Q1", data: Q1Data, backgroundColor: "rgba(75, 192, 192, 0.6)" },
        { label: "Q2", data: Q2Data, backgroundColor: "rgba(54, 162, 235, 0.6)" },
        { label: "Q3", data: Q3Data, backgroundColor: "rgba(255, 206, 86, 0.6)" },
        { label: "Q4", data: Q4Data, backgroundColor: "rgba(255, 99, 132, 0.6)" },
      ],
    };
  };

  // Transform data for the second chart
  const getMonthlyChartConfig = () => {
    const labels = monthlyChartData.map((item) => item.month);
    const data = monthlyChartData.map((item) => item.article_count);

    return {
      labels,
      datasets: [
        { label: "Articles by Month", data, backgroundColor: "rgba(255, 159, 64, 0.6)" },
      ],
    };
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-lg">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Year Filter */}
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
        {/* Country Filter */}
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

      {/* Quarterly Chart */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Articles Distribution</h2>
          <Bar
            data={getChartConfig()}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Monthly Articles in {filters.year}</h2>
          <Bar
            data={getMonthlyChartConfig()}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
