

export const generateResponse = async (modelId: string, prompt: string): Promise<string> => {
    try {
        // This now calls our own secure Netlify Function
        // instead of OpenRouter directly. The secret API key is handled on the server.
        const response = await fetch('/.netlify/functions/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                modelId: modelId,
                prompt: prompt,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API proxy error:', errorText);
            // Pass the server's error message to the user UI
            throw new Error(errorText || `API request failed with status ${response.status}`);
        }

        const messageContent = await response.text();

        // The proxy now returns the plain text response directly
        return messageContent;

    } catch (error) {
        console.error("Failed to fetch from API proxy:", error);
        // Re-throw the error so it can be handled by the UI component
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
};