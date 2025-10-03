// /netlify/functions/generate.js
// This is a Netlify Function that acts as a secure proxy to the OpenRouter API.

export default async (request) => {
  // Only allow POST requests for this endpoint.
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // Parse the model ID and prompt from the request body sent by the frontend.
    const { modelId, prompt } = await request.json();

    if (!modelId || !prompt) {
      return new Response('Missing modelId or prompt in request body', { status: 400 });
    }

    // Securely access the OpenRouter API key from Netlify's environment variables.
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        // This error is for the developer/server logs, not the user.
        console.error('Server configuration error: OPENROUTER_API_KEY is not set.');
        return new Response('Server configuration error.', { status: 500 });
    }

    // Make the actual API call to OpenRouter from the server.
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
        }),
    });

    // If OpenRouter returns an error, forward a helpful message.
    if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenRouter API error:', errorData);
        const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
        return new Response(errorMessage, { status: response.status });
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content;

    if (!messageContent) {
        console.error('Invalid response structure from OpenRouter API:', data);
        return new Response('Could not parse a valid response from the AI.', { status: 500 });
    }

    // Send the extracted text content back to the frontend as a plain text response.
    return new Response(messageContent.trim(), {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error("Error in generate function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
    return new Response(errorMessage, { status: 500 });
  }
};
