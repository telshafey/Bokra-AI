
import { GoogleGenAI, Type } from "@google/genai";
import type { CourseOutline } from '../types';

export const generateCourseOutlineWithAI = async (courseTitle: string): Promise<CourseOutline> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are an expert instructional designer. Your task is to create a comprehensive course outline based on a given title.
        The course outline must be in Arabic and should include a detailed description, clear learning objectives, and a structured list of modules with specific topics.

        Course Title: "${courseTitle}"

        Please generate the content in the specified JSON format. Ensure the topics within each module are specific and actionable.
        The description should be engaging and around 2-3 sentences.
        Provide 3-4 key learning objectives.
        Create 2-4 modules, each with 2-3 topics.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { 
                            type: Type.STRING,
                            description: "وصف موجز وجذاب للدورة."
                        },
                        learningObjectives: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "قائمة بالأهداف التعليمية الرئيسية التي سيحققها المتعلم."
                        },
                        modules: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING, description: "عنوان الوحدة التعليمية." },
                                    topics: { 
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                        description: "قائمة بالمواضيع المحددة داخل هذه الوحدة."
                                    }
                                },
                                required: ["title", "topics"]
                            },
                            description: "قائمة بالوحدات التعليمية التي تشكل هيكل الدورة."
                        }
                    },
                    required: ["description", "learningObjectives", "modules"]
                }
            }
        });
        
        const jsonString = response.text;
        const result = JSON.parse(jsonString);
        return result as CourseOutline;

    } catch (error) {
        console.error("Error generating course outline with Gemini:", error);
        throw new Error("Failed to generate course outline from AI service.");
    }
};