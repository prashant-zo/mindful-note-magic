
import { toast } from "@/components/ui/sonner";

interface DeepSeekResponse {
  text: string;
}

export const aiService = {
  summarize: async (text: string): Promise<string> => {
    try {
      const apiKey = localStorage.getItem('deepseek_api_key');
      
      if (!apiKey) {
        toast.error("DeepSeek API key not found", {
          description: "Please enter your API key in the settings"
        });
        return "API key required for summarization.";
      }

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes text. Keep summaries concise and focused on key points."
            },
            {
              role: "user",
              content: `Please summarize the following text in a concise way: ${text}`
            }
          ],
          max_tokens: 250,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data: DeepSeekResponse = await response.json();
      return data.text;

    } catch (error) {
      console.error('Error in AI summarization:', error);
      toast.error("Summarization failed", {
        description: "Couldn't generate summary. Please try again later."
      });
      return 'Unable to generate summary at this time.';
    }
  }
};
