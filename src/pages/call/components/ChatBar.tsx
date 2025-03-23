
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Speaker, Waveform } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChatBarProps {
  isProcessing: boolean;
  waveProgress: number;
}

const ChatBar: React.FC<ChatBarProps> = ({
  isProcessing,
  waveProgress,
}) => {
  const [showPulse, setShowPulse] = useState(false);
  
  // Show pulsing indicator when not processing to indicate active listening
  useEffect(() => {
    setShowPulse(!isProcessing);
  }, [isProcessing]);

  return (
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
            border ${isProcessing ? 'border-orange-500/40' : 'border-primary/10'}
            shadow-[0_0_15px_${isProcessing ? 'rgba(249,115,22,0.2)' : 'rgba(173,109,244,0.15)'}]
            rounded-2xl 
            overflow-hidden
            transition-all duration-300
            ${isProcessing ? 'ring-1 ring-orange-500/30' : ''}
          `}>
            <div className="p-4 flex items-center justify-center">
              <div className="flex-1 flex justify-center">
                {isProcessing ? (
                  <div className="w-full flex flex-col items-center gap-2">
                    <div className="max-w-xs w-full">
                      <Progress value={waveProgress} className="h-2" />
                    </div>
                    <motion.p 
                      className="text-sm text-orange-200 text-center flex items-center gap-2"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Speaker className="h-4 w-4 text-orange-400" />
                      UGLYDOG is speaking...
                    </motion.p>
                  </div>
                ) : (
                  <motion.div
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      animate={showPulse ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      } : {}}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="bg-purple-600/20 p-3 rounded-full mb-2"
                    >
                      <Mic className="h-5 w-5 text-purple-400" />
                    </motion.div>
                    <motion.p 
                      className="text-sm text-purple-200 text-center"
                      animate={{ 
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <span>Listening... speak to UGLYDOG</span>
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBar;
