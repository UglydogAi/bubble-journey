
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0c1015] text-white px-4 relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-20" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center relative z-10"
      >
        {/* UGLYDOG Profile Section */}
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
          <img 
            src="/lovable-uploads/d1f55023-5f21-43ab-b2a5-3348ee1b07ab.png"
            alt="UGLYDOG Mascot"
            className="w-full h-full object-cover"
          />
        </div>

        <motion.h2 
          className="text-3xl font-bold mt-4 mb-2"
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

        <p className="text-lg text-gray-300 mb-12">
          Start speaking
        </p>

        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-8"
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 bg-gray-800/50 border-gray-600 hover:bg-gray-700/50"
              onClick={() => setMuted(!muted)}
            >
              {muted ? (
                <MicOff className="w-6 h-6 text-gray-300" />
              ) : (
                <Mic className="w-6 h-6 text-gray-300" />
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16 bg-red-500/10 border-red-500 hover:bg-red-500/20"
              onClick={() => setShowControls(false)}
            >
              <PhoneOff className="w-6 h-6 text-red-500" />
            </Button>
          </motion.div>
        )}

        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <p className="text-sm text-gray-400">
            {muted ? "Muted" : "Unmuted"} • {showControls ? "In Call" : "Call Ended"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
