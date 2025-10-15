"use client";

import { useState } from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "./components/ui/button";
import ChatWindow from "./components/ChatWindow";
import FileUploader from "./components/FileUploader";

export default function Page() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background:
          "linear-gradient(135deg, hsl(240 20% 99%) 0%, hsl(243 80% 62% / 0.05) 50%, hsl(189 94% 43% / 0.05) 100%)",
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
          <img
            src="/csv_image.png"
            alt="CSV Data"
            className="w-32 h-32 object-contain"
          />
          <ArrowRight
            className="w-8 h-8"
            style={{ color: "hsl(243 80% 62%)" }}
          />
          <img
            src="/data_visualization.png"
            alt="Data Visualization"
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
        <FileUploader
          onFileSelect={handleFileSelect}
          hasFile={!!uploadedFile}
        />
      </div>

      {/* Floating chat button */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-6 top-6 hover:opacity-90 transition-opacity z-40"
          style={{
            background:
              "linear-gradient(135deg, hsl(189 94% 43%), hsl(189 94% 60%))",
            boxShadow: "0 8px 24px hsl(243 80% 62% / 0.12)",
          }}
          size="lg"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Open Chat
        </Button>
      )}

      {/* Chat window */}
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        hasCSV={!!uploadedFile}
      />
    </div>
  );
}
