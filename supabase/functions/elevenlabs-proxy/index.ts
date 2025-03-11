
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retrieve API key from environment variables
const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY") || "sk_c2822d915c042b181a997206c6b3f1257442239fcebaf247";
const AGENT_ID = "zna9hXvyrwtNwOt5taJ2";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // For WebSocket connections (if needed later)
    if (req.headers.get("Upgrade") === "websocket") {
      console.error("WebSocket connections not supported via the HTTP proxy function");
      return new Response("WebSocket connections must be made directly", { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Regular HTTP request handling
    const { message, conversation_id, context } = await req.json();
    
    // Define the URL for the Conversational AI REST API
    const apiUrl = `https://api.elevenlabs.io/v1/conversational-ai`;
    
    // Forward the request to ElevenLabs
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        message,
        conversation_id: conversation_id || `convo_${Date.now()}`,
        agent_id: AGENT_ID,
        context: context || '',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return the response from ElevenLabs
    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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
