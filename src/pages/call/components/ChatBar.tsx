
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Speaker } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChatBarProps {
  isProcessing: boolean;
  waveProgress: number;
}

const ChatBar: React.FC<ChatBarProps> = ({
  isProcessing,
  waveProgress,
}) => {
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
                  <motion.p 
                    className="text-sm text-purple-200 text-center flex items-center gap-2"
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                      scale: [1, 1.03, 1]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    <Mic className="h-4 w-4 text-primary/70" />
                    <span>Listening to you... speak to UGLYDOG</span>
                  </motion.p>
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
