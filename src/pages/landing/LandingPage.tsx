
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Skull, Zap, Brain, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import XLogo from "@/components/XLogo";
import DocsIcon from "@/components/DocsIcon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const categories = [
  {
    id: "ai",
    icon: <Brain size={50} className="text-[#0EA5E9]" />,
    title: "AI-Powered Mastery",
    description: "Unlock your superhuman potential.",
    color: "bg-[#0EA5E9]/10 border-[#0EA5E9]",
  },
  {
    id: "motivation",
    icon: <Zap size={50} className="text-[#D946EF]" />,
    title: "Relentless Drive",
    description: "No excuses. Only results.",
    color: "bg-[#D946EF]/10 border-[#D946EF]",
  },
  {
    id: "guidance",
    icon: <MessageSquare size={50} className="text-[#F97316]" />,
    title: "Brutal Honesty",
    description: "The truth you need to hear.",
    color: "bg-[#F97316]/10 border-[#F97316]",
  },
  {
    id: "transformation",
    icon: <Skull size={50} className="text-[#8B5CF6]" />,
    title: "Total Transformation",
    description: "Emerge stronger. Be superhuman.",
    color: "bg-[#8B5CF6]/10 border-[#8B5CF6]",
  },
];

export default function LandingPage() {
  const [answered, setAnswered] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create an audio element for the connection sound
    audioRef.current = new Audio("/connection-sound.mp3");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleAnswerCall = () => {
    setIsTransitioning(true);
    setAnswered(true);
    
    // Try to play the connection sound
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
    
    // Add a subtle vibration if supported by the browser
    if (navigator.vibrate) {
      navigator.vibrate([15, 30, 15]);
    }
    
    setTimeout(() => {
      navigate('/call');
    }, 1600); // Give enough time for the transition to complete
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1F2C] text-white px-4 relative overflow-hidden">
      {/* Social Icons in top right - REDESIGNED */}
      <div className="absolute top-4 right-5 md:top-6 md:right-7 flex items-center gap-3 z-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a 
                href="https://uglydog-1.gitbook.io/uglydog/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full
                  hover:bg-black/40 hover:text-[#BB86FC] transition-all duration-200 
                  group active:scale-95 border border-white/10"
                aria-label="UGLYDOG Documentation"
              >
                <DocsIcon 
                  className="w-3.5 h-3.5 text-white/90 group-hover:text-[#BB86FC]" 
                />
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="flex items-center gap-1 text-xs">
                Documentation
                <ExternalLink className="w-3 h-3" />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a 
                href="https://x.com/uglydogai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full
                  hover:bg-black/40 hover:text-[#00E0FF] transition-all duration-200
                  group active:scale-95 border border-white/10"
                aria-label="UGLYDOG Twitter"
              >
                <XLogo className="w-3.5 h-3.5 text-white/90 group-hover:text-[#00E0FF]" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="flex items-center gap-1 text-xs">
                Twitter/X
                <ExternalLink className="w-3 h-3" />
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-20" />
      
      {/* Fullscreen transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          >
            {/* Pulsating waveform animation */}
            <motion.div className="relative w-40 h-40 flex items-center justify-center">
              {/* Ripple effects - outer circles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full ${i % 2 === 0 ? 'bg-[#D946EF]/10' : 'bg-[#00E0FF]/10'}`}
                  initial={{ width: 0, height: 0, opacity: 0.8 }}
                  animate={{ 
                    width: [0, 200], 
                    height: [0, 200], 
                    opacity: [0.5, 0],
                    borderWidth: [2, 1],
                    borderColor: i % 2 === 0 ? ["#D946EF", "#D946EF00"] : ["#00E0FF", "#00E0FF00"],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.5,
                    delay: i * 0.6,
                    ease: "easeOut"
                  }}
                  style={{ 
                    borderStyle: "solid",
                    boxShadow: i % 2 === 0 ? "0 0 15px #D946EF" : "0 0 15px #00E0FF" 
                  }}
                />
              ))}
              
              {/* Audio waveform visualization */}
              <div className="h-6 flex items-center space-x-1">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-0.5 rounded-full ${i % 2 === 0 ? 'bg-[#D946EF]' : 'bg-[#00E0FF]'}`}
                    initial={{ height: 10 }}
                    animate={{ 
                      height: [10, 15 + Math.random() * 15, 10],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.8 + (i * 0.1),
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }}
                    style={{ 
                      boxShadow: i % 2 === 0 
                        ? "0 0 8px #D946EF, 0 0 12px #D946EF" 
                        : "0 0 8px #00E0FF, 0 0 12px #00E0FF" 
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {!answered && !declining ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center mb-10 relative z-10 w-full max-w-lg px-4 sm:px-0"
          >
            <motion.div
              animate={{ 
                rotate: [-5, 5, -5],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <Phone size={80} className="text-[#D946EF] animate-pulse filter drop-shadow-[0_0_10px_#D946EF]" />
            </motion.div>
            
            <motion.h2 
              className="text-2xl sm:text-4xl font-bold mt-8 mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] to-[#8B5CF6]"
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
              INCOMING CALL: UGLYDOG
            </motion.h2>
            
            <p className="text-base sm:text-xl text-gray-300 text-center max-w-2xl mt-4 leading-relaxed px-4">
              "Most people ignore the call. They settle. They hesitate. But you're here for a reason. 
              If you answer, there is no going back. Are you ready to unlock the superhuman in you?"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-12 w-full sm:w-auto">
              <Button 
                variant="ghost"
                className="text-gray-400 hover:text-gray-200 transition-all order-2 sm:order-1"
                onClick={() => setDeclining(true)}
              >
                Decline Call
              </Button>
              <Button 
                className="px-6 py-4 sm:px-8 sm:py-6 bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#D946EF] text-white text-lg font-bold rounded-lg shadow-lg transition-all border-none order-1 sm:order-2"
                onClick={handleAnswerCall}
              >
                Answer The Call
              </Button>
            </div>
          </motion.div>
        ) : declining ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xl sm:text-2xl text-gray-400 text-center px-4"
          >
            "Go back to mediocrity."
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
