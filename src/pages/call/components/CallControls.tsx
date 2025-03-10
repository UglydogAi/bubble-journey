
import React from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
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
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"
        onClick={() => setMuted(!muted)}
      >
        {muted ? (
          <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
        ) : (
          <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
        )}
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 border-red-500 hover:bg-red-500/20"
        onClick={onEndCall}
      >
        <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
      </Button>
    </motion.div>
  );
};

export default CallControls;
