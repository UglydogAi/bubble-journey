
import { useState, useCallback, useEffect, useRef } from 'react';
import { elevenlabsVoice, ElevenLabsVoiceService } from '@/services/elevenlabsVoice';
import { toast } from 'sonner';

export function useElevenLabsVoice() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const voiceServiceRef = useRef<ElevenLabsVoiceService>(elevenlabsVoice);
  const isMountedRef = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const speak = useCallback(async (text: string): Promise<boolean> => {
    if (!text?.trim()) return false;
    
    try {
      setIsProcessing(true);
      setError(null);
      setIsPlaying(true);
      
      await voiceServiceRef.current.playAudio(text);
      
      if (isMountedRef.current) {
        setIsPlaying(false);
        setIsProcessing(false);
      }
      
      return true;
    } catch (err) {
      console.error('Voice playback error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate or play speech';
      
      if (isMountedRef.current) {
        setError(errorMessage);
        setIsPlaying(false);
        setIsProcessing(false);
        toast.error('Voice playback failed. Please try again.');
      }
      
      return false;
    }
  }, []);
  
  return {
    speak,
    isProcessing,
    isPlaying,
    error
  };
}
