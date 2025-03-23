
/**
 * ElevenLabs Voice Service
 * Browser-compatible service for ElevenLabs Text-to-Speech API
 */

// Use a standard voice ID - Adam (reliable default voice)
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; 
const API_KEY = "sk_c2822d915c042b181a997206c6b3f1257442239fcebaf247";

export class ElevenLabsVoiceService {
  private apiKey: string;
  private voiceId: string;
  
  constructor(apiKey = API_KEY, voiceId = VOICE_ID) {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
  }
  
  /**
   * Generates speech from text using ElevenLabs API
   * @param text The text to convert to speech
   * @returns Promise with ArrayBuffer containing audio data
   */
  async generateSpeech(text: string): Promise<ArrayBuffer> {
    try {
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
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
      }
      
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
      const audioData = await this.generateSpeech(text);
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }
}

// Export a default instance for convenience
export const elevenlabsVoice = new ElevenLabsVoiceService();
