
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
    pauseCurrentAudio,
    sendMessageToAI,
    initialGreetingPlayed,
    useBrowserSpeech
  } = useConversation();

  // Handle voice input without displaying text chat
  useEffect(() => {
    // Start continuous voice recognition when initial greeting is done
    if (initialGreetingPlayed && !isProcessing) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          console.log("Voice input detected:", transcript);
          sendMessageToAI(transcript);
        }
      };
      
      recognition.onend = () => {
        // Restart recognition if not processing (speaking)
        if (!isProcessing) {
          recognition.start();
        }
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        // Attempt to restart on error
        if (!isProcessing) {
          setTimeout(() => recognition.start(), 1000);
        }
      };
      
      try {
        recognition.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
      }
      
      return () => {
        recognition.stop();
      };
    }
  }, [initialGreetingPlayed, isProcessing, sendMessageToAI]);

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

      {useBrowserSpeech && (
        <div className="absolute top-4 left-4 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
          Using Browser Speech
        </div>
      )}

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
