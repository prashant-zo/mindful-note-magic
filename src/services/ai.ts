
import { toast } from "@/components/ui/sonner";

// This is a mock AI service
// In a real app, you would use a real AI API like DeepSeek or Groq
export const aiService = {
  summarize: async (text: string): Promise<string> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, create a simple summary
      // In a real implementation, this would call an actual AI API
      
      // Find first sentence
      const firstSentenceEnd = text.search(/[.!?]/);
      const firstSentence = firstSentenceEnd > 0 
        ? text.substring(0, firstSentenceEnd + 1) 
        : '';
      
      // Count paragraphs
      const paragraphs = text.split(/\n\n+/).filter(Boolean);
      const paragraphCount = paragraphs.length;
      
      // Extract key phrases
      const words = text.split(/\s+/);
      const keyWords = words
        .filter(word => word.length > 5)
        .filter(word => !word.match(/[0-9]/))
        .map(word => word.replace(/[.,!?;:()]/g, ''))
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 5);
      
      // Create a summary based on text length
      if (text.length < 100) {
        return firstSentence || text;
      }
      
      let summary = firstSentence;
      
      if (paragraphCount > 1) {
        summary += ` Contains ${paragraphCount} sections.`;
      }
      
      if (keyWords.length > 0) {
        summary += ` Key topics include: ${keyWords.join(', ')}.`;
      }
      
      // For longer text, add a generated conclusion
      if (text.length > 300) {
        const topics = keyWords.length > 0 ? 
          `The note discusses ${keyWords.slice(0, 3).join(', ')}.` : 
          'The note covers multiple topics.';
        
        summary += ` ${topics}`;
      }
      
      return summary;
    } catch (error) {
      console.error('Error in AI summarization:', error);
      toast.error("Summarization failed", {
        description: "Couldn't generate summary. Please try again later."
      });
      return 'Unable to generate summary at this time.';
    }
  }
};
