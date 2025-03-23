
import { useState, useCallback, useEffect, useRef } from 'react';
import { elevenlabsVoice, ElevenLabsVoiceService } from '@/services/elevenlabsVoice';
import { browserSpeech } from '@/services/browserSpeechService';
import { toast } from 'sonner';

export function useElevenLabsVoice() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBrowserSpeech, setUseBrowserSpeech] = useState(false);
  const voiceServiceRef = useRef<ElevenLabsVoiceService>(elevenlabsVoice);
  const isMountedRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Stop any playing audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const speak = useCallback(async (text: string): Promise<boolean> => {
    if (!text?.trim()) return false;
    
    try {
      console.log('Starting speech synthesis for:', text);
      setIsProcessing(true);
      setError(null);
      setIsPlaying(true);
      
      // If we previously detected quota issues, use browser speech immediately
      if (useBrowserSpeech) {
        console.log('Using browser speech synthesis');
        await browserSpeech.playAudio(text);
      } else {
        try {
          // First try ElevenLabs
          console.log('Attempting ElevenLabs voice synthesis');
          await voiceServiceRef.current.playAudio(text);
          console.log('ElevenLabs playback completed successfully');
        } catch (elevenlabsError) {
          console.error('ElevenLabs failed, falling back to browser speech:', elevenlabsError);
          
          // Check if it's a quota error
          const errorMsg = elevenlabsError instanceof Error ? elevenlabsError.message : '';
          if (errorMsg.includes('quota_exceeded')) {
            // Remember to use browser speech for future requests
            setUseBrowserSpeech(true);
            toast.info('Switched to browser speech synthesis due to API quota limits');
          }
          
          // Use browser speech as fallback
          console.log('Using browser speech as fallback');
          await browserSpeech.playAudio(text);
        }
      }
      
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
  }, [useBrowserSpeech]);
  
  return {
    speak,
    isProcessing,
    isPlaying,
    error,
    useBrowserSpeech
  };
}
