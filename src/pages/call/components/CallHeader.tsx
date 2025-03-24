
import React from "react";
import { motion } from "framer-motion";

interface CallHeaderProps {
  isProcessing: boolean;
}

const CallHeader: React.FC<CallHeaderProps> = ({ isProcessing }) => {
  return (
    <>
      <motion.h2 
        className="text-3xl sm:text-4xl font-bold mt-4 mb-6 font-sans tracking-wider text-[#FFD700]"
        animate={{ 
          opacity: [0.8, 1, 0.8],
          textShadow: [
            "0 0 8px rgba(255,215,0,0.7)",
            "0 0 12px rgba(255,215,0,0.9)",
            "0 0 8px rgba(255,215,0,0.7)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity 
        }}
      >
        WIZ
      </motion.h2>

      <p className="text-base sm:text-lg text-white mb-1 font-sans">
        {isProcessing ? (
          <span className="text-white">Speaking...</span>
        ) : (
          <span className="text-white">Listening...</span>
        )}
      </p>
      
      <p className="text-xs text-black/70 font-light italic mb-6 sm:mb-10 font-sans">
        SECURE PROXY CONNECTION
      </p>
    </>
  );
};

export default CallHeader;
