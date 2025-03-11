
import React from "react";
import { motion } from "framer-motion";

interface CallHeaderProps {
  isProcessing: boolean;
}

const CallHeader: React.FC<CallHeaderProps> = ({ isProcessing }) => {
  return (
    <>
      <motion.h2 
        className="text-2xl sm:text-3xl font-bold mt-4 mb-2"
        animate={{ 
          opacity: [0.5, 1, 0.5],
          textShadow: [
            `0 0 7px ${isProcessing ? '#F97316' : '#D946EF'}`,
            `0 0 10px ${isProcessing ? '#F97316' : '#D946EF'}`,
            `0 0 7px ${isProcessing ? '#F97316' : '#D946EF'}`
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity 
        }}
      >
        UGLYDOG
      </motion.h2>

      <p className="text-base sm:text-lg text-gray-300 mb-2">
        {isProcessing ? (
          <span className="text-orange-200">Speaking...</span>
        ) : (
          <span className="text-purple-200">Listening...</span>
        )}
      </p>
      
      <p className="text-xs text-gray-400 mb-6 sm:mb-10">
        Secure Proxy Connection
      </p>
    </>
  );
};

export default CallHeader;
