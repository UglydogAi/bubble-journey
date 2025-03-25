
import React from "react";
import { motion } from "framer-motion";

interface CallAvatarProps {
  isProcessing?: boolean;
}

const CallAvatar: React.FC<CallAvatarProps> = ({ isProcessing = false }) => {
  return (
    <motion.div
      className="relative w-40 h-40"
      animate={{ 
        y: [0, -8, 0],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      {/* Blue glowing circle */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-blue-500 blur-md"
        animate={{ 
          opacity: [0.4, 0.7, 0.4],
          scale: [0.95, 1, 0.95]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Main circle */}
      <div className="absolute inset-0 rounded-full bg-blue-500 flex items-center justify-center">
        {/* White face circle */}
        <div className="w-4/5 h-4/5 rounded-full bg-white flex items-center justify-center">
          {/* Eyes and nose */}
          <div className="relative w-full h-full">
            {/* Left eye */}
            <motion.div 
              className="absolute w-1/4 h-1/4 rounded-full bg-black"
              style={{ top: '25%', left: '25%' }}
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Right eye */}
            <motion.div 
              className="absolute w-1/4 h-1/4 rounded-full bg-black"
              style={{ top: '25%', right: '25%' }}
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Nose */}
            <div 
              className="absolute w-1/3 h-[15%] rounded-full bg-black"
              style={{ top: '55%', left: '33.5%' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CallAvatar;
