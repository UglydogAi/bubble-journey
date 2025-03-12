
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechToText } from "../hooks/useSpeechToText";

interface SpeechInputProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

const SpeechInput: React.FC<SpeechInputProps> = ({ 
  onTranscriptionComplete,
  disabled = false
}) => {
  const {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    transcribeAudio,
  } = useSpeechToText();

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = async () => {
    const text = await transcribeAudio();
    if (text) {
      onTranscriptionComplete(text);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {(transcription && !isRecording && !isProcessing) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-black/20 backdrop-blur-sm rounded-lg p-3 mb-3"
        >
          <p className="text-sm text-white/90">"{transcription}"</p>
        </motion.div>
      )}
      
      <div className="flex items-center justify-center gap-2">
        {!isRecording ? (
          <Button
            onClick={handleStartRecording}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full shadow-lg"
            disabled={isProcessing || disabled}
          >
            <Mic className="w-5 h-5 mr-2" />
            {isProcessing ? "Processing..." : "Start Speaking"}
          </Button>
        ) : (
          <Button
            onClick={handleStopRecording}
            variant="destructive"
            className="pulse-animation"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop Speaking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SpeechInput;
