
import { useState, useRef } from 'react';

export function useAudioPlayer() {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const playAudioFromChunks = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    try {
      // Create a new Blob from all audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
      
      // Create URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Play the audio
      if (currentAudio) {
        currentAudio.pause();
      }
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        // Clear audio chunks for next message
        audioChunksRef.current = [];
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio from chunks:', error);
      throw error;
    }
  };

  const pauseCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
    }
  };

  const addAudioChunk = (chunk: Blob) => {
    audioChunksRef.current.push(chunk);
  };

  const clearAudioChunks = () => {
    audioChunksRef.current = [];
  };

  return {
    currentAudio,
    setCurrentAudio,
    audioChunksRef,
    playAudioFromChunks,
    pauseCurrentAudio,
    addAudioChunk,
    clearAudioChunks
  };
}
