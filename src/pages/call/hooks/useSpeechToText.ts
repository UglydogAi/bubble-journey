
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Start recording audio
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Get user media stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Clear previous audio chunks
      audioChunksRef.current = [];
      
      // Listen for data available events
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('Started recording audio');
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Could not access microphone. Please make sure it is connected and permissions are granted.');
    }
  }, []);
  
  // Stop recording and transcribe
  const stopRecording = useCallback(async () => {
    return new Promise<string>((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        setIsRecording(false);
        resolve('');
        return;
      }
      
      // Handle recording stop
      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        
        // Stop all tracks in stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // If no audio was recorded
        if (audioChunksRef.current.length === 0) {
          setError('No audio recorded. Please try again.');
          resolve('');
          return;
        }
        
        try {
          setIsTranscribing(true);
          
          // Create audio blob from collected chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          console.log('Audio recording complete, blob size:', audioBlob.size);
          
          // Send to Edge Function for transcription
          const { data, error: apiError } = await supabase.functions.invoke('proxy-speech-to-text', {
            body: audioBlob,
          });
          
          if (apiError) {
            console.error('Transcription error:', apiError);
            setError('Failed to transcribe audio. Please try again.');
            setIsTranscribing(false);
            resolve('');
            return;
          }
          
          if (data.error) {
            console.error('API returned error:', data.error, data.details || '');
            setError(`Transcription failed: ${data.error}`);
            setIsTranscribing(false);
            resolve('');
            return;
          }
          
          if (data.transcription) {
            console.log('Transcription received:', data.transcription);
            setTranscription(data.transcription);
            setIsTranscribing(false);
            resolve(data.transcription);
          } else {
            console.warn('Empty transcription received');
            setError('No speech detected. Please try again.');
            setIsTranscribing(false);
            resolve('');
          }
        } catch (err) {
          console.error('Error during transcription:', err);
          setError('Failed to process audio. Please try again.');
          setIsTranscribing(false);
          resolve('');
        }
      };
      
      // Stop recording
      mediaRecorderRef.current.stop();
    });
  }, []);
  
  return {
    isRecording,
    isTranscribing,
    transcription,
    error,
    startRecording,
    stopRecording,
    setTranscription,
  };
}
