
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import ElevenLabsConversationalAI from "@/services/elevenlabsConversationalAI";
import ElevenLabsWebSocket from "@/services/elevenlabsWebSocket";
import { useAudioPlayer } from './useAudioPlayer';

// API Credentials for UGLYDOG Voice Agent
const API_KEY = 'sk_c2822d915c042b181a997206c6b3f1257442239fcebaf247';
const AGENT_ID = 'zna9hXvyrwtNwOt5taJ2';

export function useConversation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  
  const {
    currentAudio,
    setCurrentAudio,
    audioChunksRef,
    playAudioFromChunks,
    pauseCurrentAudio,
    addAudioChunk
  } = useAudioPlayer();
  
  // Ref for the Conversational AI connection
  const aiRef = useRef<ElevenLabsConversationalAI | null>(null);
  
  // Ref for the WebSocket connection
  const wsRef = useRef<ElevenLabsWebSocket | null>(null);

  // Animate the waveform when processing audio
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setWaveProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

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
          toast.error('Error with conversational AI. Using backup service.');
          // Fall back to the regular TTS if needed
          initializeWebSocketTTS();
        }
        setIsProcessing(false);
      },
      // Pass API credentials
      API_KEY,
      AGENT_ID
    );

    try {
      // Connect to Conversational AI
      aiRef.current.connect().catch(error => {
        console.error('Failed to connect to Conversational AI:', error);
        // Initialize fallback TTS on connection failure
        initializeWebSocketTTS();
      });
    } catch (error) {
      console.error('Error initializing Conversational AI:', error);
      // Initialize fallback TTS
      initializeWebSocketTTS();
    }
    
    return () => {
      // Clean up WebSocket connections on component unmount
      if (aiRef.current) {
        aiRef.current.disconnect();
      }
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  // Reset retry count when component mounts
  useEffect(() => {
    setRetryCount(0);
    
    // Small delay before playing initial greeting
    const timer = setTimeout(() => {
      sendMessageToAI("Hello! I'm UGLYDOG, your AI assistant. How can I help you today?");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  const sendMessageToAI = async (text: string) => {
    try {
      setIsProcessing(true);
      
      // Add user message to conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: text }
      ]);
      
      // Try Conversational AI if available
      if (aiRef.current && retryCount < 2) {
        try {
          // Connect if not already connected
          await aiRef.current.connect();
          aiRef.current.sendMessage(text);
          return;
        } catch (aiError) {
          console.error('Conversational AI failed, falling back to WebSocket TTS:', aiError);
          setRetryCount(prev => prev + 1);
        }
      }
      
      // Try regular WebSocket TTS as first fallback
      if (wsRef.current && retryCount < 3) {
        try {
          // Initialize WebSocket TTS if not already done
          if (!wsRef.current) {
            initializeWebSocketTTS();
          }
          
          // Connect if not already connected
          await wsRef.current.connect();
          wsRef.current.synthesizeSpeech(`I received your message: "${text}". How can I help you further?`);
          return;
        } catch (wsError) {
          console.error('WebSocket failed, falling back to edge function:', wsError);
          setRetryCount(prev => prev + 1);
        }
      }
      
      // Fallback to Edge Function
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
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsProcessing(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return {
    isProcessing,
    waveProgress,
    message,
    setMessage,
    conversationHistory,
    sendMessageToAI,
    pauseCurrentAudio
  };
}
