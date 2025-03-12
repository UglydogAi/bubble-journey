
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useConversation } from "./hooks/useConversation";
import CallAvatar from "./components/CallAvatar";
import CallHeader from "./components/CallHeader";
import CallControls from "./components/CallControls";
import ChatBar from "./components/ChatBar";

export default function CallPage() {
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const {
    isProcessing,
    waveProgress,
    pauseCurrentAudio
  } = useConversation();

  const handleEndCall = () => {
    setShowControls(false);
    pauseCurrentAudio();
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0c1015] text-white px-4 relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-20" />

      {/* ElevenLabs Widget Container */}
      <div 
        ref={widgetRef} 
        className="absolute inset-0 z-0 opacity-0 pointer-events-none"
      ></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center relative z-10 w-full max-w-md px-4"
      >
        {/* UGLYDOG Profile Section */}
        <CallAvatar isProcessing={isProcessing} />
        <CallHeader isProcessing={isProcessing} />

        {showControls && (
          <CallControls 
            muted={muted} 
            setMuted={setMuted} 
            onEndCall={handleEndCall} 
          />
        )}
      </motion.div>

      {/* Voice-only Status Bar */}
      <ChatBar 
        isProcessing={isProcessing}
        waveProgress={waveProgress}
      />
    </div>
  );
}
