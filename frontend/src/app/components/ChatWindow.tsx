"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  hasCSV: boolean;
  csvData?: Record<string, unknown>[];
}

export default function ChatWindow({ isOpen, onClose, hasCSV, csvData = [] }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    };

    // Small delay to ensure DOM is updated
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !hasCSV) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call your existing LangGraph workflow
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
      const response = await fetch(`${backendUrl}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputValue,
          csv: csvData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Create a comprehensive response from all the AI agents
      let aiResponse = "";

      if (result.reasoning) {
        aiResponse += `**Analysis:** ${result.reasoning}\n\n`;
      }

      if (result.csv_analysis) {
        aiResponse += `**Data Insights:** ${result.csv_analysis}\n\n`;
      }

      if (result.chart_data) {
        aiResponse += `**Visualization Suggestion:** ${result.chart_data.title || "Chart Generated"}\n`;
        aiResponse += `${result.chart_data.description || ""}\n\n`;
      }

      if (result.validation) {
        aiResponse += `**Validation Notes:** ${result.validation}`;
      }

      // Fallback if no content
      if (!aiResponse.trim()) {
        aiResponse = "I've processed your request. The analysis is complete.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error connecting to the AI service. Please make sure the backend is running on localhost:8000 and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 top-6 bottom-6 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-[9999] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-semibold text-black">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="hover:bg-gray-100 text-gray-600 hover:text-black cursor-pointer"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-white">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {!hasCSV ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <FileText className="h-12 w-12 text-gray-400" />
              <p className="text-gray-600 text-sm">Upload a CSV file first to start chatting with AI</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Send className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-600 text-sm">Ask me anything about your data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      message.role === "user" ? "bg-blue-400 text-white" : "bg-gray-100 text-black"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2.5">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={hasCSV ? "Ask about your data..." : "Upload CSV first..."}
            disabled={!hasCSV || isLoading}
            className="flex-1 bg-white border-gray-200 text-black placeholder-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!hasCSV || !inputValue.trim() || isLoading}
            className="bg-blue-400 text-white hover:bg-gray-800 transition-colors"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
