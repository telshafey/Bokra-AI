
import { GoogleGenAI } from "@google/genai";

export const generateFeedbackWithAI = async (rawNotes: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are an expert HR manager and a writing assistant. Your task is to rewrite raw, direct feedback notes into a professional, constructive, and motivational paragraph.
        The feedback should be encouraging, specific, and provide actionable advice.
        Use a positive and supportive tone.
        The output must be in Arabic.

        Here are the raw notes:
        "${rawNotes}"

        Now, please rewrite these notes into a polished feedback paragraph.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating feedback with Gemini:", error);
        return "عذرًا، حدث خطأ أثناء توليد الملاحظات. يرجى المحاولة مرة أخرى.";
    }
};