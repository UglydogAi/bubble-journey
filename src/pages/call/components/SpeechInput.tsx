
import React, { useState, useEffect } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send } from "lucide-react";

interface SpeechInputProps {
  onTranscriptionResult: (text: string) => void;
}

export default function SpeechInput({ onTranscriptionResult }: SpeechInputProps) {
  const [text, setText] = useState('');
  const [autoStart, setAutoStart] = useState(true);
  
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    transcription, 
    isTranscribing, 
    error 
  } = useSpeechToText();

  // Start recording automatically when component mounts
  useEffect(() => {
    if (autoStart) {
      startRecording();
      setAutoStart(false);
    }
  }, [autoStart, startRecording]);

  // Update text field when transcription changes
  useEffect(() => {
    if (transcription) {
      setText(transcription);
    }
  }, [transcription]);

  const handleSubmit = () => {
    if (text.trim()) {
      onTranscriptionResult(text);
      setText('');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={isTranscribing ? "Processing..." : text}
            onChange={(e) => setText(e.target.value)}
            disabled={isTranscribing}
            placeholder={isRecording ? "Listening..." : "Type or speak your message..."}
            className="w-full px-4 py-2 bg-gray-800/50 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && (
            <div className="absolute -bottom-6 left-0 text-xs text-red-400">
              {error}
            </div>
          )}
        </div>
        
        <Button
          type="button"
          onClick={toggleRecording}
          variant="outline"
          size="icon"
          className={`rounded-full ${isRecording ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-purple-500/20 text-purple-500 border-purple-500/50'}`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
        
        <Button
          type="button"
          onClick={handleSubmit}
          variant="outline"
          size="icon"
          disabled={!text.trim() || isTranscribing}
          className="rounded-full bg-purple-500/20 text-purple-500 border-purple-500/50"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
