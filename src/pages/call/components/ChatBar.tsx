
import React from "react";
import { motion } from "framer-motion";

interface ChatBarProps {
  isProcessing: boolean;
  waveProgress: number;
}

const ChatBar: React.FC<ChatBarProps> = ({ isProcessing, waveProgress }) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-20 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-4 flex items-center justify-center">
        <div className="text-sm text-white">
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <span>WIZ is thinking...</span>
              <div className="flex space-x-1 h-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-[#FFD700]"
                    animate={{
                      height: [4, 8, 4],
                    }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    style={{
                      boxShadow: "0 0 5px #FFD700"
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Listening... speak to WIZ</span>
              
              {/* Voice wave visualization */}
              <div className="flex items-center space-x-[2px] h-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-[#FFD700]"
                    animate={{
                      height: [3, 10, 3],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      repeatType: "reverse"
                    }}
                    style={{
                      boxShadow: "0 0 5px #FFD700"
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* "Powered by" text */}
      <div className="absolute right-4 bottom-[-20px] text-xs text-white/50">
        Powered by xAI
      </div>
    </div>
  );
};

export default ChatBar;
