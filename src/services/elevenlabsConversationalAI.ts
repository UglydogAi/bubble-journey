
/**
 * Service for ElevenLabs Conversational AI
 */

export class ElevenLabsConversationalAI {
  private socket: WebSocket | null = null;
  private apiKey: string;
  private agentId: string;
  private conversationId: string;
  
  constructor(
    private onResponse?: (response: any) => void,
    private onAudioData?: (audioData: Blob) => void,
    private onComplete?: () => void,
    private onError?: (error: any) => void,
    apiKey: string = 'sk_c2822d915c042b181a997206c6b3f1257442239fcebaf247',
    agentId: string = 'zna9hXvyrwtNwOt5taJ2'
  ) {
    // Store API credentials
    this.apiKey = apiKey;
    this.agentId = agentId;
    
    // Generate a unique conversation ID based on timestamp
    this.conversationId = `convo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Construct WebSocket URL with agent ID and API key
        const wsUrl = `wss://api.elevenlabs.io/v1/conversational-ai?agent_id=${this.agentId}&xi-api-key=${this.apiKey}`;
        
        // Create WebSocket connection
        this.socket = new WebSocket(wsUrl);
        
        this.socket.onopen = () => {
          console.log('Connected to ElevenLabs Conversational AI WebSocket.');
          resolve();
        };
        
        this.socket.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            console.log('Conversational AI response:', response);
            
            if (this.onResponse) {
              this.onResponse(response);
            }
            
            // Handle audio data if present
            if (response.audio) {
              if (this.onAudioData) {
                const audioData = Uint8Array.from(atob(response.audio), c => c.charCodeAt(0));
                this.onAudioData(new Blob([audioData], { type: 'audio/mpeg' }));
              }
            }
            
            // Check if this is the final message
            if (response.isFinal) {
              if (this.onComplete) {
                this.onComplete();
              }
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
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
          console.log('WebSocket connection closed.');
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

  public sendMessage(message: string, context?: string): void {
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
        message,
        conversation_id: this.conversationId,
        context: context || ''
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

export default ElevenLabsConversationalAI;
