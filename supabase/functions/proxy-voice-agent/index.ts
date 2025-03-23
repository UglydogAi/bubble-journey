
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Updated API key and agent ID
const ELEVENLABS_API_KEY = 'sk_de8e3854a6d2b040110a01edc86e978b953ce4530f06cbaf';
// Voice Agent ID for WIZ
const AGENT_ID = "8O6pFCk0iNpBd4MH3qyT";

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
    // Parse the request body
    const body = await req.text();
    console.log("Received request body:", body);
    
    // Update: Use the correct endpoint URL for ElevenLabs Conversational AI
    const elevenlabsUrl = `https://api.elevenlabs.io/v1/conversational-ai`;
    
    console.log(`Forwarding request to ElevenLabs at: ${elevenlabsUrl}`);
    console.log(`API Key present: ${ELEVENLABS_API_KEY ? "Yes" : "No"}`);
    
    // Forward the request to ElevenLabs with the agent_id in the body
    const bodyObj = JSON.parse(body);
    const updatedBody = JSON.stringify({
      ...bodyObj,
      agent_id: AGENT_ID
    });
    
    // Forward the request to ElevenLabs
    const response = await fetch(elevenlabsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY || "",
      },
      body: updatedBody,
    });

    // Check for successful response
    if (!response.ok) {
      console.error(`ElevenLabs API error: ${response.status} - ${await response.text()}`);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return the response from ElevenLabs
    const responseBody = await response.text();
    console.log("Successfully received response from ElevenLabs");
    
    return new Response(responseBody, {
      status: response.status,
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
