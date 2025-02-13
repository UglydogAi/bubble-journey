
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

    const apiKey = Deno.env.get('PLAY_HT_API_KEY')
    const userId = Deno.env.get('PLAY_HT_USER_ID')

    if (!apiKey || !userId) {
      console.error('Missing credentials:', {
        hasApiKey: !!apiKey,
        hasUserId: !!userId
      })
      throw new Error('Missing Play.ht credentials')
    }

    console.log('Starting conversion with Play.ht for text:', text)
    console.log('API Key present:', !!apiKey)
    console.log('User ID present:', !!userId)

    // First, create the conversion request
    const conversionResponse = await fetch('https://api.play.ht/api/v2/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,  // Added back 'Bearer ' prefix
        'X-User-ID': userId,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice: '27dc00307e408422454f681a8f0a3c774757ed34672d48a99a5b0a96c527fbd0',
        quality: 'high',
        output_format: 'mp3',
        speed: 1,
        sample_rate: 24000
      }),
    })

    if (!conversionResponse.ok) {
      const errorData = await conversionResponse.json()
      console.error('Play.ht conversion error details:', {
        status: conversionResponse.status,
        statusText: conversionResponse.statusText,
        error: errorData
      })
      throw new Error(`Failed to start conversion: ${JSON.stringify(errorData)}`)
    }

    const conversionData = await conversionResponse.json()
    console.log('Conversion started successfully:', conversionData)

    const { transcriptionId } = conversionData

    if (!transcriptionId) {
      console.error('No transcriptionId in response:', conversionData)
      throw new Error('Invalid response from Play.ht')
    }

    // Then poll for the status until it's ready
    let attempts = 0
    const maxAttempts = 10
    let audioUrl = null

    while (attempts < maxAttempts) {
      console.log(`Checking conversion status attempt ${attempts + 1}/${maxAttempts}`)
      
      const statusResponse = await fetch(`https://api.play.ht/api/v2/tts/${transcriptionId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,  // Added back 'Bearer ' prefix
          'X-User-ID': userId,
          'Accept': 'application/json',
        },
      })

      if (!statusResponse.ok) {
        const errorData = await statusResponse.json()
        console.error('Status check error:', {
          status: statusResponse.status,
          statusText: statusResponse.statusText,
          error: errorData
        })
        throw new Error('Failed to check conversion status')
      }

      const status = await statusResponse.json()
      console.log('Status check response:', status)
      
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

    console.log('Successfully generated audio URL:', audioUrl)

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
