import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff, Send, AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import ElevenLabsWebSocket from "@/services/elevenlabsWebSocket";

export default function CallPage() {
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [message, setMessage] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const textInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Animation progress for the waveform
  const [waveProgress, setWaveProgress] = useState(0);
  
  // Ref for the ElevenLabs widget
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Ref for the WebSocket connection
  const wsRef = useRef<ElevenLabsWebSocket | null>(null);
  
  // Ref for audio chunks from WebSocket
  const audioChunksRef = useRef<Blob[]>([]);

  // Animate the waveform when processing audio
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setWaveProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  // Setup ElevenLabs widget
  useEffect(() => {
    if (widgetRef.current) {
      // The widget will be created by the script loaded in index.html
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', 'zna9hXvyrwtNwOt5taJ2');
      
      // Clear the ref and append the widget
      widgetRef.current.innerHTML = '';
      widgetRef.current.appendChild(widget);
      
      // Initialize WebSocket service
      wsRef.current = new ElevenLabsWebSocket(
        // On audio chunk received
        (audioChunk) => {
          audioChunksRef.current.push(audioChunk);
        },
        // On complete
        () => {
          setIsProcessing(false);
          playAudioFromChunks();
        },
        // On error
        (error) => {
          console.error('WebSocket error:', error);
          if (retryCount < 2) {
            // Only log error, don't show toast, as we'll try the fallback
            setRetryCount(prev => prev + 1);
          } else {
            toast.error('Error with speech synthesis. Using backup service.');
          }
          setIsProcessing(false);
        }
      );
    }
    
    return () => {
      // Clean up WebSocket on component unmount
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  const playAudioFromChunks = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    try {
      // Create a new Blob from all audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
      
      // Create URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play the audio
      if (currentAudio) {
        currentAudio.pause();
      }
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        // Clear audio chunks for next message
        audioChunksRef.current = [];
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio from chunks:', error);
      toast.error('Failed to play audio');
    }
  };

  const handleEndCall = () => {
    setShowControls(false);
    if (currentAudio) {
      currentAudio.pause();
    }
    
    // Close WebSocket if it's open
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const playResponse = async (text: string) => {
    try {
      setIsProcessing(true);
      
      // Try WebSocket if available
      if (wsRef.current && retryCount < 2) {
        try {
          // Connect if not already connected
          await wsRef.current.connect();
          wsRef.current.synthesizeSpeech(text);
          // Audio chunks will be collected and played when complete
          return;
        } catch (wsError) {
          console.error('WebSocket failed, falling back to edge function:', wsError);
          setRetryCount(prev => prev + 1);
          // Fall through to edge function
        }
      }
      
      // Fallback to Edge Function
      const { data, error } = await supabase.functions.invoke('eleven-labs-tts', {
        body: { text }
      });

      if (error) {
        console.error('Error from edge function:', error);
        toast.error('Failed to generate speech. Please try again.');
        setIsProcessing(false);
        throw error;
      }

      if (data.audioUrl) {
        if (currentAudio) {
          currentAudio.pause();
        }
        
        const audio = new Audio(data.audioUrl);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsProcessing(false);
        };

        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          toast.error('Failed to play audio. Please try again.');
          setIsProcessing(false);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsProcessing(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (message.trim()) {
      // Simulating sending message to AI
      playResponse(`I'm processing your message: "${message}". How can I help you further?`);
      setMessage("");
    }
  };

  const toggleInputMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      // When switching to voice mode, clear any text
      setMessage("");
    } else {
      // When switching to text mode, focus the input
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    // Reset retry count when component mounts
    setRetryCount(0);
    
    // Small delay before playing initial greeting
    const timer = setTimeout(() => {
      playResponse("Hello! I'm your AI assistant. I'm now using ElevenLabs to speak. Can you hear me clearly?");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 relative">
          <img 
            src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
            alt="UGLYDOG Mascot"
            className="w-full h-full object-cover"
          />
          {isProcessing && (
            <motion.div 
              className="absolute inset-0 bg-purple-500/20"
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity 
              }}
            />
          )}
        </div>

        <motion.h2 
          className="text-2xl sm:text-3xl font-bold mt-4 mb-2"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            textShadow: [
              "0 0 7px #D946EF",
              "0 0 10px #D946EF",
              "0 0 7px #D946EF"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity 
          }}
        >
          UGLYDOG
        </motion.h2>

        <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12">
          {isProcessing ? "Speaking..." : "Listening..."}
        </p>

        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-6 sm:gap-8"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"
              onClick={() => setMuted(!muted)}
            >
              {muted ? (
                <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              ) : (
                <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 border-red-500 hover:bg-red-500/20"
              onClick={handleEndCall}
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Futuristic Chat Bar - Glass-like with neon glow */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 w-full py-4 px-4 sm:px-6 z-20"
        >
          <div className="max-w-2xl mx-auto">
            <div className={`
              backdrop-blur-xl 
              bg-black/30
              border border-primary/10
              shadow-[0_0_15px_rgba(173,109,244,0.15)]
              rounded-2xl 
              overflow-hidden
              transition-all duration-300
              ${isVoiceMode && isProcessing ? 'ring-1 ring-primary/40' : ''}
            `}>
              {isVoiceMode ? (
                <div className="p-4 flex items-center">
                  <div className="flex-1 flex justify-center">
                    {isProcessing ? (
                      <div className="w-full max-w-xs">
                        <Progress value={waveProgress} className="h-2" />
                      </div>
                    ) : (
                      <motion.p 
                        className="text-sm text-gray-300 text-center"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Tap to speak or switch to text mode
                      </motion.p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={toggleInputMode} 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full w-10 h-10 bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
                    >
                      <Send className="h-4 w-4 text-gray-300" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`
                        rounded-full w-10 h-10 
                        ${isProcessing ? 'bg-primary/20 border-primary/30' : 'bg-gray-800/50 border-gray-700/50'} 
                        hover:bg-gray-700/50
                      `}
                    >
                      <AudioWaveform className={`h-4 w-4 ${isProcessing ? 'text-primary/90' : 'text-gray-300'}`} />
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex items-center p-2">
                  <div className="flex-1 relative">
                    <input
                      ref={textInputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Message UGLYDOG..."
                      className="w-full px-4 py-3 rounded-xl bg-transparent border-none focus:outline-none text-white placeholder:text-gray-500 text-sm"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {message.trim() ? (
                      <Button 
                        type="submit" 
                        size="icon" 
                        className="rounded-full w-10 h-10 bg-primary/80 hover:bg-primary border-none flex items-center justify-center"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={toggleInputMode} 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full w-10 h-10 bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
                      >
                        <AudioWaveform className="h-4 w-4 text-gray-300" />
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

