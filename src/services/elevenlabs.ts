
import { toast } from "sonner";

interface ElevenLabsOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  onAudioData?: (audioData: ArrayBuffer) => void;
  onComplete?: () => void;
  onError?: (error: any) => void;
}

/**
 * Helper function to generate speech using ElevenLabs via WebSocket
 */
export const generateSpeechWithWebSocket = ({
  text,
  voiceId = "zna9hXvyrwtNwOt5taJ2", // Updated to the new Voice Agent ID
  modelId = "eleven_monolingual_v1",
  stability = 0.75,
  similarityBoost = 0.75,
  onAudioData,
  onComplete,
  onError
}: ElevenLabsOptions) => {
  try {
    // Construct the WebSocket URL
    const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${modelId}`;
    
    // Create the WebSocket connection
    const socket = new WebSocket(wsUrl);
    
    // Binary message flag
    let expectBinaryMessage = false;
    let audioChunks: Uint8Array[] = [];
    
    // When the connection opens, send the text and voice settings
    socket.onopen = () => {
      console.log('Connected to ElevenLabs WebSocket');
      
      // BOS (Beginning of Stream) message
      const bosMessage = {
        text: " ", // Empty text to start the stream
        voice_settings: {
          stability,
          similarity_boost: similarityBoost
        },
        xi_api_key: "sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf" // Updated API key
      };
      
      // Send the BOS message
      socket.send(JSON.stringify(bosMessage));
      
      // Send the text message after BOS
      const textMessage = {
        text,
        try_trigger_generation: true
      };
      
      // Send the text message
      socket.send(JSON.stringify(textMessage));
      
      // EOS (End of Stream) message to indicate no more text
      const eosMessage = {
        text: ""
      };
      
      // Send the EOS message
      socket.send(JSON.stringify(eosMessage));
    };
    
    // Handle incoming messages
    socket.onmessage = (event) => {
      // Check if this is a binary message (audio data)
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            if (onAudioData) {
              onAudioData(reader.result);
            }
            
            // Collect the audio chunk
            audioChunks.push(new Uint8Array(reader.result));
          }
        };
        reader.readAsArrayBuffer(event.data);
      } else {
        // This is a JSON message
        try {
          const message = JSON.parse(event.data);
          
          // Flag for expected binary data
          if (message.audio) {
            expectBinaryMessage = true;
          }
          
          // Check for completion
          if (message.isFinal) {
            // Concatenate all audio chunks
            const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const completeAudio = new Uint8Array(totalLength);
            let offset = 0;
            
            for (const chunk of audioChunks) {
              completeAudio.set(chunk, offset);
              offset += chunk.length;
            }
            
            if (onComplete) {
              onComplete();
            }
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
    };
    
    // Handle errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) {
        onError(error);
      } else {
        toast.error('Error connecting to ElevenLabs');
      }
    };
    
    // Handle connection close
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    // Return the socket so it can be closed externally
    return socket;
  } catch (error) {
    console.error('Error setting up WebSocket:', error);
    if (onError) {
      onError(error);
    } else {
      toast.error('Failed to set up speech generation');
    }
    return null;
  }
};
