
/**
 * Service for ElevenLabs WebSocket TTS streaming
 */

export class ElevenLabsWebSocket {
  private socket: WebSocket | null = null;
  private apiKey: string;
  // Updated to use the specified Voice Agent ID
  private voiceId: string = '8O6pFCk0iNpBd4MH3qyT';
  
  constructor(
    private onAudioChunk?: (audioData: Blob) => void, 
    private onComplete?: () => void,
    private onError?: (error: any) => void,
    apiKey: string = 'sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf'
  ) {
    this.apiKey = apiKey;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Construct WebSocket URL with API key as query parameter for authentication
        const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}/stream-input?xi-api-key=${this.apiKey}&model_id=eleven_turbo_v2`;
        
        // Create WebSocket connection
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          console.log('Connected to ElevenLabs WebSocket');
          // Send initial BOS (Beginning of Stream) message
          const bosMessage = {
            text: " ",
            voice_settings: {
              stability: 0.75,
              similarity_boost: 0.75
            },
            xi_api_key: this.apiKey,
            // Indicate beginning of stream
            try_trigger_generation: true,
            generation_config: {
              chunk_length_schedule: [50]
            }
          };
          
          if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(bosMessage));
          }
          
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          if (event.data instanceof Blob) {
            // Audio data received
            if (this.onAudioChunk) {
              this.onAudioChunk(event.data);
            }
          } else {
            // JSON message received (usually completion status)
            try {
              const message = JSON.parse(event.data);
              console.log('WebSocket message:', message);
              
              if (message.audio) {
                // Convert base64 audio to Blob if needed
                if (this.onAudioChunk) {
                  const audioData = Uint8Array.from(atob(message.audio), c => c.charCodeAt(0));
                  this.onAudioChunk(new Blob([audioData], { type: 'audio/mpeg' }));
                }
              }
              
              if (message.isFinal) {
                if (this.onComplete) {
                  this.onComplete();
                }
              }
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          }
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (this.onError) {
            this.onError(error);
          }
          reject(error);
        };
        
        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
        };
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        if (this.onError) {
          this.onError(error);
        }
        reject(error);
      }
    });
  }

  public synthesizeSpeech(text: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      if (this.onError) {
        this.onError(new Error('WebSocket not connected'));
      }
      return;
    }
    
    try {
      // Construct the payload
      const payload = {
        text,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75
        }
      };
      
      // Send the payload
      this.socket.send(JSON.stringify(payload));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default ElevenLabsWebSocket;
