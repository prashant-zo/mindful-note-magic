
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const aiService = {
  summarize: async (text: string): Promise<string> => {
    try {
      const apiKey = localStorage.getItem('gemini_api_key');
      
      if (!apiKey) {
        toast.error("Gemini API key not found", {
          description: "Please enter your API key in the settings"
        });
        return "API key required for summarization.";
      }

      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Please summarize the following text in a concise way:\n\n${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content.parts[0]?.text || 'Unable to generate summary.';

    } catch (error) {
      console.error('Error in AI summarization:', error);
      toast.error("Summarization failed", {
        description: "Couldn't generate summary. Please try again later."
      });
      return 'Unable to generate summary at this time.';
    }
  }
};
