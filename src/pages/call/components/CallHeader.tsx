
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
        UGLYDOG
      </motion.h2>

      <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12">
        {isProcessing ? "Speaking..." : "Listening..."}
      </p>
    </>
  );
};

export default CallHeader;
