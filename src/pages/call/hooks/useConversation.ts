
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAudioPlayer } from './useAudioPlayer';
import { useConversationalAI } from './useConversationalAI';
import { useFallbackTTS } from './useFallbackTTS';

export function useConversation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  const [initialGreetingPlayed, setInitialGreetingPlayed] = useState(false);
  
  const {
    currentAudio,
    setCurrentAudio,
    audioChunksRef,
    playAudioFromChunks,
    pauseCurrentAudio,
    addAudioChunk,
    clearAudioChunks
  } = useAudioPlayer();

  // Initialize fallback TTS service
  const {
    initializeWebSocketTTS,
    useWebSocketFallback,
    useEdgeFunctionFallback,
    disconnect: disconnectWebSocket
  } = useFallbackTTS(
    retryCount, 
    setRetryCount, 
    setIsProcessing, 
    addAudioChunk, 
    playAudioFromChunks,
    currentAudio,
    setCurrentAudio
  );

  // Initialize conversational AI service
  const {
    sendMessage: sendToConversationalAI,
    aiRef
  } = useConversationalAI(
    retryCount,
    setRetryCount,
    setIsProcessing,
    setConversationHistory,
    addAudioChunk,
    playAudioFromChunks,
    initializeWebSocketTTS
  );

  // Animate the waveform when processing audio
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setWaveProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  // Reset retry count when component mounts and play initial greeting
  useEffect(() => {
    setRetryCount(0);
    
    // Play UGLYDOG's custom greeting when the call page loads
    const timer = setTimeout(() => {
      const uglyDogGreeting = "I've been expecting you, I'm UGLYDOG, your no-excuses AI coach. Tell me what's holding you back, and I'll tell you how to CRUSH IT!";
      // Try the edge function first for the initial greeting
      useEdgeFunctionFallback(uglyDogGreeting)
        .then(success => {
          if (!success) {
            // If edge function fails, try websocket
            return useWebSocketFallback(uglyDogGreeting);
          }
          return true;
        })
        .then(success => {
          if (!success) {
            // If both fail, try conversational AI
            return sendToConversationalAI(uglyDogGreeting);
          }
          return true;
        })
        .catch(error => {
          console.error("Failed to play initial greeting:", error);
          toast.error("Failed to play greeting. Please reload the page.");
        })
        .finally(() => {
          setInitialGreetingPlayed(true);
        });
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      if (aiRef.current) {
        aiRef.current.disconnect();
      }
      disconnectWebSocket();
    };
  }, []);

  const sendMessageToAI = async (text: string) => {
    try {
      setIsProcessing(true);
      
      // Add user message to conversation history if it's not the initial greeting
      if (initialGreetingPlayed) {
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: text }
        ]);
      }
      
      // Try Conversational AI if available
      if (aiRef.current && retryCount < 2) {
        const success = await sendToConversationalAI(text);
        if (success) return;
      }
      
      // Try regular WebSocket TTS as first fallback
      if (retryCount < 3) {
        const success = await useWebSocketFallback(text);
        if (success) return;
      }
      
      // Fallback to Edge Function as last resort
      await useEdgeFunctionFallback(text);
      
    } catch (error) {
      console.error('Error in sendMessageToAI:', error);
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
    pauseCurrentAudio,
    initialGreetingPlayed
  };
}
