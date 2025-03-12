
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { toast } from "sonner";

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
    error,
    startRecording,
    transcribeAudio,
    cancelRecording,
  } = useSpeechToText();

  const handleStartRecording = async () => {
    const success = await startRecording();
    if (!success) {
      toast.error("Failed to start recording. Please check your microphone permissions.");
    }
  };

  const handleStopRecording = async () => {
    try {
      const text = await transcribeAudio();
      if (text) {
        onTranscriptionComplete(text);
        toast.success("Successfully transcribed your speech");
      } else if (error) {
        toast.error(`Failed to transcribe: ${error}`);
      }
    } catch (err) {
      console.error("Error in transcription:", err);
      toast.error("Failed to process your speech. Please try again.");
    }
  };

  const handleCancelRecording = () => {
    cancelRecording();
    toast.info("Recording canceled");
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
      
      {error && !isRecording && !isProcessing && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-red-900/30 backdrop-blur-sm rounded-lg p-3 mb-3 flex items-center"
        >
          <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
          <p className="text-sm text-red-200">{error}</p>
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
          <div className="flex gap-2">
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
                  Stop & Transcribe
                </>
              )}
            </Button>
            <Button
              onClick={handleCancelRecording}
              variant="outline"
              className="border-white/20 text-white/80 hover:bg-white/10"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechInput;
