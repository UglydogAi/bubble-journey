
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WizLogo from "@/components/WizLogo";
import CallAvatar from "./components/CallAvatar";
import ChatPanel from "./components/ChatPanel";
import CallControls from "./components/CallControls";
import { XCircle, User, MessageSquare } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default function CallPage() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  
  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleEndCall = () => {
    // Redirect to dashboard instead of home page
    navigate('/dashboard');
  };
  
  return (
    <div className="relative flex flex-col md:flex-row h-screen w-full bg-[#0C121D] overflow-hidden">
      {/* Main call area */}
      <div className="relative flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 z-10">
          {/* WIZ logo and timer */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <WizLogo className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-purple-500 font-bold">WIZ</span>
              <span className="text-gray-400 text-xs">{formatDuration(duration)}</span>
            </div>
          </div>
          
          {/* End call button */}
          <button 
            onClick={handleEndCall}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center transition-all"
          >
            <XCircle className="w-4 h-4 mr-1" />
            End Call
          </button>
        </div>
        
        {/* Main content area with stars background */}
        <div className="relative flex-1 overflow-hidden">
          {/* Stars background */}
          <div className="absolute inset-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
          
          {/* WIZ Avatar */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CallAvatar />
            <motion.h2 
              className="text-4xl font-bold text-purple-500 mt-4"
              animate={{ 
                opacity: [0.8, 1, 0.8],
                textShadow: ["0 0 8px rgba(139,92,246,0.5)", "0 0 12px rgba(139,92,246,0.8)", "0 0 8px rgba(139,92,246,0.5)"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            >
              WIZ
            </motion.h2>
            <p className="text-gray-400 mt-1">Your AI Assistant</p>
          </div>
          
          {/* User video */}
          <div className="absolute bottom-4 right-4 w-32 h-40 bg-[#1E293B] rounded-lg overflow-hidden shadow-lg z-10">
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Call controls */}
        <div className="p-4 flex justify-center z-10">
          <CallControls 
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isVideoOn={isVideoOn}
            setIsVideoOn={setIsVideoOn}
            onEndCall={handleEndCall}
            toggleChat={() => setShowChat(!showChat)}
          />
        </div>
      </div>
      
      {/* Chat panel */}
      {showChat && (
        <div className="w-full md:w-80 h-full bg-[#0F172A] border-l border-gray-800">
          <ChatPanel />
        </div>
      )}
    </div>
  );
}
