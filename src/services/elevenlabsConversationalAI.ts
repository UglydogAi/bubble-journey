
/**
 * Service for ElevenLabs Conversational AI
 */

export class ElevenLabsConversationalAI {
  private socket: WebSocket | null = null;
  private apiKey: string;
  private agentId: string;
  private conversationId: string;
  private useProxy: boolean;
  
  constructor(
    private onResponse?: (response: any) => void,
    private onAudioData?: (audioData: Blob) => void,
    private onComplete?: () => void,
    private onError?: (error: any) => void,
    apiKey: string = 'sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf',
    agentId: string = '8O6pFCk0iNpBd4MH3qyT',
    useProxy: boolean = true
  ) {
    // Store API credentials
    this.apiKey = apiKey;
    this.agentId = agentId;
    this.useProxy = useProxy;
    
    // Generate a unique conversation ID based on timestamp
    this.conversationId = `convo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.useProxy) {
          // Using proxy doesn't require an actual WebSocket connection
          // We'll use HTTP fallback when sending messages
          console.log('Using Supabase proxy for ElevenLabs Conversational AI.');
          resolve();
          return;
        }

        // Direct WebSocket connection (original implementation)
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

  public async sendMessage(message: string, context?: string): Promise<void> {
    try {
      if (this.useProxy) {
        // Use HTTP proxy via Supabase edge function
        await this.sendViaProxy(message, context);
        return;
      }
      
      // Original WebSocket implementation
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
    } catch (error) {
      console.error('Error in sendMessage:', error);
      if (this.onError) {
        this.onError(error);
      }
    }
  }

  private async sendViaProxy(message: string, context?: string): Promise<void> {
    try {
      // Fix: Use the correct endpoint for the elevenlabs-proxy function
      const proxyUrl = '/api/functions/v1/elevenlabs-proxy';
      
      console.log(`Sending message to proxy: ${message}`);
      console.log(`Conversation ID: ${this.conversationId}`);
      
      const payload = {
        message,
        conversation_id: this.conversationId,
        context: context || ''
      };
      
      console.log('Sending payload to proxy:', payload);
      
      // Make sure we're including appropriate headers for CORS
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Proxy error: ${response.status} - ${errorText}`);
        throw new Error(`Proxy error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Proxy response:', data);
      
      // Process the response similar to WebSocket
      if (this.onResponse) {
        this.onResponse(data);
      }
      
      // Handle audio data if present
      if (data.audio) {
        if (this.onAudioData) {
          const audioData = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
          this.onAudioData(new Blob([audioData], { type: 'audio/mpeg' }));
        }
      }
      
      // Check if this is the final message
      if (data.isFinal) {
        if (this.onComplete) {
          this.onComplete();
        }
      }
    } catch (error) {
      console.error('Error using proxy:', error);
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
