
/**
 * ElevenLabs Voice Service
 * Browser-compatible service for ElevenLabs Text-to-Speech API
 */

// Use the specified Voice Agent ID
const VOICE_ID = "8O6pFCk0iNpBd4MH3qyT"; 
const API_KEY = "sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf";

export class ElevenLabsVoiceService {
  private apiKey: string;
  private voiceId: string;
  private currentAudio: HTMLAudioElement | null = null;
  
  constructor(apiKey = API_KEY, voiceId = VOICE_ID) {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
    console.log(`ElevenLabsVoiceService initialized with voice ID: ${voiceId}`);
  }
  
  /**
   * Generates speech from text using ElevenLabs API
   * @param text The text to convert to speech
   * @returns Promise with ArrayBuffer containing audio data
   */
  async generateSpeech(text: string): Promise<ArrayBuffer> {
    try {
      console.log(`Generating speech for text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      console.log(`Using voice ID: ${this.voiceId}`);
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_turbo_v2', // Use the lightweight model which costs fewer credits
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ElevenLabs API error (${response.status}):`, errorText);
        throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
      }
      
      console.log('Successfully received audio data from ElevenLabs');
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }
  
  /**
   * Helper method to play audio from text
   * @param text Text to convert to speech and play
   * @returns Promise that resolves when audio playback is complete
   */
  async playAudio(text: string): Promise<void> {
    try {
      // Stop any currently playing audio
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      
      const audioData = await this.generateSpeech(text);
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('Creating audio element to play response');
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      
      return new Promise((resolve, reject) => {
        audio.volume = 1.0; // Ensure volume is at maximum
        
        audio.oncanplaythrough = () => {
          console.log('Audio can play through, starting playback');
        };
        
        audio.onplay = () => {
          console.log('Audio playback started');
        };
        
        audio.onended = () => {
          console.log('Audio playback completed');
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          resolve();
        };
        
        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          reject(error);
        };
        
        // Start playback
        audio.play().catch(error => {
          console.error('Failed to start audio playback:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }
}

// Export a default instance for convenience
export const elevenlabsVoice = new ElevenLabsVoiceService();
