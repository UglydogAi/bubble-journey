import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useConversation } from "./hooks/useConversation";
import { toast } from "sonner";
import { Settings, HelpCircle } from "lucide-react";
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

  useEffect(() => {
    const startSpeechRecognition = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      try {
        console.log("Starting speech recognition...");
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
          throw new Error('Speech recognition not supported in this browser');
        }
        const recognition = new SpeechRecognitionAPI();
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      toast.info("Microphone muted");
    } else {
      if (initialGreetingPlayed && !isProcessing) {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
          throw new Error('Speech recognition not supported in this browser');
        }
        const recognition = new SpeechRecognitionAPI();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgwLCAwLCAwLCAwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] via-transparent to-[#FFD700] opacity-40" />
      
      <div className="absolute top-4 right-4 z-30">
        <button className="w-9 h-9 rounded-full bg-white/60 border border-[#FFD700]/30 flex items-center justify-center
                         hover:bg-white/80 transition-colors duration-200 group">
          <Settings className="w-5 h-5 text-[#FFD700] group-hover:text-[#E5C100]" />
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-30">
        <button className="w-8 h-8 rounded-full bg-white/60 border border-[#FFD700]/30 flex items-center justify-center
                         hover:bg-white/80 transition-colors duration-200 group">
          <HelpCircle className="w-4 h-4 text-[#FFD700] group-hover:text-[#E5C100]" />
        </button>
      </div>

      <div 
        ref={widgetRef} 
        className="absolute inset-0 z-0 opacity-0 pointer-events-none"
      ></div>

      {useBrowserSpeech && (
        <div className="absolute top-4 left-4 bg-[#FFD700]/80 text-black text-xs px-2 py-1 rounded-full">
          Using Browser Speech
        </div>
      )}

      {!initialGreetingPlayed && (
        <div className="absolute top-16 left-0 right-0 flex justify-center">
          <div className="bg-[#FFD700]/40 text-black text-xs px-3 py-1.5 rounded-full animate-pulse">
            Initializing WIZ...
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center relative z-10 w-full max-w-md px-4"
      >
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

      <ChatBar 
        isProcessing={isProcessing}
        waveProgress={waveProgress}
      />
    </div>
  );
}
