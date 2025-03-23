
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import ElevenLabsWebSocket from "@/services/elevenlabsWebSocket";

// Updated API key for new Voice Agent
const API_KEY = 'sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf';

export function useFallbackTTS(
  retryCount: number, 
  setRetryCount: React.Dispatch<React.SetStateAction<number>>,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  addAudioChunk: (chunk: Blob) => void,
  playAudioFromChunks: () => Promise<void>,
  currentAudio: HTMLAudioElement | null,
  setCurrentAudio: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>
) {
  // Ref for the WebSocket connection
  const wsRef = useRef<ElevenLabsWebSocket | null>(null);

  // Initialize the standard WebSocket TTS as fallback
  const initializeWebSocketTTS = () => {
    if (!wsRef.current) {
      wsRef.current = new ElevenLabsWebSocket(
        // On audio chunk received
        (audioChunk) => {
          addAudioChunk(audioChunk);
        },
        // On complete
        () => {
          setIsProcessing(false);
          playAudioFromChunks();
        },
        // On error
        (error) => {
          console.error('WebSocket error:', error);
          if (retryCount < 2) {
            setRetryCount(prev => prev + 1);
          } else {
            toast.error('Error with speech synthesis. Using backup service.');
          }
          setIsProcessing(false);
        },
        // Pass API key
        API_KEY
      );
    }
  };

  // Function to use WebSocket TTS fallback
  const useWebSocketFallback = async (text: string) => {
    try {
      // Initialize WebSocket TTS if not already done
      if (!wsRef.current) {
        initializeWebSocketTTS();
      }
      
      // Connect if not already connected
      await wsRef.current.connect();
      wsRef.current.synthesizeSpeech(`I received your message: "${text}". How can I help you further?`);
      return true;
    } catch (wsError) {
      console.error('WebSocket failed, falling back to edge function:', wsError);
      setRetryCount(prev => prev + 1);
      return false;
    }
  };

  // Function to use edge function as last fallback
  const useEdgeFunctionFallback = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('eleven-labs-tts', {
        body: { text: `I received your message: "${text}". How can I help you further?` }
      });

      if (error) {
        console.error('Error from edge function:', error);
        toast.error('Failed to generate speech. Please try again.');
        setIsProcessing(false);
        throw error;
      }

      if (data.audioUrl) {
        if (currentAudio) {
          currentAudio.pause();
        }
        
        const audio = new Audio(data.audioUrl);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsProcessing(false);
        };

        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          toast.error('Failed to play audio. Please try again.');
          setIsProcessing(false);
        };
        
        await audio.play();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsProcessing(false);
      toast.error('Something went wrong. Please try again.');
      return false;
    }
  };

  // Clean up function
  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
  };

  return {
    initializeWebSocketTTS,
    useWebSocketFallback,
    useEdgeFunctionFallback,
    disconnect
  };
}
