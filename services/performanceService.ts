
import { GoogleGenAI } from "@google/genai";
import { Language } from "../components/contexts/LanguageContext";

export const generateFeedbackWithAI = async (rawNotes: string, language: Language): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = language === 'ar' ? `
        أنت مدير موارد بشرية خبير ومساعد كتابة. مهمتك هي إعادة صياغة ملاحظات تقييم أولية ومباشرة إلى فقرة احترافية وبناءة ومحفزة.
        يجب أن تكون الملاحظات مشجعة ومحددة وتقدم نصائح قابلة للتنفيذ.
        استخدم نبرة إيجابية وداعمة.
        يجب أن يكون الناتج باللغة العربية.

        إليك الملاحظات الأولية:
        "${rawNotes}"

        الآن، يرجى إعادة كتابة هذه الملاحظات في فقرة تقييم مصقولة.
    ` : `
        You are an expert HR manager and a writing assistant. Your task is to rewrite raw, direct feedback notes into a professional, constructive, and motivational paragraph.
        The feedback should be encouraging, specific, and provide actionable advice.
        Use a positive and supportive tone.
        The output must be in English.

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
        const errorMessage = language === 'ar' ? "عذرًا، حدث خطأ أثناء توليد الملاحظات. يرجى المحاولة مرة أخرى." : "Sorry, an error occurred while generating feedback. Please try again.";
        return errorMessage;
    }
};
