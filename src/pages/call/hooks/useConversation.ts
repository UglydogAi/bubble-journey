
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
  
  const {
    currentAudio,
    setCurrentAudio,
    audioChunksRef,
    playAudioFromChunks,
    pauseCurrentAudio,
    addAudioChunk
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

  // Reset retry count when component mounts
  useEffect(() => {
    setRetryCount(0);
    
    // Small delay before playing initial greeting
    const timer = setTimeout(() => {
      sendMessageToAI("Hello! I'm UGLYDOG, your AI assistant. How can I help you today?");
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
      
      // Add user message to conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: text }
      ]);
      
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
    pauseCurrentAudio
  };
}
