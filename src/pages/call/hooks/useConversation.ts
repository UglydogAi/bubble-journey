
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAudioPlayer } from './useAudioPlayer';
import { useConversationalAI } from './useConversationalAI';
import { useFallbackTTS } from './useFallbackTTS';
import { useElevenLabsVoice } from './useElevenLabsVoice';

export function useConversation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  const [initialGreetingPlayed, setInitialGreetingPlayed] = useState(false);
  
  // New direct ElevenLabs voice integration with browser fallback
  const { speak, isPlaying: isElevenLabsSpeaking, useBrowserSpeech } = useElevenLabsVoice();
  
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
    const timer = setTimeout(async () => {
      const uglyDogGreeting = "I've been expecting you, I'm UGLYDOG, your no-excuses AI coach. Tell me what's holding you back, and I'll tell you how to CRUSH IT!";
      
      setIsProcessing(true);
      try {
        console.log("Attempting to play initial greeting...");
        // Try all available methods until one works
        
        // 1. First try direct speak method with browser fallback
        console.log("Trying direct speak method for initial greeting");
        const directSuccess = await speak(uglyDogGreeting);
        if (directSuccess) {
          console.log("Initial greeting played successfully with direct speak method");
          setInitialGreetingPlayed(true);
          setIsProcessing(false);
          return;
        }
        
        // 2. Try conversational AI
        console.log("Direct speak failed, trying conversational AI...");
        const aiSuccess = await sendToConversationalAI(uglyDogGreeting);
        if (aiSuccess) {
          console.log("Initial greeting played successfully with conversational AI");
          setInitialGreetingPlayed(true);
          return;
        }
        
        // 3. Try WebSocket
        console.log("Conversational AI failed, trying WebSocket...");
        const websocketSuccess = await useWebSocketFallback(uglyDogGreeting);
        if (websocketSuccess) {
          console.log("Initial greeting played successfully with WebSocket");
          setInitialGreetingPlayed(true);
          return;
        }
        
        // 4. Try Edge Function
        console.log("WebSocket failed, trying Edge Function...");
        const edgeFunctionSuccess = await useEdgeFunctionFallback(uglyDogGreeting);
        if (edgeFunctionSuccess) {
          console.log("Initial greeting played successfully with Edge Function");
          setInitialGreetingPlayed(true);
          return;
        }
        
        // All methods failed but we'll still allow the user to continue
        console.log("All voice playback methods failed");
        toast.error("Voice playback unavailable. Please check your audio settings and try again.");
        
      } catch (error) {
        console.error("Failed to play initial greeting:", error);
      } finally {
        // Always set initialGreetingPlayed to true so the user can interact
        setInitialGreetingPlayed(true);
        setIsProcessing(false);
      }
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
      if (isProcessing) {
        console.log("Already processing a message, ignoring new input");
        return;
      }
      
      console.log("Processing new user message:", text);
      setIsProcessing(true);
      
      // Add user message to conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: text }
      ]);
      
      // Try each voice method in sequence until one works
      
      // 1. Try conversational AI with the actual agent for a more natural conversation
      try {
        if (aiRef.current && retryCount < 2) {
          console.log("Sending to conversational AI:", text);
          const aiSuccess = await sendToConversationalAI(text);
          if (aiSuccess) {
            return;
          }
        }
      } catch (error) {
        console.error("Error with conversational AI:", error);
      }
      
      // Fallback to simpler TTS if conversational AI fails
      // Create AI response
      const response = `I received your message: "${text}". How can I help you further?`;
      setConversationHistory(prev => [
        ...prev,
        { role: 'assistant', content: response }
      ]);
      
      // 2. Try direct speak with browser fallback
      console.log("Trying direct speak for response");
      const directSuccess = await speak(response);
      if (directSuccess) {
        setIsProcessing(false);
        return;
      }
      
      // 3. Try WebSocket
      console.log("Direct speak failed, trying WebSocket");
      const socketSuccess = await useWebSocketFallback(response);
      if (socketSuccess) return;
      
      // 4. Try Edge Function
      console.log("WebSocket failed, trying Edge Function");
      await useEdgeFunctionFallback(response);
      
    } catch (error) {
      console.error('Error in sendMessageToAI:', error);
      toast.error("Failed to process your message. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing: isProcessing || isElevenLabsSpeaking,
    waveProgress,
    conversationHistory,
    sendMessageToAI,
    pauseCurrentAudio,
    initialGreetingPlayed,
    useBrowserSpeech
  };
}
