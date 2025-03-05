
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export function ChatView() {
  // Sample chat history data - in a real app, this would come from an API or state
  const chatHistory: ChatMessage[] = [
    {
      id: "1",
      sender: "user",
      content: "How can I improve my productivity?",
      timestamp: "Today, 10:30 AM"
    },
    {
      id: "2",
      sender: "ai",
      content: "Great question! I recommend starting with time-blocking your day and setting clear priorities each morning. Have you tried the Pomodoro technique?",
      timestamp: "Today, 10:31 AM"
    },
    {
      id: "3",
      sender: "user",
      content: "No, what's the Pomodoro technique?",
      timestamp: "Today, 10:32 AM"
    },
    {
      id: "4",
      sender: "ai",
      content: "The Pomodoro technique involves working in focused 25-minute intervals, then taking a 5-minute break. After 4 cycles, take a longer 15-30 minute break. It helps maintain focus and prevents burnout.",
      timestamp: "Today, 10:33 AM"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pt-1 md:pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
          <CardDescription>Your conversations with UGLYDOG AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {chatHistory.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-muted"
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className="text-xs mt-2 opacity-70">{message.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
