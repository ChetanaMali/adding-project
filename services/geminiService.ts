import { GoogleGenAI, Type } from "@google/genai";
import { Habit } from "../types";

export const getHabitCoaching = async (habits: Habit[]) => {
  if (!process.env.API_KEY || habits.length === 0) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const habitSummary = habits.map(h => `${h.name} (${h.completedDates.length} completions)`).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these habits: ${habitSummary}. Provide a short habit coach response for a high-performance minimalist tracker.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
              description: "Personalized advice to improve these habits.",
            },
            encouragement: {
              type: Type.STRING,
              description: "A punchy, bold motivational quote.",
            },
          },
          required: ["advice", "encouragement"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};