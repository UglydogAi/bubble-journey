
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useConversation } from "./hooks/useConversation";
import { toast } from "sonner";
import CallAvatar from "./components/CallAvatar";
import CallHeader from "./components/CallHeader";
import CallControls from "./components/CallControls";
import ChatBar from "./components/ChatBar";

export default function CallPage() {
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [recognitionActive, setRecognitionActive] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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
    const startSpeechRecognition = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      try {
        console.log("Starting speech recognition...");
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          console.log("Speech recognition started");
          setRecognitionActive(true);
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log("Voice input detected:", transcript);
          if (transcript.trim()) {
            sendMessageToAI(transcript);
          }
        };
        
        recognition.onend = () => {
          console.log("Speech recognition ended");
          setRecognitionActive(false);
          
          // Restart recognition if not processing (speaking)
          if (!isProcessing && initialGreetingPlayed) {
            console.log("Restarting speech recognition");
            setTimeout(() => {
              startSpeechRecognition();
            }, 500);
          }
        };
        
        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setRecognitionActive(false);
          
          // Attempt to restart on error
          if (!isProcessing && initialGreetingPlayed) {
            console.log("Attempting to restart speech recognition after error");
            setTimeout(() => {
              startSpeechRecognition();
            }, 1000);
          }
        };
        
        recognition.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        toast.error("Failed to start speech recognition. Please check your browser permissions.");
      }
    };
    
    // Start continuous voice recognition when initial greeting is done
    if (initialGreetingPlayed && !isProcessing && !muted) {
      startSpeechRecognition();
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [initialGreetingPlayed, isProcessing, sendMessageToAI, muted]);

  const handleEndCall = () => {
    setShowControls(false);
    pauseCurrentAudio();
    
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleMuteToggle = (newMutedState: boolean) => {
    setMuted(newMutedState);
    
    if (newMutedState) {
      // Stop recognition if muted
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      toast.info("Microphone muted");
    } else {
      // Restart recognition if unmuted
      if (initialGreetingPlayed && !isProcessing) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (transcript.trim()) {
            sendMessageToAI(transcript);
          }
        };
        
        recognition.onend = () => {
          if (!isProcessing && !muted) {
            setTimeout(() => {
              if (!muted && recognitionRef.current) {
                recognitionRef.current.start();
              }
            }, 500);
          }
        };
        
        recognition.start();
      }
      toast.info("Microphone active");
    }
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

      {!initialGreetingPlayed && (
        <div className="absolute top-16 left-0 right-0 flex justify-center">
          <div className="bg-blue-500/40 text-white text-xs px-3 py-1.5 rounded-full animate-pulse">
            Initializing UGLYDOG...
          </div>
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
            setMuted={handleMuteToggle} 
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
