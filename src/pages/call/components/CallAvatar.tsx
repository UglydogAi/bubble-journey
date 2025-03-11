
import React from "react";
import { motion } from "framer-motion";

interface CallAvatarProps {
  isProcessing: boolean;
}

const CallAvatar: React.FC<CallAvatarProps> = ({ isProcessing }) => {
  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 relative">
      <img 
        src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
        alt="UGLYDOG Mascot"
        className="w-full h-full object-cover"
      />
      
      {/* Pulsing background */}
      <motion.div 
        className={`absolute inset-0 ${isProcessing ? 'bg-orange-500/20' : 'bg-purple-500/20'}`}
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          scale: isProcessing ? [1, 1.05, 1] : [0.95, 1, 0.95],
        }}
        transition={{ 
          duration: isProcessing ? 1 : 1.5, 
          repeat: Infinity 
        }}
      />
      
      {/* Active indicator ring */}
      <motion.div 
        className={`absolute -inset-1 rounded-full ${isProcessing ? 'border-2 border-orange-500/30' : 'border border-purple-500/30'}`}
        animate={{ 
          boxShadow: [
            `0 0 5px 0 ${isProcessing ? 'rgba(249,115,22,0.3)' : 'rgba(139,92,246,0.3)'}`,
            `0 0 10px 0 ${isProcessing ? 'rgba(249,115,22,0.5)' : 'rgba(139,92,246,0.5)'}`,
            `0 0 5px 0 ${isProcessing ? 'rgba(249,115,22,0.3)' : 'rgba(139,92,246,0.3)'}`
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity 
        }}
      />
    </div>
  );
};

export default CallAvatar;
