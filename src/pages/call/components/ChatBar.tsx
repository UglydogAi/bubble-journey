
import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ChatBarProps {
  isVoiceMode: boolean;
  isProcessing: boolean;
  message: string;
  waveProgress: number;
  setMessage: (message: string) => void;
  toggleInputMode: () => void;
  handleSendMessage: (e?: React.FormEvent) => void;
  textInputRef: React.RefObject<HTMLInputElement>;
}

const ChatBar: React.FC<ChatBarProps> = ({
  isVoiceMode,
  isProcessing,
  message,
  waveProgress,
  setMessage,
  toggleInputMode,
  handleSendMessage,
  textInputRef,
}) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 w-full py-4 px-4 sm:px-6 z-20"
      >
        <div className="max-w-2xl mx-auto">
          <div className={`
            backdrop-blur-xl 
            bg-black/30
            border border-primary/10
            shadow-[0_0_15px_rgba(173,109,244,0.15)]
            rounded-2xl 
            overflow-hidden
            transition-all duration-300
            ${isVoiceMode && isProcessing ? 'ring-1 ring-primary/40' : ''}
          `}>
            {isVoiceMode ? (
              <div className="p-4 flex items-center">
                <div className="flex-1 flex justify-center">
                  {isProcessing ? (
                    <div className="w-full max-w-xs">
                      <Progress value={waveProgress} className="h-2" />
                    </div>
                  ) : (
                    <motion.p 
                      className="text-sm text-gray-300 text-center"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Tap to speak or switch to text mode
                    </motion.p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={toggleInputMode} 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-10 h-10 bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
                  >
                    <Send className="h-4 w-4 text-gray-300" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className={`
                      rounded-full w-10 h-10 
                      ${isProcessing ? 'bg-primary/20 border-primary/30' : 'bg-gray-800/50 border-gray-700/50'} 
                      hover:bg-gray-700/50
                    `}
                  >
                    <AudioWaveform className={`h-4 w-4 ${isProcessing ? 'text-primary/90' : 'text-gray-300'}`} />
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center p-2">
                <div className="flex-1 relative">
                  <input
                    ref={textInputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message UGLYDOG..."
                    className="w-full px-4 py-3 rounded-xl bg-transparent border-none focus:outline-none text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  {message.trim() ? (
                    <Button 
                      type="submit" 
                      size="icon" 
                      className="rounded-full w-10 h-10 bg-primary/80 hover:bg-primary border-none flex items-center justify-center"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={toggleInputMode} 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full w-10 h-10 bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50"
                    >
                      <AudioWaveform className="h-4 w-4 text-gray-300" />
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBar;
