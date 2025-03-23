
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Updated API key
const ELEVENLABS_API_KEY = 'sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf';

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if the request contains audio data
    if (!req.body) {
      throw new Error('No audio data provided');
    }

    // Get the audio data as ArrayBuffer
    const audioData = await req.arrayBuffer();
    
    console.log(`Received audio data of size: ${audioData.byteLength} bytes`);
    
    // Endpoint for ElevenLabs speech-to-text
    const elevenlabsUrl = `https://api.elevenlabs.io/v1/speech-recognition`;
    
    console.log(`Forwarding audio to ElevenLabs at: ${elevenlabsUrl}`);
    
    // Create a FormData object to send the audio file
    const formData = new FormData();
    
    // Create a Blob from the ArrayBuffer
    const audioBlob = new Blob([audioData], { type: 'audio/webm' });
    
    // Append the audio blob to the form
    formData.append('audio', audioBlob, 'recording.webm');
    
    // Add the model_id parameter - this is required by ElevenLabs
    formData.append('model_id', 'whisper-1');
    
    // Forward the request to ElevenLabs
    const response = await fetch(elevenlabsUrl, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    // Check for successful response
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ 
          error: `ElevenLabs API error: ${response.status}`,
          details: errorText
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return the response from ElevenLabs
    const responseData = await response.json();
    console.log("Successfully received transcription from ElevenLabs");
    
    return new Response(JSON.stringify({ transcription: responseData.text }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in proxy function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
