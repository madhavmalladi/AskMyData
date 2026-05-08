"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import FileUploader from "./components/FileUploader";
import Dashboard from "./components/Dashboard";
import Papa from "papaparse";

export default function Page() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [aiDirections, setAiDirections] = useState("");
  const [parsedCSVData, setParsedCSVData] = useState<Record<string, unknown>[]>([]);
  const [CSVError, setCSVerror] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setCSVerror(null);

    try {
      const text = await file.text();
      const parsedData = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        dynamicTyping: true,
      });

      if (parsedData.errors.length > 0) {
        console.warn("CSV warnings: ", parsedData.errors);
      }

      setParsedCSVData(parsedData.data as Record<string, unknown>[]);
      console.log("Parsed CSV data:", parsedData.data);
      console.log("CSV columns:", Object.keys(parsedData.data[0] || {}));
    } catch (error) {
      console.error("Error: ", error);
      setCSVerror("Failed to parse CSV file. Please check the file format");
      setParsedCSVData([]);
    }
  };

  // Show Dashboard if user wants to see it
  if (showDashboard) {
    return (
      <Dashboard
        uploadedFile={uploadedFile}
        aiDirections={aiDirections}
        parsedCSVData={parsedCSVData}
      />
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(135deg, hsl(220 100% 97%) 0%, hsl(243 80% 62% / 0.15) 50%, hsl(189 94% 43% / 0.1) 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: "hsl(243 80% 62% / 0.1)" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "hsl(189 94% 43% / 0.1)" }}
        />
      </div>

      {/* Images section */}
      <div className="relative z-10 flex items-center justify-center pt-20 -mb-23">
        <div className="flex items-center gap-8">
          <Image
            src="/csv_image.png"
            alt="CSV Data"
            width={128}
            height={128}
            className="object-contain"
          />
          <ArrowRight
            className="w-8 h-8"
            style={{ color: "hsl(243 80% 62%)" }}
          />
          <Image
            src="/data_visualization.png"
            alt="Data Visualization"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
        <FileUploader
          onFileSelect={handleFileSelect}
          hasFile={!!uploadedFile}
          onGenerateDashboard={() => setShowDashboard(true)}
          aiDirections={aiDirections}
          onAiDirectionsChange={setAiDirections}
        />

        {/* Error display */}
        {CSVError && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {CSVError}
          </div>
        )}
      </div>
    </div>
  );
}
