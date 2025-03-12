
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useConversation } from "./hooks/useConversation";
import CallAvatar from "./components/CallAvatar";
import CallHeader from "./components/CallHeader";
import CallControls from "./components/CallControls";
import ChatBar from "./components/ChatBar";
import { toast } from "sonner";

export default function CallPage() {
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const widgetRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const {
    isProcessing,
    waveProgress,
    message,
    setMessage,
    conversationHistory,
    sendMessageToAI,
    pauseCurrentAudio
  } = useConversation();

  useEffect(() => {
    // Show a notification that the connection has been established
    toast.success("Connected to UGLYDOG AI Assistant");
  }, []);

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

        {/* Test Message Button - Remove after testing */}
        <div className="mt-4 mb-6 w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to UGLYDOG..."
            className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
          />
          <button
            onClick={() => {
              if (message.trim()) {
                sendMessageToAI(message);
                setMessage("");
              }
            }}
            className="mt-2 w-full py-2 bg-orange-600 hover:bg-orange-700 rounded text-white font-medium transition-colors"
          >
            Send Message
          </button>
        </div>

        {showControls && (
          <CallControls 
            muted={muted} 
            setMuted={setMuted} 
            onEndCall={handleEndCall} 
          />
        )}
      </motion.div>

      {/* Conversation History Display */}
      <div className="w-full max-w-md mt-6 px-4 overflow-y-auto max-h-60 bg-black/30 backdrop-blur-md rounded-lg">
        {conversationHistory.map((item, index) => (
          <div key={index} className={`my-2 p-2 rounded ${item.role === 'user' ? 'bg-blue-900/40 ml-8' : 'bg-orange-900/40 mr-8'}`}>
            <p className="text-sm text-gray-300">{item.role === 'user' ? 'You' : 'UGLYDOG'}</p>
            <p>{item.content}</p>
          </div>
        ))}
      </div>

      {/* Voice-only Status Bar */}
      <ChatBar 
        isProcessing={isProcessing}
        waveProgress={waveProgress}
      />
    </div>
  );
}
