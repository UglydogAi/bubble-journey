
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import XLogo from "@/components/XLogo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0A0C14] text-white px-4 relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-20" />
      
      {/* Magical particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FFD700]/30"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, -(Math.random() * 80 + 20)],
              opacity: [0, 0.6, 0],
              scale: [1, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Social Links in top right */}
      <div className="absolute top-4 right-5 md:top-6 md:right-7 flex items-center gap-4 z-20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a 
                href="https://x.com/wizai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-7 h-7 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-full
                  hover:bg-black/40 hover:text-[#FFD700] hover:scale-105 transition-all duration-200
                  group active:scale-95"
                aria-label="WIZ Twitter"
              >
                <XLogo className="w-3.5 h-3.5 text-white/90 group-hover:text-[#FFD700]" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="flex items-center gap-1 text-xs">
                Twitter/X
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
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
                  className="absolute rounded-full bg-[#FFD700]/10"
                  initial={{ width: 0, height: 0, opacity: 0.8 }}
                  animate={{ 
                    width: [0, 200], 
                    height: [0, 200], 
                    opacity: [0.5, 0],
                    borderWidth: [2, 1],
                    borderColor: ["#FFD700", "#FFD70000"]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.5,
                    delay: i * 0.6,
                    ease: "easeOut"
                  }}
                  style={{ 
                    borderStyle: "solid",
                    boxShadow: "0 0 15px #FFD700" 
                  }}
                />
              ))}
              
              {/* Text during transition */}
              <motion.p
                className="absolute top-[-40px] text-white font-bold text-center w-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                No turning back. Your superhuman journey begins now.
              </motion.p>
              
              {/* Audio waveform visualization */}
              <div className="h-6 flex items-center space-x-1">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 rounded-full bg-[#FFD700]"
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
                      boxShadow: "0 0 8px #FFD700, 0 0 12px #FFD700"
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
            className="flex flex-col items-center justify-center relative z-10 w-full max-w-lg px-4 sm:px-0"
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
              <Phone size={80} className="text-[#FFD700] animate-pulse filter drop-shadow-[0_0_10px_#FFD700]" />
            </motion.div>
            
            <motion.h2 
              className="text-2xl sm:text-4xl font-bold mt-8 mb-4 text-center text-[#FFD700]"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                textShadow: [
                  "0 0 7px #FFD700",
                  "0 0 10px #FFD700",
                  "0 0 7px #FFD700"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            >
              INCOMING CALL: WIZ
            </motion.h2>
            
            <motion.h3
              className="text-xl sm:text-2xl font-bold mb-6 text-white tracking-wide"
              animate={{
                textShadow: ["0 0 0px rgba(255,215,0,0.2)", "0 0 3px rgba(255,215,0,0.6)", "0 0 0px rgba(255,215,0,0.2)"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >
              A Call You Can't Unanswer.
            </motion.h3>
            
            <p className="text-base sm:text-xl text-white text-center max-w-2xl mt-4 leading-relaxed px-4">
              Most people ignore the call. They settle. They hesitate. They wait for the perfect moment that never comes. 
              But you're here. You found this message for a reason. If you answer, there is no going back. 
              Are you ready to unlock the superhuman in you?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-12 w-full sm:w-auto">
              <Button 
                variant="outline"
                className="text-white hover:text-white/80 border-black hover:border-white/20 transition-all order-2 sm:order-1"
                onClick={() => setDeclining(true)}
              >
                Decline Call
              </Button>
              <Button 
                className="px-6 py-4 sm:px-8 sm:py-6 bg-transparent hover:bg-[#FFD700]/10 text-white 
                  text-lg font-bold rounded-lg shadow-lg transition-all border-2 border-[#FFD700] order-1 sm:order-2
                  hover:shadow-[0_0_10px_rgba(255,215,0,0.5)]"
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
            className="text-xl sm:text-2xl text-white/80 text-center px-4 italic font-light"
          >
            "Go back to mediocrity."
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
