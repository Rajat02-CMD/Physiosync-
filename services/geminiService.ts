
import { GoogleGenAI, Type } from "@google/genai";

// Always use the process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExercisePlan = async (condition: string, severity: number) => {
  try {
    // Physiotherapy planning involves medical reasoning, which is a complex task. 
    // Using gemini-3-pro-preview as per guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Suggest 3 physiotherapy exercises for a patient with: ${condition}. Severity level: ${severity}/10. 
      Format the output as a JSON array of objects with 'title', 'description', and 'duration'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              duration: { type: Type.STRING }
            },
            required: ["title", "description", "duration"]
          }
        }
      }
    });

    // response.text is a property, not a method.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const analyzeRecoveryProgress = async (logs: any[]) => {
  try {
    // Summarization is a basic text task.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these recovery logs and provide a short 2-sentence summary of the patient's progress: ${JSON.stringify(logs)}`,
    });
    // Access the .text property directly.
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Progress analysis currently unavailable.";
  }
};
