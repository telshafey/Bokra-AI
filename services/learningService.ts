
import { GoogleGenAI, Type } from "@google/genai";
import type { CourseOutline } from '../types';
import { Language } from '../components/contexts/LanguageContext';

export const generateCourseOutlineWithAI = async (courseTitle: string, language: Language): Promise<CourseOutline> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = language === 'ar' ? `
        أنت خبير في تصميم المناهج التعليمية. مهمتك هي إنشاء مخطط تفصيلي شامل لدورة تدريبية بناءً على عنوان معين.
        يجب أن يكون مخطط الدورة باللغة العربية وأن يتضمن وصفًا تفصيليًا وأهدافًا تعليمية واضحة وقائمة منظمة من الوحدات مع مواضيع محددة.

        عنوان الدورة: "${courseTitle}"

        يرجى إنشاء المحتوى بتنسيق JSON المحدد. تأكد من أن المواضيع داخل كل وحدة محددة وقابلة للتنفيذ.
        يجب أن يكون الوصف جذابًا ويتكون من 2-3 جمل.
        قدم 3-4 أهداف تعليمية رئيسية.
        أنشئ 2-4 وحدات، كل منها يحتوي على 2-3 مواضيع.
    ` : `
        You are an expert instructional designer. Your task is to create a comprehensive course outline based on a given title.
        The course outline must be in English and should include a detailed description, clear learning objectives, and a structured list of modules with specific topics.

        Course Title: "${courseTitle}"

        Please generate the content in the specified JSON format. Ensure the topics within each module are specific and actionable.
        The description should be engaging and around 2-3 sentences.
        Provide 3-4 key learning objectives.
        Create 2-4 modules, each with 2-3 topics.
    `;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            description: { 
                type: Type.STRING,
                description: language === 'ar' ? "وصف موجز وجذاب للدورة." : "A brief and engaging description of the course."
            },
            learningObjectives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: language === 'ar' ? "قائمة بالأهداف التعليمية الرئيسية التي سيحققها المتعلم." : "A list of key learning objectives the learner will achieve."
            },
            modules: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: language === 'ar' ? "عنوان الوحدة التعليمية." : "The title of the learning module." },
                        topics: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: language === 'ar' ? "قائمة بالمواضيع المحددة داخل هذه الوحدة." : "A list of specific topics within this module."
                        }
                    },
                    required: ["title", "topics"]
                },
                description: language === 'ar' ? "قائمة بالوحدات التعليمية التي تشكل هيكل الدورة." : "A list of learning modules that structure the course."
            }
        },
        required: ["description", "learningObjectives", "modules"]
    };


    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
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
