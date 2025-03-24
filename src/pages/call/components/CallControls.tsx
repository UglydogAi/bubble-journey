
import React from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallControlsProps {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({ 
  muted, 
  setMuted, 
  onEndCall 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-6 sm:gap-8"
    >
      <Button
        variant="outline"
        size="lg"
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full relative overflow-hidden 
                 border-2 ${muted ? 'border-yellow-500/70' : 'border-blue-500/70'} 
                 bg-transparent hover:bg-blue-500/10`}
        onClick={() => setMuted(!muted)}
      >
        {muted ? (
          <MicOff className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
        ) : (
          <>
            <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            {/* Pulse animation for active mic */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-blue-500/20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full relative overflow-hidden
                 border-2 border-red-500/70 bg-transparent hover:bg-red-500/10
                 transition-transform duration-200 hover:scale-105"
        onClick={onEndCall}
      >
        <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full relative overflow-hidden
                 border-2 border-gray-500/50 bg-transparent hover:bg-gray-500/10
                 transition-transform duration-200 hover:scale-105"
      >
        {true ? (
          <Volume2 className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
        ) : (
          <VolumeX className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
        )}
      </Button>
    </motion.div>
  );
};

export default CallControls;
