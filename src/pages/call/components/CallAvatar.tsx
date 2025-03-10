
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
      {isProcessing && (
        <motion.div 
          className="absolute inset-0 bg-purple-500/20"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity 
          }}
        />
      )}
    </div>
  );
};

export default CallAvatar;
