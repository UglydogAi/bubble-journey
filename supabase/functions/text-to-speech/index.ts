
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    // First, convert text to speech using Play.ht API
    const response = await fetch('https://play.ht/api/v2/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PLAY_HT_API_KEY')}`,
        'X-User-ID': Deno.env.get('PLAY_HT_USER_ID')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: 'larry', // Using a default voice, can be made configurable
        quality: 'medium',
        output_format: 'mp3',
        speed: 1,
        sample_rate: 24000
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate speech')
    }

    const result = await response.json()

    // Get the generated audio URL
    const audioUrlResponse = await fetch(`https://play.ht/api/v2/tts/${result.transcriptionId}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PLAY_HT_API_KEY')}`,
        'X-User-ID': Deno.env.get('PLAY_HT_USER_ID')!,
      },
    })

    if (!audioUrlResponse.ok) {
      throw new Error('Failed to get audio URL')
    }

    const audioUrlResult = await audioUrlResponse.json()

    return new Response(
      JSON.stringify({ 
        audioUrl: audioUrlResult.audioUrl,
        status: audioUrlResult.status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
