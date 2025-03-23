import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Updated API key and agent ID
const ELEVENLABS_API_KEY = 'sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf';
const AGENT_ID = "pNInz6obpgDQGcFmaJgB";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Regular HTTP request handling
    const { message, conversation_id, context } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Define the URL for the Conversational AI REST API
    const apiUrl = `https://api.elevenlabs.io/v1/conversational-ai`;
    
    console.log(`Proxying request to ElevenLabs for conversation: ${conversation_id || 'new'}`);
    console.log(`Message: ${message}`);
    console.log(`API Key: ${ELEVENLABS_API_KEY ? "Present" : "Missing"}`);
    
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
    const data = await response.json();
    console.log(`Successfully received response from ElevenLabs:`, data);
    
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
