import React from "react";
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import DynamicChart from "./DynamicChart";
import ChatWindow from "./ChatWindow";
import { Button } from "./ui/button";
import { runLangGraphWorkflow, ChartData } from "../lib/langgraph_workflow";

interface DashboardProps {
  uploadedFile?: File | null;
  aiDirections?: string;
  parsedCSVData?: Record<string, unknown>[];
}

export default function Dashboard({
  uploadedFile,
  aiDirections,
  parsedCSVData = [],
}: DashboardProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleSubmit = async ({ text, csv }: { text: string; csv: Record<string, unknown>[] }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await runLangGraphWorkflow({ text, csv });
      setChartData(result.chart_data ? [result.chart_data] : []);
      setValidationIssues(result.validation ? [result.validation] : []);
    } catch (err) {
      setError("Failed to generate dashboard. Please try again.");
      console.error("Dashboard generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate dashboard when CSV data is available
  useEffect(() => {
    if (
      parsedCSVData &&
      parsedCSVData.length > 0 &&
      !loading &&
      chartData.length === 0
    ) {
      console.log("Auto-generating dashboard with CSV data:", parsedCSVData);
      handleSubmit({
        text: aiDirections || "Generate dashboard from uploaded CSV data",
        csv: parsedCSVData,
      });
    }
  }, [parsedCSVData, aiDirections]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white relative">
      {/* Main Content Area */}
      <div className="pr-80 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Data Dashboard
            </h1>
            <p className="text-gray-600">
              Your AI-generated insights and visualizations
            </p>
          </div>

          {/* Back to Upload Button */}
          <div className="text-center">
            <Button
              onClick={() => window.location.reload()}
              className="hover:opacity-90 transition-opacity"
              style={{
                background:
                  "linear-gradient(135deg, hsl(243 80% 62%), hsl(243 80% 75%))",
                boxShadow: "0 4px 12px hsl(243 80% 62% / 0.12)",
                color: "white",
              }}
            >
              ← Back to Upload
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your dashboard...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Chart Display */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Generated Dashboard
              </h2>
              <DynamicChart data={chartData} />
            </div>
          )}

          {/* Validation Issues */}
          {validationIssues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Validation Notes:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationIssues.map((issue, i) => (
                  <li key={i} className="text-yellow-700">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Placeholder content when no data */}
          {!loading && !error && chartData.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Dashboard Ready
              </h3>
              <p className="text-gray-500">
                Your dashboard will appear here once data is processed.
              </p>

              {/* Debug Info */}
              <div className="text-xs text-gray-400 mt-4 p-3 bg-gray-50 rounded">
                <p>Debug Info:</p>
                <p>CSV Data Length: {parsedCSVData?.length || 0}</p>
                <p>Has File: {uploadedFile ? "Yes" : "No"}</p>
                <p>AI Directions: {aiDirections || "None"}</p>
              </div>

              {/* Manual Trigger Button */}
              {parsedCSVData && parsedCSVData.length > 0 && (
                <Button
                  onClick={() =>
                    handleSubmit({
                      text:
                        aiDirections ||
                        "Generate dashboard from uploaded CSV data",
                      csv: parsedCSVData,
                    })
                  }
                  className="mt-4"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(243 80% 62%), hsl(243 80% 75%))",
                    color: "white",
                  }}
                >
                  Generate Dashboard Manually
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating chat button when chat is closed */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-6 top-6 hover:opacity-90 transition-opacity z-40 bg-black text-white hover:bg-gray-800"
          size="lg"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Open Chat
        </Button>
      )}

      {/* Floating Chat Window - Right Side */}
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        hasCSV={!!uploadedFile}
        csvData={parsedCSVData}
      />
    </div>
  );
}
