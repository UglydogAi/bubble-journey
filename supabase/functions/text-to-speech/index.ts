
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

    // First, create the conversion request
    const conversionResponse = await fetch('https://play.ht/api/v2/tts/convert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PLAY_HT_API_KEY')}`,
        'X-User-ID': Deno.env.get('PLAY_HT_USER_ID')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: 'larry',
        quality: 'medium',
        output_format: 'mp3',
        speed: 1,
        sample_rate: 24000
      }),
    })

    if (!conversionResponse.ok) {
      const error = await conversionResponse.json()
      throw new Error(error.error?.message || 'Failed to start conversion')
    }

    const { transcriptionId } = await conversionResponse.json()

    // Then poll for the status until it's ready
    let attempts = 0
    const maxAttempts = 10
    let audioUrl = null

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://play.ht/api/v2/tts/${transcriptionId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PLAY_HT_API_KEY')}`,
          'X-User-ID': Deno.env.get('PLAY_HT_USER_ID')!,
        },
      })

      if (!statusResponse.ok) {
        throw new Error('Failed to check conversion status')
      }

      const status = await statusResponse.json()
      
      if (status.converted) {
        audioUrl = status.audioUrl
        break
      }

      // Wait for 1 second before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
    }

    if (!audioUrl) {
      throw new Error('Conversion timed out')
    }

    return new Response(
      JSON.stringify({ audioUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
