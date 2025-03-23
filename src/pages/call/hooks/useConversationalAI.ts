
import { useRef, useEffect } from 'react';
import ElevenLabsConversationalAI from "@/services/elevenlabsConversationalAI";
import { supabase } from "@/integrations/supabase/client";

// API Credentials for ElevenLabs
const API_KEY = 'sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf';
// Updated to use a standard ElevenLabs voice ID
const AGENT_ID = 'pNInz6obpgDQGcFmaJgB';
// Set to true to use Supabase proxy instead of direct WebSocket connection
const USE_PROXY = true;

export function useConversationalAI(
  retryCount: number,
  setRetryCount: React.Dispatch<React.SetStateAction<number>>,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  setConversationHistory: React.Dispatch<React.SetStateAction<{role: string, content: string}[]>>,
  addAudioChunk: (chunk: Blob) => void,
  playAudioFromChunks: () => Promise<void>,
  initializeFallback: () => void
) {
  // Ref for the Conversational AI connection
  const aiRef = useRef<ElevenLabsConversationalAI | null>(null);

  // Setup ElevenLabs conversational AI
  useEffect(() => {
    // Initialize Conversational AI service
    aiRef.current = new ElevenLabsConversationalAI(
      // On response received
      (response) => {
        if (response.message) {
          // Add AI response to conversation history
          setConversationHistory(prev => [
            ...prev,
            { role: 'assistant', content: response.message }
          ]);
        }
      },
      // On audio data received
      (audioData) => {
        addAudioChunk(audioData);
      },
      // On complete
      () => {
        setIsProcessing(false);
        playAudioFromChunks();
      },
      // On error
      (error) => {
        console.error('Conversational AI error:', error);
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
        } else {
          console.error('Error with conversational AI. Using backup service.');
          // Fall back to the regular TTS if needed
          initializeFallback();
        }
        setIsProcessing(false);
      },
      // Pass API credentials
      API_KEY,
      AGENT_ID,
      USE_PROXY
    );

    try {
      // Connect to Conversational AI
      aiRef.current.connect().catch(error => {
        console.error('Failed to connect to Conversational AI:', error);
        // Initialize fallback TTS on connection failure
        initializeFallback();
      });
    } catch (error) {
      console.error('Error initializing Conversational AI:', error);
      // Initialize fallback TTS
      initializeFallback();
    }
    
    return () => {
      // Clean up WebSocket connection on component unmount
      if (aiRef.current) {
        aiRef.current.disconnect();
      }
    };
  }, []);

  // Method to send message to Conversational AI
  const sendMessage = async (text: string): Promise<boolean> => {
    try {
      // Connect if not already connected
      await aiRef.current?.connect();
      aiRef.current?.sendMessage(text);
      return true;
    } catch (aiError) {
      console.error('Conversational AI failed, falling back to WebSocket TTS:', aiError);
      setRetryCount(prev => prev + 1);
      return false;
    }
  };

  return {
    sendMessage,
    aiRef
  };
}
