
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const summarizeAndSuggestKeywords = async (abstract: string): Promise<{ summary: string; keywords: string[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  try {
    const prompt = `Analyze the following academic abstract, provide a one-sentence concise summary, and suggest five relevant keywords.
        
        Abstract: "${abstract}"
        
        Provide the output in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A one-sentence summary of the abstract.",
            },
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "An array of five relevant keywords.",
            },
          },
          required: ["summary", "keywords"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && result.summary && Array.isArray(result.keywords)) {
        return result;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get suggestions from AI. Please try again.");
  }
};
