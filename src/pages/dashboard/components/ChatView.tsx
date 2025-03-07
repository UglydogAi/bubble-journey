
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export function ChatView() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
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
  ]);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message to chat
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "user",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory([...chatHistory, newUserMessage]);
      setMessage("");
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: "I'm processing your message about \"" + message + "\". How can I assist you further?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleCallClick = () => {
    navigate('/call');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pt-1 md:pt-6 flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
          <CardDescription>Your conversations with UGLYDOG AI</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pb-4">
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
      
      {/* Chat input bar - redesigned to match the provided image */}
      <div className="w-full px-4 py-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message UGLYDOG..."
              className="w-full px-6 py-4 rounded-full border border-border/40 bg-background/60 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-sm"
            />
          </div>
          <Button type="submit" size="icon" className="rounded-full bg-white/95 hover:bg-white text-black h-12 w-12 flex items-center justify-center">
            <Send className="h-5 w-5" />
          </Button>
          <Button 
            type="button" 
            onClick={handleCallClick}
            size="icon" 
            className="rounded-full bg-black/90 hover:bg-black h-12 w-12 flex items-center justify-center"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
