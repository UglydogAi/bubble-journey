
/**
 * Browser Speech Synthesis Service
 * Fallback service using the browser's built-in speech synthesis
 */

class BrowserSpeechService {
  private synth: SpeechSynthesis;
  
  constructor() {
    this.synth = window.speechSynthesis;
  }
  
  /**
   * Speaks the given text using browser's speech synthesis
   */
  async playAudio(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        this.synth.cancel();
        
        // Create a new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure the voice (try to use a deep male voice if available)
        const voices = this.synth.getVoices();
        const englishVoices = voices.filter(voice => voice.lang.includes('en'));
        if (englishVoices.length > 0) {
          // Try to find a male voice
          const maleVoice = englishVoices.find(voice => voice.name.toLowerCase().includes('male'));
          utterance.voice = maleVoice || englishVoices[0];
        }
        
        // Set properties for the coach-like voice
        utterance.rate = 0.9;  // Slightly slower
        utterance.pitch = 0.8; // Deeper voice
        utterance.volume = 1.0; // Full volume
        
        // Setup event handlers
        utterance.onend = () => {
          resolve();
        };
        
        utterance.onerror = (event) => {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
        
        // Start speaking
        this.synth.speak(utterance);
      } catch (error) {
        console.error('Browser speech synthesis error:', error);
        reject(error);
      }
    });
  }
}

// Export a default instance
export const browserSpeech = new BrowserSpeechService();
