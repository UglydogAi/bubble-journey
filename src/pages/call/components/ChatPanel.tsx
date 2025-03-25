
import React, { useState } from "react";
import { Send } from "lucide-react";
import WizLogo from "@/components/WizLogo";

const SAMPLE_MESSAGES = [
  {
    id: 1,
    sender: "wiz",
    text: "Hello! I'm WIZ, your AI assistant. How can I help you today?"
  },
  {
    id: 2,
    sender: "user",
    text: "Hey WIZ! Can you tell me about yourself?"
  },
  {
    id: 3,
    sender: "wiz",
    text: "I'm an AI assistant designed to help with a wide range of tasks. I can answer questions, provide information, and assist with various digital needs. What would you like to know or what can I help you with today?"
  }
];

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [input, setInput] = useState("");
  
  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input
    };
    
    setMessages([...messages, newUserMessage]);
    setInput("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-white">Chat</h2>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "wiz" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                <WizLogo className="w-4 h-4 text-white" />
              </div>
            )}
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-[#1E293B] text-white rounded-tl-none"
              }`}
            >
              {message.sender === "wiz" && (
                <div className="text-purple-500 font-bold mb-1">WIZ</div>
              )}
              {message.sender === "user" && (
                <div className="text-blue-300 font-bold mb-1">You</div>
              )}
              <p>{message.text}</p>
            </div>
            {message.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center ml-2 overflow-hidden">
                <div className="w-4 h-4 text-gray-300">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-[#1E293B] text-white px-4 py-3 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === ""}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Quick suggestion */}
        <div className="mt-3">
          <button className="bg-[#1E293B] hover:bg-[#2D3748] text-white px-4 py-2 rounded-full text-sm">
            Z, can you help me lose weight?
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
