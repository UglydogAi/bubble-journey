
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export function useSpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Start recording audio
  const startRecording = async () => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setTranscription("");
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up data handling
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone. Please check permissions.');
      return false;
    }
  };

  // Stop recording and get the audio blob
  const stopRecording = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks in the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        setIsRecording(false);
        resolve(audioBlob);
      };

      mediaRecorderRef.current.stop();
    });
  };

  // Transcribe audio using ElevenLabs API
  const transcribeAudio = async () => {
    try {
      setIsProcessing(true);
      
      // Stop recording and get audio blob
      const audioBlob = await stopRecording();
      
      if (!audioBlob) {
        setIsProcessing(false);
        return null;
      }
      
      // Create form data with audio blob
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Send to Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('speech-to-text', {
        body: formData,
      });
      
      if (error) {
        console.error('Error from speech-to-text function:', error);
        toast.error('Failed to transcribe audio');
        setIsProcessing(false);
        return null;
      }
      
      if (data.text) {
        setTranscription(data.text);
        setIsProcessing(false);
        return data.text;
      } else {
        toast.error('Received empty transcription');
        setIsProcessing(false);
        return null;
      }
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast.error('Failed to process speech');
      setIsProcessing(false);
      return null;
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    audioChunksRef.current = [];
    setIsRecording(false);
  };

  return {
    isRecording,
    isProcessing,
    transcription,
    startRecording,
    stopRecording,
    transcribeAudio,
    cancelRecording
  };
}
