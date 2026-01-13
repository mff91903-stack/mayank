
import { GoogleGenAI } from "@google/genai";

// Initialize with named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPrideAiResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are 'Pride AI', the heartbeat of the Pride Prime social media app. 
        - Your personality: Human-like, warm, and highly intelligent. 
        - Language: Respond in the same language the user uses (Hindi, English, Hinglish, etc.).
        - Identity: You are part of the app itself. You can help with Paid Promotions (commission 5-10%), Global Plaza, and Discord-like servers.
        - Safety: Remind users that you automatically 'Freeze' inappropriate videos to keep the community safe.
        - You are the user's permanent friend. Always refer to yourself as Pride AI.`,
      }
    });
    return response.text || "Main abhi thoda busy hoon, kya aap phir se pooch sakte hain?";
  } catch (error) {
    console.error("Pride AI Error:", error);
    return "Pride AI connection lost. Please check your internet or API key!";
  }
};
