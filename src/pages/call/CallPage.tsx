import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function CallPage() {
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const handleEndCall = () => {
    setShowControls(false);
    if (currentAudio) {
      currentAudio.pause();
    }
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const playResponse = async (text: string) => {
    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) {
        console.error('Error from edge function:', error);
        toast.error('Failed to generate speech. Please try again.');
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

  useEffect(() => {
    playResponse("Hello! I'm your AI assistant. I'm now using Play.ht to speak. Can you hear me clearly?");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0c1015] text-white px-4 relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-20" />

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
    </div>
  );
}
