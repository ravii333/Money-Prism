import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { FaChartLine, FaChartBar } from "react-icons/fa";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700">
        <p className="label font-semibold">{`Date: ${label}`}</p>
        <p className="intro text-blue-300">{`Price: ₹${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const PriceHistoryChart = ({ data }) => {
  const [chartType, setChartType] = useState("line");

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <FaChartLine size={48} className="text-gray-300 mb-4" />
        <p className="text-center text-gray-500 font-medium">
          No price history available to display.
        </p>
        <p className="text-center text-sm text-gray-400">
          Track this product to see its price changes over time.
        </p>
      </div>
    );
  }

  const currentPrice = data[data.length - 1]?.price;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      {/* --- Chart Type Toggle Buttons --- */}
      <div className="flex justify-end items-center mb-4 space-x-2">
        <button
          onClick={() => setChartType("line")}
          title="Switch to Line Chart"
          className={`p-2 rounded-md transition-colors ${
            chartType === "line"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-600 hover:bg-blue-100"
          }`}
        >
          <FaChartLine size={16} />
        </button>
        <button
          onClick={() => setChartType("bar")}
          title="Switch to Bar Chart"
          className={`p-2 rounded-md transition-colors ${
            chartType === "bar"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-600 hover:bg-blue-100"
          }`}
        >
          <FaChartBar size={16} />
        </button>
      </div>

      {/* --- Responsive Chart Container --- */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          {chartType === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                dataKey="price"
                tickFormatter={(value) => `₹${value / 1000}k`}
                domain={["dataMin - 1000", "dataMax + 1000"]}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                name="Historical Price"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              {/* Reference line for current price */}
              <ReferenceLine
                y={currentPrice}
                label={{
                  value: "Current",
                  position: "insideTopLeft",
                  fill: "#34d399",
                }}
                stroke="#34d399"
                strokeDasharray="4 4"
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis
                dataKey="price"
                tickFormatter={(value) => `₹${value / 1000}k`}
                domain={["dataMin - 1000", "dataMax + 1000"]}
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="price" name="Price on Date" fill="#3b82f6" />
              {/* Reference line for current price */}
              <ReferenceLine
                y={currentPrice}
                label={{ value: "Current", position: "top", fill: "#34d399" }}
                stroke="#34d399"
                strokeDasharray="4 4"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
