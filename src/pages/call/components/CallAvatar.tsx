
import React from "react";
import { motion } from "framer-motion";

interface CallAvatarProps {
  isProcessing: boolean;
}

const CallAvatar: React.FC<CallAvatarProps> = ({ isProcessing }) => {
  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#f0f0f0] to-[#ffffff] rounded-full flex items-center justify-center">
        <div className="w-20 h-20 sm:w-28 sm:h-28 relative">
          {/* WIZ Panda mascot with blue magical cloak */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Panda body */}
            <circle cx="50" cy="50" r="35" fill="#ffffff" />
            <circle cx="35" cy="40" r="10" fill="#000000" /> {/* Left eye patch */}
            <circle cx="65" cy="40" r="10" fill="#000000" /> {/* Right eye patch */}
            <circle cx="38" cy="42" r="3" fill="#ffffff" /> {/* Left eye highlight */}
            <circle cx="68" cy="42" r="3" fill="#ffffff" /> {/* Right eye highlight */}
            <ellipse cx="50" cy="55" rx="8" ry="5" fill="#000000" /> {/* Nose */}
            <path d="M40,65 Q50,75 60,65" stroke="#000000" strokeWidth="2" fill="none" /> {/* Smile */}
            
            {/* Blue magical cloak */}
            <path d="M20,45 Q25,20 50,15 Q75,20 80,45 L85,85 Q50,80 15,85 L20,45" fill="#1a3a8a" fillOpacity="0.85" />
            
            {/* Stars on cloak */}
            <path d="M30,35 L32,40 L28,40 Z" fill="#FFD700" transform="rotate(36, 30, 35)" />
            <path d="M40,60 L42,65 L38,65 Z" fill="#FFD700" transform="rotate(72, 40, 60)" />
            <path d="M65,40 L67,45 L63,45 Z" fill="#FFD700" transform="rotate(108, 65, 40)" />
            <path d="M70,65 L72,70 L68,70 Z" fill="#FFD700" transform="rotate(144, 70, 65)" />
            <path d="M50,30 L52,35 L48,35 Z" fill="#FFD700" transform="rotate(180, 50, 30)" />
            
            {/* Golden staff */}
            <rect x="85" y="30" width="3" height="50" rx="1.5" fill="#FFD700" transform="rotate(15, 85, 30)" />
            <circle cx="85" cy="25" r="5" fill="#FFD700" transform="rotate(15, 85, 25)" />
          </svg>
        </div>
      </div>
      
      {/* Pulsing effect for active state */}
      <motion.div 
        className={`absolute inset-0 rounded-full ${isProcessing ? 'bg-[#1a3a8a]/10' : 'bg-[#FFD700]/10'}`}
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          scale: isProcessing ? [1, 1.05, 1] : [0.95, 1, 0.95],
        }}
        transition={{ 
          duration: isProcessing ? 1 : 1.5, 
          repeat: Infinity 
        }}
      />
    </div>
  );
};

export default CallAvatar;
