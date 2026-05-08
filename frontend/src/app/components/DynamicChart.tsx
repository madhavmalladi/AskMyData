import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  type PieLabelRenderProps,
} from "recharts";
import { ChartData } from "../lib/langgraph_workflow";

interface DynamicChartProps {
  data: ChartData[];
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#ffb347",
  "#87ceeb",
];

export default function DynamicChart({ data }: DynamicChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <p className="text-gray-500 text-sm">No chart data available</p>
          <p className="text-gray-400 text-xs">
            Generate a dashboard to see visualizations
          </p>
        </div>
      </div>
    );
  }

  const chartData = data[0]; // Take the first chart for now

  // Ensure we have valid data
  if (!chartData.data || chartData.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">⚠️</div>
          <p className="text-gray-500 text-sm">Invalid chart data</p>
          <p className="text-gray-400 text-xs">
            Please try regenerating the dashboard
          </p>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData.data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartData.chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Bar
              dataKey="value"
              fill={COLORS[0]}
              radius={[4, 4, 0, 0]}
              name={chartData.yAxis || "Value"}
            />
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={COLORS[0]}
              strokeWidth={3}
              dot={{ fill: COLORS[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: COLORS[0], strokeWidth: 2 }}
              name={chartData.yAxis || "Value"}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLORS[0]}
              fill={COLORS[0]}
              fillOpacity={0.3}
              strokeWidth={2}
              name={chartData.yAxis || "Value"}
            />
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart width={400} height={300}>
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: PieLabelRenderProps) =>
                `${name ?? ""} (${((percent ?? 0) * 100).toFixed(1)}%)`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis
              dataKey="value"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#e0e0e0" }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Scatter
              dataKey="value"
              fill={COLORS[0]}
              name={chartData.yAxis || "Value"}
            />
          </ScatterChart>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-center">
              <div className="text-yellow-600 text-lg mb-2">⚠️</div>
              <p className="text-yellow-700 text-sm font-medium">
                Unsupported Chart Type
              </p>
              <p className="text-yellow-600 text-xs">
                Chart type &quot;{chartData.chartType}&quot; is not supported
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {chartData.title || "Data Visualization"}
        </h3>
        {chartData.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {chartData.description}
          </p>
        )}
        {(chartData.xAxis || chartData.yAxis) && (
          <div className="mt-3 flex gap-4 text-xs text-gray-500">
            {chartData.xAxis && (
              <span>
                <strong>X-Axis:</strong> {chartData.xAxis}
              </span>
            )}
            {chartData.yAxis && (
              <span>
                <strong>Y-Axis:</strong> {chartData.yAxis}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="w-full h-96 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            Chart Type:{" "}
            {chartData.chartType.charAt(0).toUpperCase() +
              chartData.chartType.slice(1)}
          </span>
          <span>{chartData.data.length} data points</span>
        </div>
      </div>
    </div>
  );
}
