"use client";

import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  hasFile: boolean;
  onGenerateDashboard?: () => void;
  aiDirections: string;
  onAiDirectionsChange: (directions: string) => void;
}

export default function FileUploader({
  onFileSelect,
  hasFile,
  onGenerateDashboard,
  aiDirections,
  onAiDirectionsChange,
}: FileUploadAreaProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const topText = "AI-powered analysis for your CSV data.";
  const secondaryText = "Upload a CSV file to get started";

  useEffect(() => {
    let index = 0;

    const timer = setInterval(() => {
      if (currentLine === 0) {
        // Typing first line
        if (index < topText.length) {
          setDisplayedText(topText.slice(0, index + 1));
          index++;
        } else {
          // First line done, wait a bit then move to second line
          setTimeout(() => {
            setCurrentLine(1);
            setDisplayedText("");
            index = 0;
          }, 1000);
        }
      } else if (currentLine === 1) {
        // Typing second line
        if (index < secondaryText.length) {
          setDisplayedText(secondaryText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentLine]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-2">
        <h1
          className="text-5xl font-bold py-2"
          style={{
            background:
              "linear-gradient(135deg, hsl(243 80% 62%), hsl(189 94% 43%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          AskMyData
        </h1>
        <div className="text-lg min-h-[3rem] flex flex-col items-center">
          <p className="min-h-[1.5rem]" style={{ color: "hsl(243 80% 62%)" }}>
            {currentLine === 0 ? displayedText : topText}
            {currentLine === 0 && (
              <span
                style={{
                  animation: "blink 1s infinite",
                }}
              >
                |
              </span>
            )}
          </p>
          <p className="min-h-[1.5rem]" style={{ color: "hsl(243 80% 62%)" }}>
            {currentLine === 1 ? displayedText : ""}
            {currentLine === 1 && (
              <span
                style={{
                  animation: "blink 1s infinite",
                }}
              >
                |
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="relative">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        <Button
          variant="default"
          size="lg"
          className="hover:opacity-90 transition-opacity text-lg px-8 py-6"
          style={{
            background:
              "linear-gradient(135deg, hsl(243 80% 62%), hsl(243 80% 75%))",
            boxShadow: "0 8px 24px hsl(243 80% 62% / 0.12)",
            color: "white",
          }}
          asChild
        >
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center gap-3"
          >
            <Upload className="h-6 w-6" />
            {hasFile ? "Change CSV File" : "Upload CSV File"}
          </label>
        </Button>
      </div>
      {hasFile && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <div
            className="text-sm font-medium animate-in fade-in duration-300"
            style={{ color: "hsl(189 94% 43%)" }}
          >
            ✓ CSV file uploaded successfully
          </div>

          <div className="w-full">
            <label
              htmlFor="ai-directions"
              className="block text-sm font-medium mb-2"
              style={{ color: "hsl(243 80% 62%)" }}
            >
              AI Directions (Optional)
            </label>
            <Input
              id="ai-directions"
              type="text"
              placeholder="e.g., Focus on sales trends, create pie charts for categories..."
              value={aiDirections}
              onChange={(e) => onAiDirectionsChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Give the AI specific instructions for your dashboard
            </p>
          </div>

          <Button
            onClick={() => {
              if (onGenerateDashboard) {
                onGenerateDashboard();
              }
            }}
            className="hover:opacity-90 transition-opacity text-sm px-6 py-3"
            style={{
              background:
                "linear-gradient(135deg, hsl(243 80% 62%), hsl(243 80% 75%))",
              boxShadow: "0 4px 12px hsl(243 80% 62% / 0.12)",
              color: "white",
            }}
            size="sm"
          >
            Generate Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
