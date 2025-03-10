
/**
 * Service for ElevenLabs WebSocket TTS streaming
 */

export class ElevenLabsWebSocket {
  private socket: WebSocket | null = null;
  private apiKey: string = 'sk_c2822d915c042b181a997206c6b3f1257442239fcebaf247';
  private voiceId: string = '831ZKnvNLkjUZ4w5GlOe';
  
  constructor(
    private onAudioChunk?: (audioData: Blob) => void, 
    private onComplete?: () => void,
    private onError?: (error: any) => void
  ) {}

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Construct WebSocket URL
        const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech?voice_id=${this.voiceId}`;
        
        // Create WebSocket connection
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          console.log('Connected to ElevenLabs WebSocket');
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
              
              if (message.completed) {
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
