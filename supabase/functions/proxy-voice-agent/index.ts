
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Retrieve API key from environment variables
const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
// Voice Agent ID for UGLYDOG
const AGENT_ID = "zna9hXvyrwtNwOt5taJ2";

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
    
    // ElevenLabs Conversational AI endpoint
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
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}`, details: errorText }),
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
