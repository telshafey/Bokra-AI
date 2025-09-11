import { GoogleGenAI, Type } from "@google/genai";
import type { EmployeeProfile, TurnoverAnalysisResult } from '../types';
import { Language } from "../components/contexts/LanguageContext";

function getYearsOfService(hireDate: string): number {
    const start = new Date(hireDate);
    const now = new Date();
    const diffInMs = now.getTime() - start.getTime();
    return parseFloat((diffInMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
}

export const getTurnoverPrediction = async (employee: EmployeeProfile, language: Language): Promise<TurnoverAnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not set in environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const yearsOfService = getYearsOfService(employee.hireDate);
    const timeSincePromotion = employee.lastPromotionDate 
        ? getYearsOfService(employee.lastPromotionDate)
        : null;

    const employeeData = {
        yearsOfService,
        performanceScore: employee.performanceScore,
        satisfactionSurveyScore: employee.satisfactionSurveyScore,
        timeSinceLastPromotionInYears: timeSincePromotion,
        salaryComparedToMarket: employee.salaryComparedToMarket,
        departmentKey: employee.departmentKey,
        title: employee.title,
    };
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Unknown"] },
            riskScore: { type: Type.NUMBER },
            keyFactors: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ["riskLevel", "riskScore", "keyFactors"]
    };

    const prompt = language === 'ar' ? `
        أنت خبير تحليل موارد بشرية. مهمتك هي توقع مخاطر تسرب الموظفين بناءً على البيانات المقدمة.
        حلل بيانات الموظف المجهولة التالية وأرجع توقعاتك ككائن JSON صالح بالهيكل المحدد.
        
        البيانات:
        ${JSON.stringify(employeeData, null, 2)}
        
        اعتبر عوامل مثل الرضا المنخفض، والأداء المنخفض، والوقت الطويل دون ترقية، والراتب الأقل من متوسط السوق كمؤشرات لمخاطر عالية. الأداء المرتفع المقترن بالرضا المنخفض والراتب الأقل من السوق هو عامل خطر عالٍ جدًا. الخدمة الطويلة مع الترقيات المستمرة والتقييمات الجيدة هي مخاطر منخفضة.
    ` : `
        You are an expert HR analyst. Your task is to predict the employee turnover risk based on the provided data.
        Analyze the following anonymous employee data and return your prediction as a valid JSON object with the specified structure.
        
        Data:
        ${JSON.stringify(employeeData, null, 2)}
        
        Consider factors like low satisfaction, low performance, long time without promotion, and salary being below market average as indicators of high risk. High performance coupled with low satisfaction and below-market salary is a very high risk factor. Long tenure with consistent promotions and good scores is low risk.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as TurnoverAnalysisResult;

    } catch (error) {
        console.error("Error getting turnover prediction from Gemini:", error);
        const errorMessage = language === 'ar' ? 'فشل استرداد التحليل من خدمة الذكاء الاصطناعي.' : 'Failed to retrieve analysis from AI service.';
        return {
            riskLevel: 'Unknown',
            riskScore: 0,
            keyFactors: [errorMessage]
        };
    }
};