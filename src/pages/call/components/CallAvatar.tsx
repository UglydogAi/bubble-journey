
import React from "react";
import { motion } from "framer-motion";

interface CallAvatarProps {
  isProcessing: boolean;
}

const CallAvatar: React.FC<CallAvatarProps> = ({ isProcessing }) => {
  return (
    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full flex items-center justify-center">
        <div className="w-16 h-16 sm:w-24 sm:h-24 relative">
          {/* Magical orb with star */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-400 to-purple-700 rounded-full 
                        shadow-[0_0_15px_rgba(139,92,246,0.7)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-12 h-12 sm:w-16 sm:h-16 text-white/90">
              <path 
                fill="currentColor" 
                d="M12,2.5L8.42,8.06L2,9.74L6.2,14.88L5.82,21.5L12,19.09L18.18,21.5L17.8,14.88L22,9.74L15.58,8.06L12,2.5M9.38,10.5C10,10.5 10.5,11 10.5,11.63A1.12,1.12 0 0,1 9.38,12.75C8.75,12.75 8.25,12.25 8.25,11.63C8.25,11 8.75,10.5 9.38,10.5M14.63,10.5C15.25,10.5 15.75,11 15.75,11.63A1.12,1.12 0 0,1 14.63,12.75C14,12.75 13.5,12.25 13.5,11.63C13.5,11 14,10.5 14.63,10.5M9,15H15C14.5,16.21 13.31,17 12,17C10.69,17 9.5,16.21 9,15Z" 
              />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Pulsing background */}
      <motion.div 
        className={`absolute inset-0 rounded-full ${isProcessing ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          scale: isProcessing ? [1, 1.05, 1] : [0.95, 1, 0.95],
        }}
        transition={{ 
          duration: isProcessing ? 1 : 1.5, 
          repeat: Infinity 
        }}
      />
      
      {/* Magical glow ring */}
      <motion.div 
        className={`absolute -inset-1 rounded-full ${isProcessing ? 'border-2 border-blue-500/40' : 'border border-purple-500/40'}`}
        animate={{ 
          boxShadow: [
            `0 0 10px 2px ${isProcessing ? 'rgba(59,130,246,0.5)' : 'rgba(139,92,246,0.5)'}`,
            `0 0 15px 4px ${isProcessing ? 'rgba(59,130,246,0.7)' : 'rgba(139,92,246,0.7)'}`,
            `0 0 10px 2px ${isProcessing ? 'rgba(59,130,246,0.5)' : 'rgba(139,92,246,0.5)'}`
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
