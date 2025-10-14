import React from "react";
import { useState } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};
export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return <div>ChatWindow</div>;
}
