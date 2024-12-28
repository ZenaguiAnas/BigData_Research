"use client";

import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import { Map, GeoJSON as LeafletGeoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";

// Interface for Country Data
interface CountryData {
  country: string;
  count: number;
}

export default function ArticlesByCountry() {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [geoData, setGeoData] = useState<any>(null); // GeoJSON data
  const mapRef = useRef<Map | null>(null); // Reference for map initialization

  useEffect(() => {
    // Fetching country statistics
    fetch("http://localhost:8000/api/articles/countries")
      .then((res) => res.json())
      .then((rawData) => {
        const transformedData = rawData
          .slice(0, 10) // Show top 10 countries
          .map(([country, count]: [string, number]) => ({
            country,
            count,
          }))
          .sort((a: any, b: any) => b.count - a.count);
        setData(transformedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    // Fetching GeoJSON data for world countries
    fetch(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    )
      .then((response) => response.json())
      .then((geoJsonData) => {
        setGeoData(geoJsonData);
      })
      .catch((error) => console.error("Error fetching GeoJSON:", error));
  }, []);

  if (loading) return <LoadingSpinner />;

  // Prepare country statistics for easy access
  const countryStats = data.reduce((acc, { country, count }) => {
    acc[country] = count;
    return acc;
  }, {} as Record<string, number>);

  // Style function to change country colors based on statistics
  const countryStyle = (feature: any) => {
    const countryName = feature.properties.name;
    const count = countryStats[countryName];
    return {
      fillColor: count ? "hsl(var(--chart-3))" : "#ddd", // Color for countries with stats
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  };

  // Handle hover event to display country stats
  const onEachCountry = (feature: any, layer: LeafletGeoJSON) => {
    const countryName = feature.properties.name;
    const count = countryStats[countryName];
    layer.bindTooltip(
      `<b>${countryName}</b><br/>${count ? count : "No data"}`,
      { direction: "top" }
    );
  };

  return (
    <div>
      {/* Bar Chart */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 className="text-lg font-bold text-center mb-4">
          Articles by Country
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="country" width={100} />
            <Tooltip
              formatter={(value) => [`${value} articles`, "Publications"]}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--chart-3))"
              name="Publications"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leaflet Map */}
      {geoData && (
        <div
          style={{
            height: "400px",
            marginTop: "2rem",
            border: "1px solid #ccc", // Border around the map
            borderRadius: "8px", // Rounded corners
            padding: "10px", // Padding around the map
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Box shadow for a "window" effect
          }}
        >
          <h3 className="text-lg font-bold text-center mb-4">Countries Map</h3>
          <MapContainer
            key={new Date().getTime()}
            ref={mapRef}
            center={[20, 0]} // Latitude and longitude to center the map
            zoom={2}
            scrollWheelZoom={false}
            style={{ width: "100%", height: "100%" }}
          >
            {/* TileLayer for map background */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Adding GeoJSON layer */}
            <GeoJSON
              data={geoData}
              style={countryStyle}
              onEachFeature={onEachCountry}
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
