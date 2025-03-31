
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WizLogo from "@/components/WizLogo";
import { XCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import JotformEmbedHandler from "@/components/JotformEmbedHandler";

export default function CallPage() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  
  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleEndCall = () => {
    // Redirect to dashboard
    navigate('/dashboard');
  };
  
  return (
    <div className="relative flex flex-col h-screen w-full bg-[#0C121D] overflow-hidden">
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
      
      {/* Main content area with WIZ AI Agent iframe */}
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
        
        {/* WIZ AI Voice Agent iframe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <iframe 
            id="JotFormIFrame-0195e880c2ea769390c02b8ff81559532b37" 
            title="WIZ: Life Coach"
            onLoad={() => window.parent.scrollTo(0,0)} 
            allowTransparency={true}
            allow="geolocation; microphone; camera; fullscreen"
            src="https://agent.jotform.com/0195e880c2ea769390c02b8ff81559532b37/voice?embedMode=iframe&background=1&shadow=1"
            frameBorder="0" 
            style={{
              minWidth: "100%",
              maxWidth: "100%",
              height: "calc(100vh - 88px)",
              border: "none",
              width: "100%"
            }}
            scrolling="no"
          />
        </div>
        
        {/* Add the JotForm embed handler */}
        <JotformEmbedHandler formId="0195e880c2ea769390c02b8ff81559532b37" />
      </div>
    </div>
  );
}
