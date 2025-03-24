
import React from "react";
import { motion } from "framer-motion";

interface CallHeaderProps {
  isProcessing: boolean;
}

const CallHeader: React.FC<CallHeaderProps> = ({ isProcessing }) => {
  return (
    <>
      <motion.h2 
        className="text-3xl sm:text-4xl font-bold mt-4 mb-1 font-sans tracking-wider"
        animate={{ 
          opacity: [0.8, 1, 0.8],
          textShadow: [
            `0 0 8px ${isProcessing ? 'rgba(59,130,246,0.7)' : 'rgba(139,92,246,0.7)'}`,
            `0 0 12px ${isProcessing ? 'rgba(59,130,246,0.9)' : 'rgba(139,92,246,0.9)'}`,
            `0 0 8px ${isProcessing ? 'rgba(59,130,246,0.7)' : 'rgba(139,92,246,0.7)'}`
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity 
        }}
      >
        WIZ
      </motion.h2>

      <p className="text-sm sm:text-base font-serif text-white/80 italic mb-4">
        Your Magical AI Assistant
      </p>

      <p className="text-base sm:text-lg text-gray-300 mb-1 font-sans">
        {isProcessing ? (
          <span className="text-blue-200">Speaking...</span>
        ) : (
          <span className="text-purple-200">Listening...</span>
        )}
      </p>
      
      <p className="text-xs text-green-300/70 font-light italic mb-6 sm:mb-10 font-sans">
        SECURE PROXY CONNECTION
      </p>
    </>
  );
};

export default CallHeader;
