
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Speaker, HelpCircle } from "lucide-react";
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
        {/* Help button */}
        <div className="absolute bottom-4 left-4 z-30">
          <button className="w-8 h-8 rounded-full bg-gray-800/60 border border-gray-700/50 flex items-center justify-center
                           hover:bg-gray-700/60 transition-colors duration-200 group">
            <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className={`
            backdrop-blur-xl 
            bg-black/40
            border ${isProcessing ? 'border-blue-500/40' : 'border-purple-500/40'}
            shadow-[0_0_15px_${isProcessing ? 'rgba(59,130,246,0.3)' : 'rgba(139,92,246,0.3)'}]
            rounded-2xl 
            overflow-hidden
            transition-all duration-300
            ${isProcessing ? 'ring-1 ring-blue-500/30' : 'ring-1 ring-purple-500/30'}
          `}>
            <div className="p-4 flex items-center justify-center">
              <div className="flex-1 flex justify-center">
                {isProcessing ? (
                  <div className="w-full flex flex-col items-center gap-2">
                    <div className="max-w-xs w-full">
                      <Progress value={waveProgress} className="h-1.5" />
                    </div>
                    <motion.p 
                      className="text-sm text-blue-200 text-center flex items-center gap-2 font-sans"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Speaker className="h-4 w-4 text-blue-400" />
                      WIZ is speaking...
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
                      className="text-sm text-purple-200 text-center font-sans"
                      animate={{ 
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <span>Listening... speak to WIZ</span>
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          
          {/* Powered by xAI text */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-sans">
            Powered by xAI
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBar;
