
import React from "react";
import { motion } from "framer-motion";
import WizMascot from "@/components/WizMascot";

interface CallHeaderProps {
  isProcessing: boolean;
}

const CallHeader: React.FC<CallHeaderProps> = ({ isProcessing }) => {
  return (
    <>
      <WizMascot 
        isProcessing={isProcessing} 
        className="mb-2"
      />
      
      <motion.h2 
        className="text-3xl sm:text-4xl font-bold mb-3 font-sans tracking-wider text-yellow-400"
        animate={{ 
          opacity: [0.8, 1, 0.8],
          textShadow: [
            `0 0 8px ${isProcessing ? 'rgba(59,130,246,0.7)' : 'rgba(255,215,0,0.7)'}`,
            `0 0 12px ${isProcessing ? 'rgba(59,130,246,0.9)' : 'rgba(255,215,0,0.9)'}`,
            `0 0 8px ${isProcessing ? 'rgba(59,130,246,0.7)' : 'rgba(255,215,0,0.7)'}`
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity 
        }}
      >
        WIZ
      </motion.h2>

      <p className="text-base sm:text-lg text-gray-300 mb-1 font-sans">
        {isProcessing ? (
          <span className="text-blue-200">Speaking...</span>
        ) : (
          <span className="text-purple-200">Listening...</span>
        )}
      </p>
      
      <p className="text-xs text-green-300/70 font-light italic mb-6 sm:mb-8 font-sans">
        SECURE PROXY CONNECTION
      </p>
    </>
  );
};

export default CallHeader;
